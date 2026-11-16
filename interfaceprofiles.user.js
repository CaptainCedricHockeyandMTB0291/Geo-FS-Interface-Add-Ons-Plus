
// ==UserScript==
// @name         GeoFS Interface Profiles
// @namespace    https://github.com/CaptainCedricHockeyandMTB0291/Geo-FS-Interface-Add-Ons-Plus
// @version      1.0.0
// @description  Save and switch appearance profiles for compatible GeoFS add-ons.
// @author       GeoFS Interface Plus contributors
// @match        https://www.geo-fs.com/*
// @match        https://geo-fs.com/*
// @match        https://beta.geo-fs.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
    "use strict";

    const ROOT_ID = "geofs-interface-profiles-root";
    const PROFILES_KEY = "geofsInterfacePlusProfiles";
    const THEME_KEY = "geofsInterfacePlusTheme";

    if (document.getElementById(ROOT_ID)) return;

    const DEFAULT_THEME = {
        theme: "dark",
        accent: "#10a37f",
        textSize: "medium",
        density: "comfortable",
        transparency: 96,
        roundness: 14
    };

    const BUILT_IN_PROFILES = [
        {
            id: "compact",
            name: "Compact",
            builtIn: true,
            settings: {
                theme: "dark",
                accent: "#10a37f",
                textSize: "small",
                density: "compact",
                transparency: 96,
                roundness: 10
            }
        },
        {
            id: "standard",
            name: "Standard",
            builtIn: true,
            settings: { ...DEFAULT_THEME }
        },
        {
            id: "spacious",
            name: "Spacious",
            builtIn: true,
            settings: {
                theme: "light",
                accent: "#2563eb",
                textSize: "large",
                density: "spacious",
                transparency: 98,
                roundness: 20
            }
        }
    ];

    function normalizeSettings(settings) {
        const source = settings && typeof settings === "object"
            ? settings
            : {};

        const validThemes = ["dark", "light", "system"];
        const validTextSizes = ["small", "medium", "large"];
        const validDensities = ["compact", "comfortable", "spacious"];

        const accent = typeof source.accent === "string" &&
            /^#[0-9a-f]{6}$/i.test(source.accent)
            ? source.accent
            : DEFAULT_THEME.accent;

        return {
            theme: validThemes.includes(source.theme)
                ? source.theme : DEFAULT_THEME.theme,
            accent,
            textSize: validTextSizes.includes(source.textSize)
                ? source.textSize : DEFAULT_THEME.textSize,
            density: validDensities.includes(source.density)
                ? source.density : DEFAULT_THEME.density,
            transparency: Math.min(100, Math.max(65,
                Number.isFinite(Number(source.transparency))
                    ? Number(source.transparency)
                    : DEFAULT_THEME.transparency
            )),
            roundness: Math.min(28, Math.max(0,
                Number.isFinite(Number(source.roundness))
                    ? Number(source.roundness)
                    : DEFAULT_THEME.roundness
            ))
        };
    }

    function loadProfiles() {
        try {
            const stored = JSON.parse(
                localStorage.getItem(PROFILES_KEY) || "[]"
            );

            if (!Array.isArray(stored)) return [];

            return stored
                .filter(profile =>
                    profile &&
                    typeof profile.id === "string" &&
                    typeof profile.name === "string" &&
                    profile.builtIn !== true
                )
                .map(profile => ({
                    id: profile.id,
                    name: profile.name.slice(0, 40),
                    builtIn: false,
                    settings: normalizeSettings(profile.settings)
                }));
        } catch (error) {
            console.warn("[Interface Profiles] Could not load profiles:", error);
            return [];
        }
    }

    function loadTheme() {
        try {
            return normalizeSettings(
                JSON.parse(localStorage.getItem(THEME_KEY) || "{}")
            );
        } catch {
            return { ...DEFAULT_THEME };
        }
    }

    let customProfiles = loadProfiles();
    let currentSettings = loadTheme();
    let selectedId = "standard";

    function saveProfiles() {
        try {
            localStorage.setItem(
                PROFILES_KEY,
                JSON.stringify(customProfiles)
            );
            return true;
        } catch (error) {
            console.warn("[Interface Profiles] Could not save profiles:", error);
            alert("Could not save profiles. Check browser storage.");
            return false;
        }
    }

    function saveTheme() {
        try {
            localStorage.setItem(
                THEME_KEY,
                JSON.stringify(currentSettings)
            );

            window.dispatchEvent(new StorageEvent("storage", {
                key: THEME_KEY,
                newValue: JSON.stringify(currentSettings),
                storageArea: localStorage
            }));

            return true;
        } catch (error) {
            console.warn("[Interface Profiles] Could not save theme:", error);
            alert("Could not save appearance settings.");
            return false;
        }
    }

    function createId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return "profile-" + Date.now() + "-" +
            Math.random().toString(36).slice(2, 9);
    }

    function allProfiles() {
        return [...BUILT_IN_PROFILES, ...customProfiles];
    }

    const host = document.createElement("div");
    host.id = ROOT_ID;
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });

    shadow.innerHTML = `
        <style>
            :host {
                all: initial;
                position: fixed;
                inset: 0;
                z-index: 2147482996;
                pointer-events: none;
                font-family: Arial, Helvetica, sans-serif;
            }

            * { box-sizing: border-box; }

            button, input, select { font: inherit; }

            .launcher {
                position: fixed;
                left: 192px;
                bottom: 18px;
                width: 49px;
                height: 49px;
                border: 0;
                border-radius: 50%;
                background: var(--accent);
                color: white;
                font-size: 20px;
                cursor: pointer;
                pointer-events: auto;
                box-shadow: 0 4px 18px #0005;
            }

            .panel {
                display: none;
                position: fixed;
                top: 65px;
                left: 192px;
                width: min(430px, calc(100vw - 36px));
                max-height: calc(100vh - 100px);
                overflow: hidden;
                flex-direction: column;
                background: var(--panel);
                color: var(--text);
                border: 1px solid var(--border);
                border-radius: var(--roundness);
                box-shadow: 0 12px 40px #0005;
                pointer-events: auto;
                opacity: var(--opacity);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
            }

            .panel.open { display: flex; }

            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px;
                border-bottom: 1px solid var(--border);
                cursor: move;
                touch-action: none;
                user-select: none;
            }

            .heading { font-size: 15px; font-weight: 700; }
            .subtitle { margin-top: 4px; font-size: 11px; opacity: .65; }

            .header button, .secondary {
                border: 1px solid var(--border);
                background: var(--control);
                color: var(--text);
                border-radius: 8px;
                padding: 7px 10px;
                cursor: pointer;
            }

            .content {
                overflow-y: auto;
                padding: 13px;
            }

            .section-title {
                margin: 3px 0 10px;
                font-size: 13px;
                font-weight: 700;
            }

            .profile-list {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 16px;
            }

            .profile {
                min-width: 0;
                padding: 11px;
                border: 1px solid var(--border);
                border-radius: 10px;
                background: var(--control);
                color: var(--text);
                text-align: left;
                cursor: pointer;
            }

            .profile.active {
                border: 2px solid var(--accent);
                padding: 10px;
            }

            .profile-name {
                font-size: 13px;
                font-weight: 700;
                overflow-wrap: anywhere;
            }

            .profile-type {
                margin-top: 5px;
                font-size: 10px;
                opacity: .65;
            }

            .field {
                margin-bottom: 13px;
            }

            .field label {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 6px;
                font-size: 12px;
            }

            .field input[type="text"],
            .field select {
                width: 100%;
                padding: 9px;
                border: 1px solid var(--border);
                border-radius: 8px;
                background: var(--control);
                color: var(--text);
                outline-color: var(--accent);
            }

            .field input[type="range"] {
                width: 100%;
                accent-color: var(--accent);
            }

            .field input[type="color"] {
                width: 48px;
                height: 32px;
                padding: 2px;
                border: 1px solid var(--border);
                border-radius: 7px;
                background: var(--control);
                cursor: pointer;
            }

            .color-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            }

            .actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-top: 14px;
            }

            .primary {
                border: 0;
                border-radius: 9px;
                padding: 10px;
                background: var(--accent);
                color: white;
                font-weight: 700;
                cursor: pointer;
            }

            .actions button { width: 100%; }

            .profile-actions {
                display: flex;
                gap: 7px;
                margin-top: 12px;
            }

            .profile-actions button { flex: 1; }

            .notice {
                margin-bottom: 14px;
                padding: 10px;
                border: 1px solid var(--border);
                border-radius: 9px;
                font-size: 11px;
                line-height: 1.5;
                opacity: .75;
            }

            .footer {
                padding: 9px;
                text-align: center;
                font-size: 10px;
                opacity: .6;
                border-top: 1px solid var(--border);
            }

            @media (max-width: 480px) {
                .panel {
                    top: 10px;
                    left: 10px;
                    width: calc(100vw - 20px);
                    max-height: calc(100vh - 75px);
                }

                .launcher {
                    left: 192px;
                    bottom: 14px;
                }
            }
        </style>

        <button class="launcher" title="Interface Profiles"
            aria-label="Open Interface Profiles">🎛</button>

        <section class="panel" aria-label="GeoFS Interface Profiles">
            <div class="header">
                <div>
                    <div class="heading">🎛 Interface Profiles</div>
                    <div class="subtitle">Your add-on appearance presets</div>
                </div>
                <button class="close" aria-label="Close panel">✕</button>
            </div>

            <div class="content">
                <div class="notice">
                    Profiles change the shared appearance preferences used by
                    compatible GeoFS add-ons. They do not change GeoFS's
                    built-in simulator controls or graphics.
                </div>

                <div class="section-title">Choose a profile</div>
                <div class="profile-list"></div>

                <div class="section-title">Appearance settings</div>

                <div class="field">
                    <label for="theme">Theme</label>
                    <select id="theme">
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="system">System</option>
                    </select>
                </div>

                <div class="field color-row">
                    <label for="accent">Accent colour</label>
                    <input id="accent" type="color" value="#10a37f">
                </div>

                <div class="field">
                    <label for="text-size">Text size</label>
                    <select id="text-size">
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </div>

                <div class="field">
                    <label for="density">Interface density</label>
                    <select id="density">
                        <option value="compact">Compact</option>
                        <option value="comfortable">Comfortable</option>
                        <option value="spacious">Spacious</option>
                    </select>
                </div>

                <div class="field">
                    <label for="transparency">
                        Panel transparency
                        <span class="transparency-value">96%</span>
                    </label>
                    <input id="transparency" type="range"
                        min="65" max="100" value="96">
                </div>

                <div class="field">
                    <label for="roundness">
                        Corner roundness
                        <span class="roundness-value">14</span>
                    </label>
                    <input id="roundness" type="range"
                        min="0" max="28" value="14">
                </div>

                <div class="actions">
                    <button class="primary apply">Apply settings</button>
                    <button class="secondary reset">Reset defaults</button>
                    <button class="primary save-new">Save as new profile</button>
                    <button class="secondary rename">Rename selected</button>
                    <button class="secondary update">Update selected</button>
                    <button class="secondary delete">Delete selected</button>
                </div>
            </div>

            <div class="footer">
                Geo-FS-Interface-Add-Ons-Plus · Local profile storage
            </div>
        </section>
    `;

    const $ = selector => shadow.querySelector(selector);
    const panel = $(".panel");

    function readCurrentForm() {
        return normalizeSettings({
            theme: $("#theme").value,
            accent: $("#accent").value,
            textSize: $("#text-size").value,
            density: $("#density").value,
            transparency: Number($("#transparency").value),
            roundness: Number($("#roundness").value)
        });
    }

    function fillForm(settings) {
        currentSettings = normalizeSettings(settings);

        $("#theme").value = currentSettings.theme;
        $("#accent").value = currentSettings.accent;
        $("#text-size").value = currentSettings.textSize;
        $("#density").value = currentSettings.density;
        $("#transparency").value = currentSettings.transparency;
        $("#roundness").value = currentSettings.roundness;

        updateRangeLabels();
    }

    function updateRangeLabels() {
        $(".transparency-value").textContent =
            $("#transparency").value + "%";
        $(".roundness-value").textContent =
            $("#roundness").value;
    }

    function applyCurrentSettings() {
        currentSettings = readCurrentForm();

        if (saveTheme()) {
            alert("Appearance settings applied and saved.");
        }
    }

    function renderProfiles() {
        const container = $(".profile-list");
        container.replaceChildren();

        allProfiles().forEach(profile => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "profile" +
                (selectedId === profile.id ? " active" : "");

            const name = document.createElement("div");
            name.className = "profile-name";
            name.textContent = profile.name;

            const type = document.createElement("div");
            type.className = "profile-type";
            type.textContent = profile.builtIn ? "Built-in preset" : "Custom profile";

            button.append(name, type);

            button.addEventListener("click", () => {
                selectedId = profile.id;
                fillForm(profile.settings);
                renderProfiles();
            });

            container.appendChild(button);
        });
    }

    function selectedProfile() {
        return allProfiles().find(profile => profile.id === selectedId);
    }

    function saveNewProfile() {
        const name = prompt("Enter a name for your new profile:");

        if (name === null) return;

        const cleanName = name.trim().slice(0, 40);

        if (!cleanName) {
            alert("Enter a profile name.");
            return;
        }

        const duplicate = allProfiles().some(profile =>
            profile.name.toLowerCase() === cleanName.toLowerCase()
        );

        if (duplicate) {
            alert("A profile with that name already exists.");
            return;
        }

        const profile = {
            id: createId(),
            name: cleanName,
            builtIn: false,
            settings: readCurrentForm()
        };

        customProfiles.push(profile);

        if (saveProfiles()) {
            selectedId = profile.id;
            renderProfiles();
            alert("Your new profile has been saved.");
        }
    }

    function renameSelected() {
        const profile = selectedProfile();

        if (!profile) return;

        if (profile.builtIn) {
            alert("Built-in presets cannot be renamed. Save one as a custom profile first.");
            return;
        }

        const name = prompt("Enter the new profile name:", profile.name);

        if (name === null) return;

        const cleanName = name.trim().slice(0, 40);

        if (!cleanName) {
            alert("Enter a profile name.");
            return;
        }

        const duplicate = allProfiles().some(item =>
            item.id !== profile.id &&
            item.name.toLowerCase() === cleanName.toLowerCase()
        );

        if (duplicate) {
            alert("A profile with that name already exists.");
            return;
        }

        profile.name = cleanName;

        if (saveProfiles()) {
            renderProfiles();
            alert("Profile renamed.");
        }
    }

    function updateSelected() {
        const profile = selectedProfile();

        if (!profile) return;

        if (profile.builtIn) {
            alert("Built-in presets cannot be overwritten. Save your changes as a custom profile.");
            return;
        }

        if (!confirm(`Replace the saved settings for "${profile.name}"?`)) {
            return;
        }

        profile.settings = readCurrentForm();

        if (saveProfiles()) {
            alert("Profile updated.");
        }
    }

    function deleteSelected() {
        const profile = selectedProfile();

        if (!profile) return;

        if (profile.builtIn) {
            alert("Built-in presets cannot be deleted.");
            return;
        }

        if (!confirm(`Delete the profile "${profile.name}"?`)) {
            return;
        }

        customProfiles = customProfiles.filter(item =>
            item.id !== profile.id
        );

        if (saveProfiles()) {
            selectedId = "standard";
            const standard = BUILT_IN_PROFILES.find(item =>
                item.id === "standard"
            );

            fillForm(standard.settings);
            renderProfiles();
        }
    }

    $(".launcher").addEventListener("click", () => {
        panel.classList.toggle("open");
        if (panel.classList.contains("open")) {
            fillForm(loadTheme());
        }
    });

    $(".close").addEventListener("click", () => {
        panel.classList.remove("open");
    });

    $(".apply").addEventListener("click", applyCurrentSettings);

    $(".reset").addEventListener("click", () => {
        if (!confirm("Reset the appearance settings to the default values?")) {
            return;
        }

        selectedId = "standard";
        fillForm(DEFAULT_THEME);
        renderProfiles();
        applyCurrentSettings();
    });

    $(".save-new").addEventListener("click", saveNewProfile);
    $(".rename").addEventListener("click", renameSelected);
    $(".update").addEventListener("click", updateSelected);
    $(".delete").addEventListener("click", deleteSelected);

    $("#transparency").addEventListener("input", updateRangeLabels);
    $("#roundness").addEventListener("input", updateRangeLabels);

    // Drag the panel using its header.
    const header = $(".header");
    let drag = null;

    header.addEventListener("pointerdown", event => {
        if (event.target.closest("button")) return;

        const rect = panel.getBoundingClientRect();

        drag = {
            x: event.clientX,
            y: event.clientY,
            left: rect.left,
            top: rect.top
        };

        header.setPointerCapture(event.pointerId);
    });

    header.addEventListener("pointermove", event => {
        if (!drag) return;

        const left = Math.max(0, Math.min(
            window.innerWidth - panel.offsetWidth,
            drag.left + event.clientX - drag.x
        ));

        const top = Math.max(0, Math.min(
            window.innerHeight - 60,
            drag.top + event.clientY - drag.y
        ));

        panel.style.left = left + "px";
        panel.style.right = "auto";
        panel.style.top = top + "px";
    });

    function stopDragging() {
        drag = null;
    }

    header.addEventListener("pointerup", stopDragging);
    header.addEventListener("pointercancel", stopDragging);

    // Refresh the manager if another compatible add-on changes the theme.
    window.addEventListener("storage", event => {
        if (event.key === THEME_KEY) {
            currentSettings = loadTheme();
            if (panel.classList.contains("open")) fillForm(currentSettings);
        }
    });

    const standard = BUILT_IN_PROFILES.find(item =>
        item.id === "standard"
    );

    fillForm(loadTheme());
    renderProfiles();

    console.info("[GeoFS Interface Profiles] Loaded.");
})();
