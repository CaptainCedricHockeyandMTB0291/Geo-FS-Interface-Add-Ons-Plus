
// ==UserScript==
// @name         GeoFS UI Enhancer
// @namespace    https://github.com/CaptainCedricHockeyandMTB0291/Geo-FS-Interface-Add-Ons-Plus
// @version      1.0.0
// @description  Customizable themes and interface settings for GeoFS add-ons.
// @author       GeoFS Interface Plus contributors
// @match        https://www.geo-fs.com/*
// @match        https://geo-fs.com/*
// @match        https://beta.geo-fs.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
    "use strict";

    const ROOT_ID = "geofs-ui-enhancer-root";
    const STORAGE_KEY = "geofsInterfacePlusTheme";

    if (document.getElementById(ROOT_ID)) return;

    const defaults = {
        theme: "dark",
        accent: "#10a37f",
        textSize: "medium",
        density: "comfortable",
        transparency: 96,
        roundness: 14
    };

    function loadSettings() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return { ...defaults, ...(saved || {}) };
        } catch {
            return { ...defaults };
        }
    }

    let settings = loadSettings();

    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.warn("[GeoFS UI Enhancer] Could not save settings:", error);
        }
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
                z-index: 2147483000;
                pointer-events: none;
                font-family: Arial, Helvetica, sans-serif;
            }

            * {
                box-sizing: border-box;
            }

            .launcher {
                position: fixed;
                right: 18px;
                bottom: 18px;
                width: 48px;
                height: 48px;
                border: 0;
                border-radius: 50%;
                background: var(--accent);
                color: white;
                font-size: 21px;
                cursor: pointer;
                pointer-events: auto;
                box-shadow: 0 4px 18px #0005;
            }

            .panel {
                position: fixed;
                top: 85px;
                right: 18px;
                width: min(350px, calc(100vw - 24px));
                max-height: min(680px, calc(100vh - 110px));
                overflow-y: auto;
                background: var(--panel);
                color: var(--text);
                border: 1px solid var(--border);
                border-radius: var(--roundness);
                box-shadow: 0 12px 40px #0005;
                pointer-events: auto;
                display: none;
                opacity: var(--opacity);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
            }

            .panel.open {
                display: block;
            }

            .header {
                padding: 15px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid var(--border);
                cursor: move;
                user-select: none;
                touch-action: none;
            }

            .heading {
                font-size: 15px;
                font-weight: 700;
            }

            .subheading {
                margin-top: 4px;
                font-size: 11px;
                opacity: .65;
            }

            .header-actions {
                display: flex;
                gap: 7px;
            }

            button, select, input {
                font: inherit;
            }

            .icon-button {
                border: 1px solid var(--border);
                background: var(--control);
                color: var(--text);
                border-radius: 8px;
                padding: 6px 9px;
                cursor: pointer;
            }

            .content {
                padding: var(--spacing);
            }

            .section {
                margin-bottom: 17px;
            }

            .section-title {
                font-size: 12px;
                font-weight: 700;
                margin-bottom: 9px;
                opacity: .75;
                text-transform: uppercase;
                letter-spacing: .5px;
            }

            .setting {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin: 10px 0;
                font-size: var(--font-size);
            }

            .setting label {
                flex: 1;
            }

            select {
                width: 145px;
                max-width: 52%;
                padding: 8px;
                border-radius: 8px;
                border: 1px solid var(--border);
                background: var(--control);
                color: var(--text);
            }

            input[type="range"] {
                width: 125px;
                accent-color: var(--accent);
            }

            input[type="color"] {
                width: 42px;
                height: 30px;
                padding: 2px;
                border: 1px solid var(--border);
                background: transparent;
                cursor: pointer;
            }

            .value {
                min-width: 36px;
                text-align: right;
                font-size: 11px;
                opacity: .7;
            }

            .footer {
                padding: 12px 15px;
                border-top: 1px solid var(--border);
                font-size: 11px;
                opacity: .65;
                text-align: center;
            }

            .reset {
                width: 100%;
                border: 0;
                padding: 10px;
                border-radius: 9px;
                color: white;
                background: var(--accent);
                cursor: pointer;
                font-weight: 700;
            }

            .reset:hover, .launcher:hover {
                filter: brightness(1.1);
            }

            @media (max-width: 480px) {
                .panel {
                    top: 12px;
                    right: 12px;
                    width: calc(100vw - 24px);
                    max-height: calc(100vh - 80px);
                }

                .launcher {
                    right: 14px;
                    bottom: 14px;
                }
            }
        </style>

        <button class="launcher" aria-label="Open UI settings" title="GeoFS UI Enhancer">⚙</button>

        <section class="panel" aria-label="GeoFS UI Enhancer settings">
            <div class="header">
                <div>
                    <div class="heading">✈️ GeoFS UI Enhancer</div>
                    <div class="subheading">Customize your add-on appearance</div>
                </div>
                <div class="header-actions">
                    <button class="icon-button close" aria-label="Close panel">✕</button>
                </div>
            </div>

            <div class="content">
                <div class="section">
                    <div class="section-title">Appearance</div>

                    <div class="setting">
                        <label for="theme">Theme</label>
                        <select id="theme">
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="system">System</option>
                        </select>
                    </div>

                    <div class="setting">
                        <label for="accent">Accent colour</label>
                        <input id="accent" type="color">
                    </div>

                    <div class="setting">
                        <label for="textSize">Text size</label>
                        <select id="textSize">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>

                    <div class="setting">
                        <label for="density">Interface spacing</label>
                        <select id="density">
                            <option value="compact">Compact</option>
                            <option value="comfortable">Comfortable</option>
                            <option value="spacious">Spacious</option>
                        </select>
                    </div>
                </div>

                <div class="section">
                    <div class="section-title">Panel appearance</div>

                    <div class="setting">
                        <label for="transparency">Transparency</label>
                        <input id="transparency" type="range" min="65" max="100" step="1">
                        <span class="value" id="transparencyValue"></span>
                    </div>

                    <div class="setting">
                        <label for="roundness">Corner roundness</label>
                        <input id="roundness" type="range" min="0" max="28" step="1">
                        <span class="value" id="roundnessValue"></span>
                    </div>
                </div>

                <button class="reset">Reset to defaults</button>
            </div>

            <div class="footer">
                Geo-FS-Interface-Add-Ons-Plus · Local preferences
            </div>
        </section>
    `;

    const $ = selector => shadow.querySelector(selector);
    const panel = $(".panel");
    const launcher = $(".launcher");

    function getTheme() {
        if (settings.theme === "system") {
            return window.matchMedia("(prefers-color-scheme: light)").matches
                ? "light"
                : "dark";
        }
        return settings.theme;
    }

    function applySettings() {
        const light = getTheme() === "light";

        const backgrounds = light
            ? {
                panel: "rgba(255,255,255,.96)",
                text: "#202123",
                border: "rgba(0,0,0,.12)",
                control: "#f0f0f0"
            }
            : {
                panel: "rgba(32,33,35,.96)",
                text: "#ececec",
                border: "rgba(255,255,255,.13)",
                control: "#343541"
            };

        const fontSizes = {
            small: "12px",
            medium: "14px",
            large: "16px"
        };

        const spacing = {
            compact: "12px",
            comfortable: "17px",
            spacious: "23px"
        };

        const style = shadow.host.style;

        style.setProperty("--accent", settings.accent);
        style.setProperty("--panel", backgrounds.panel);
        style.setProperty("--text", backgrounds.text);
        style.setProperty("--border", backgrounds.border);
        style.setProperty("--control", backgrounds.control);
        style.setProperty("--font-size", fontSizes[settings.textSize] || fontSizes.medium);
        style.setProperty("--spacing", spacing[settings.density] || spacing.comfortable);
        style.setProperty("--opacity", String(settings.transparency / 100));
        style.setProperty("--roundness", settings.roundness + "px");

        $("#theme").value = settings.theme;
        $("#accent").value = settings.accent;
        $("#textSize").value = settings.textSize;
        $("#density").value = settings.density;
        $("#transparency").value = settings.transparency;
        $("#roundness").value = settings.roundness;

        $("#transparencyValue").textContent = settings.transparency + "%";
        $("#roundnessValue").textContent = settings.roundness + "px";

        saveSettings();
    }

    function update(key, value) {
        settings[key] = value;
        applySettings();
    }

    $("#theme").addEventListener("change", e => update("theme", e.target.value));
    $("#accent").addEventListener("input", e => update("accent", e.target.value));
    $("#textSize").addEventListener("change", e => update("textSize", e.target.value));
    $("#density").addEventListener("change", e => update("density", e.target.value));

    $("#transparency").addEventListener("input", e => {
        update("transparency", Number(e.target.value));
    });

    $("#roundness").addEventListener("input", e => {
        update("roundness", Number(e.target.value));
    });

    launcher.addEventListener("click", () => {
        panel.classList.toggle("open");
    });

    $(".close").addEventListener("click", () => {
        panel.classList.remove("open");
    });

    $(".reset").addEventListener("click", () => {
        settings = { ...defaults };
        applySettings();
    });

    // Allow the panel to be moved by dragging its header.
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

        const left = Math.max(
            0,
            Math.min(window.innerWidth - panel.offsetWidth,
                drag.left + event.clientX - drag.x)
        );

        const top = Math.max(
            0,
            Math.min(window.innerHeight - 60,
                drag.top + event.clientY - drag.y)
        );

        panel.style.left = left + "px";
        panel.style.right = "auto";
        panel.style.top = top + "px";
    });

    function stopDragging() {
        drag = null;
    }

    header.addEventListener("pointerup", stopDragging);
    header.addEventListener("pointercancel", stopDragging);

    // Refresh the System theme when the operating-system preference changes.
    const systemTheme = window.matchMedia("(prefers-color-scheme: light)");
    systemTheme.addEventListener?.("change", () => {
        if (settings.theme === "system") applySettings();
    });

    applySettings();

    console.info("[GeoFS UI Enhancer] Loaded.");
})();
