
// ==UserScript==
// @name         GeoFS Aircraft Reference Cards
// @namespace    https://github.com/CaptainCedricHockeyandMTB0291/Geo-FS-Interface-Add-Ons-Plus
// @version      1.0.0
// @description  A searchable, editable personal aircraft reference library for GeoFS.
// @author       GeoFS Interface Plus contributors
// @match        https://www.geo-fs.com/*
// @match        https://geo-fs.com/*
// @match        https://beta.geo-fs.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
    "use strict";

    const ROOT_ID = "geofs-aircraft-reference-root";
    const STORAGE_KEY = "geofsInterfacePlusAircraftCards";
    const THEME_KEY = "geofsInterfacePlusTheme";

    if (document.getElementById(ROOT_ID)) return;

    const starterCards = [
        {
            id: "starter-a320",
            name: "Airbus A320",
            manufacturer: "Airbus",
            category: "Airliner",
            notes: "Starter reference entry. Add your own simulator notes here."
        },
        {
            id: "starter-737",
            name: "Boeing 737-800",
            manufacturer: "Boeing",
            category: "Airliner",
            notes: "Starter reference entry. Add your own simulator notes here."
        },
        {
            id: "starter-c172",
            name: "Cessna 172 Skyhawk",
            manufacturer: "Cessna",
            category: "General aviation",
            notes: "Starter reference entry. Add your own simulator notes here."
        },
        {
            id: "starter-bell206",
            name: "Bell 206",
            manufacturer: "Bell",
            category: "Helicopter",
            notes: "Starter reference entry. Add your own simulator notes here."
        }
    ];

    function loadCards() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (stored === null) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(starterCards));
                return starterCards.map(card => ({ ...card }));
            }

            const parsed = JSON.parse(stored);

            if (!Array.isArray(parsed)) return [];

            return parsed.filter(card =>
                card &&
                typeof card.id === "string" &&
                typeof card.name === "string"
            );
        } catch (error) {
            console.warn("[Aircraft Reference Cards] Could not load cards:", error);
            return [];
        }
    }

    let cards = loadCards();
    let editingId = null;

    function saveCards() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
            return true;
        } catch (error) {
            console.warn("[Aircraft Reference Cards] Could not save cards:", error);
            alert("The browser could not save your aircraft cards. Check available site storage.");
            return false;
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
                z-index: 2147482999;
                pointer-events: none;
                font-family: Arial, Helvetica, sans-serif;
            }

            * {
                box-sizing: border-box;
            }

            button, input, select, textarea {
                font: inherit;
            }

            .launcher {
                position: fixed;
                left: 18px;
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
                left: 18px;
                width: min(420px, calc(100vw - 36px));
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

            .panel.open {
                display: flex;
            }

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

            .heading {
                font-size: 15px;
                font-weight: 700;
            }

            .subtitle {
                margin-top: 4px;
                font-size: 11px;
                opacity: .65;
            }

            .header button, .small-button {
                border: 1px solid var(--border);
                background: var(--control);
                color: var(--text);
                border-radius: 8px;
                padding: 7px 10px;
                cursor: pointer;
            }

            .toolbar {
                display: flex;
                gap: 8px;
                padding: 12px;
                border-bottom: 1px solid var(--border);
            }

            .search {
                min-width: 0;
                flex: 1;
                padding: 10px;
                border: 1px solid var(--border);
                border-radius: 9px;
                background: var(--control);
                color: var(--text);
                outline-color: var(--accent);
            }

            .primary {
                border: 0;
                border-radius: 9px;
                padding: 9px 12px;
                background: var(--accent);
                color: white;
                font-weight: 700;
                cursor: pointer;
            }

            .card-list {
                overflow-y: auto;
                min-height: 100px;
                padding: 10px;
            }

            .aircraft-card {
                padding: 12px;
                margin-bottom: 9px;
                border: 1px solid var(--border);
                border-radius: 11px;
                background: var(--control);
            }

            .card-top {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 10px;
            }

            .card-name {
                font-size: var(--font-size);
                font-weight: 700;
                overflow-wrap: anywhere;
            }

            .card-maker {
                margin-top: 4px;
                font-size: 12px;
                opacity: .7;
            }

            .category {
                display: inline-block;
                margin-top: 8px;
                padding: 4px 8px;
                border-radius: 20px;
                background: var(--accent);
                color: white;
                font-size: 10px;
            }

            .notes {
                margin-top: 10px;
                font-size: 12px;
                line-height: 1.5;
                white-space: pre-wrap;
                overflow-wrap: anywhere;
            }

            .card-actions {
                display: flex;
                gap: 6px;
                flex-shrink: 0;
            }

            .card-actions button {
                padding: 6px 8px;
                border: 1px solid var(--border);
                border-radius: 7px;
                background: transparent;
                color: var(--text);
                cursor: pointer;
            }

            .empty {
                padding: 25px 12px;
                text-align: center;
                font-size: 13px;
                opacity: .65;
            }

            .count {
                padding: 0 13px 10px;
                font-size: 11px;
                opacity: .6;
            }

            .editor {
                display: none;
                padding: 13px;
                border-top: 1px solid var(--border);
                overflow-y: auto;
                max-height: 48vh;
            }

            .editor.open {
                display: block;
            }

            .editor-title {
                margin-bottom: 12px;
                font-weight: 700;
                font-size: 14px;
            }

            .field {
                margin-bottom: 11px;
            }

            .field label {
                display: block;
                margin-bottom: 5px;
                font-size: 12px;
                opacity: .8;
            }

            .field input, .field select, .field textarea {
                display: block;
                width: 100%;
                padding: 9px;
                border: 1px solid var(--border);
                border-radius: 8px;
                background: var(--control);
                color: var(--text);
                outline-color: var(--accent);
            }

            .field textarea {
                min-height: 75px;
                resize: vertical;
            }

            .form-actions {
                display: flex;
                gap: 8px;
            }

            .form-actions button {
                flex: 1;
            }

            .footer {
                padding: 10px;
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
                    left: 14px;
                    bottom: 14px;
                }
            }
        </style>

        <button class="launcher" title="Aircraft Reference Cards"
            aria-label="Open Aircraft Reference Cards">✈</button>

        <section class="panel" aria-label="Aircraft Reference Cards">
            <div class="header">
                <div>
                    <div class="heading">✈ Aircraft Reference Cards</div>
                    <div class="subtitle">Your personal aircraft library</div>
                </div>
                <button class="close" aria-label="Close panel">✕</button>
            </div>

            <div class="toolbar">
                <input class="search" type="search"
                    placeholder="Search aircraft, maker, notes..."
                    aria-label="Search aircraft">
                <button class="primary add">+ Add</button>
            </div>

            <div class="card-list" aria-live="polite"></div>
            <div class="count"></div>

            <form class="editor">
                <div class="editor-title">Add aircraft</div>

                <div class="field">
                    <label for="aircraft-name">Aircraft name *</label>
                    <input id="aircraft-name" name="name" maxlength="80"
                        required placeholder="Example: Airbus A320">
                </div>

                <div class="field">
                    <label for="aircraft-maker">Manufacturer</label>
                    <input id="aircraft-maker" name="manufacturer" maxlength="80"
                        placeholder="Example: Airbus">
                </div>

                <div class="field">
                    <label for="aircraft-category">Category</label>
                    <select id="aircraft-category" name="category">
                        <option>Airliner</option>
                        <option>General aviation</option>
                        <option>Business aviation</option>
                        <option>Helicopter</option>
                        <option>Military aircraft</option>
                        <option>Other</option>
                    </select>
                </div>

                <div class="field">
                    <label for="aircraft-notes">Personal notes</label>
                    <textarea id="aircraft-notes" name="notes" maxlength="2000"
                        placeholder="Write your own aircraft or simulator notes..."></textarea>
                </div>

                <div class="form-actions">
                    <button class="primary save" type="submit">Save card</button>
                    <button class="small-button cancel" type="button">Cancel</button>
                </div>
            </form>

            <div class="footer">
                Geo-FS-Interface-Add-Ons-Plus · Saved locally in this browser
            </div>
        </section>
    `;

    const $ = selector => shadow.querySelector(selector);
    const panel = $(".panel");
    const list = $(".card-list");
    const editor = $(".editor");
    const search = $(".search");

    function readTheme() {
        const defaults = {
            theme: "dark",
            accent: "#10a37f",
            textSize: "medium",
            density: "comfortable",
            transparency: 96,
            roundness: 14
        };

        try {
            return {
                ...defaults,
                ...JSON.parse(localStorage.getItem(THEME_KEY) || "{}")
            };
        } catch {
            return defaults;
        }
    }

    function applyTheme() {
        const theme = readTheme();
        const light = theme.theme === "light" ||
            (theme.theme === "system" &&
                window.matchMedia("(prefers-color-scheme: light)").matches);

        const palette = light
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
            comfortable: "16px",
            spacious: "22px"
        };

        const style = host.style;
        style.setProperty("--accent", /^#[0-9a-f]{6}$/i.test(theme.accent)
            ? theme.accent : "#10a37f");
        style.setProperty("--panel", palette.panel);
        style.setProperty("--text", palette.text);
        style.setProperty("--border", palette.border);
        style.setProperty("--control", palette.control);
        style.setProperty("--font-size", fontSizes[theme.textSize] || fontSizes.medium);
        style.setProperty("--spacing", spacing[theme.density] || spacing.comfortable);
        style.setProperty("--opacity", String(
            Math.min(100, Math.max(65, Number(theme.transparency) || 96)) / 100
        ));
        style.setProperty("--roundness",
            Math.min(28, Math.max(0, Number(theme.roundness) || 14)) + "px");
    }

    function makeButton(label, action, id) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.dataset.action = action;
        if (id) button.dataset.id = id;
        return button;
    }

    function renderCards() {
        const query = search.value.trim().toLowerCase();

        const filtered = cards.filter(card => {
            const text = [
                card.name,
                card.manufacturer,
                card.category,
                card.notes
            ].join(" ").toLowerCase();

            return text.includes(query);
        });

        list.replaceChildren();

        if (filtered.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty";
            empty.textContent = query
                ? "No matching aircraft. Try another search."
                : "Your library is empty. Select + Add to create your first card.";
            list.appendChild(empty);
        }

        filtered.forEach(card => {
            const article = document.createElement("article");
            article.className = "aircraft-card";

            const top = document.createElement("div");
            top.className = "card-top";

            const information = document.createElement("div");

            const name = document.createElement("div");
            name.className = "card-name";
            name.textContent = card.name;

            const maker = document.createElement("div");
            maker.className = "card-maker";
            maker.textContent = card.manufacturer || "Manufacturer not specified";

            const category = document.createElement("span");
            category.className = "category";
            category.textContent = card.category || "Other";

            information.append(name, maker, category);

            const actions = document.createElement("div");
            actions.className = "card-actions";
            actions.append(
                makeButton("Edit", "edit", card.id),
                makeButton("Delete", "delete", card.id)
            );

            top.append(information, actions);
            article.appendChild(top);

            if (card.notes) {
                const notes = document.createElement("div");
                notes.className = "notes";
                notes.textContent = card.notes;
                article.appendChild(notes);
            }

            list.appendChild(article);
        });

        $(".count").textContent =
            `${filtered.length} shown · ${cards.length} saved`;
    }

    function openEditor(card = null) {
        editingId = card ? card.id : null;
        editor.reset();

        $(".editor-title").textContent = card ? "Edit aircraft" : "Add aircraft";
        $(".save").textContent = card ? "Update card" : "Save card";

        if (card) {
            editor.elements.name.value = card.name || "";
            editor.elements.manufacturer.value = card.manufacturer || "";
            editor.elements.category.value = card.category || "Other";
            editor.elements.notes.value = card.notes || "";
        }

        editor.classList.add("open");
        editor.elements.name.focus();
    }

    function closeEditor() {
        editor.classList.remove("open");
        editor.reset();
        editingId = null;
    }

    function createId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return "aircraft-" + Date.now() + "-" +
            Math.random().toString(36).slice(2, 9);
    }

    $(".launcher").addEventListener("click", () => {
        applyTheme();
        panel.classList.toggle("open");
        if (panel.classList.contains("open")) search.focus();
    });

    $(".close").addEventListener("click", () => {
        panel.classList.remove("open");
    });

    $(".add").addEventListener("click", () => openEditor());

    $(".cancel").addEventListener("click", closeEditor);

    search.addEventListener("input", renderCards);

    editor.addEventListener("submit", event => {
        event.preventDefault();

        const name = editor.elements.name.value.trim();

        if (!name) {
            editor.elements.name.focus();
            return;
        }

        const entry = {
            id: editingId || createId(),
            name,
            manufacturer: editor.elements.manufacturer.value.trim(),
            category: editor.elements.category.value,
            notes: editor.elements.notes.value.trim()
        };

        if (editingId) {
            const index = cards.findIndex(card => card.id === editingId);
            if (index !== -1) cards[index] = entry;
        } else {
            cards.unshift(entry);
        }

        if (saveCards()) {
            closeEditor();
            renderCards();
        }
    });

    list.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const card = cards.find(item => item.id === button.dataset.id);
        if (!card) return;

        if (button.dataset.action === "edit") {
            openEditor(card);
        }

        if (button.dataset.action === "delete") {
            if (!confirm(`Delete "${card.name}" from your aircraft library?`)) {
                return;
            }

            cards = cards.filter(item => item.id !== card.id);

            if (saveCards()) renderCards();
        }
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

    // Refresh the shared theme when the UI Enhancer changes it.
    window.addEventListener("storage", event => {
        if (event.key === THEME_KEY) applyTheme();
    });

    renderCards();
    applyTheme();

    console.info("[GeoFS Aircraft Reference Cards] Loaded.");
})();
