
// ==UserScript==
// @name         GeoFS Keyboard Reference
// @namespace    https://github.com/CaptainCedricHockeyandMTB0291/Geo-FS-Interface-Add-Ons-Plus
// @version      1.0.0
// @description  Searchable and editable personal keyboard shortcut reference for GeoFS.
// @author       GeoFS Interface Plus contributors
// @match        https://www.geo-fs.com/*
// @match        https://geo-fs.com/*
// @match        https://beta.geo-fs.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
    "use strict";

    const ROOT_ID = "geofs-keyboard-reference-root";
    const STORAGE_KEY = "geofsInterfacePlusKeyboardEntries";
    const THEME_KEY = "geofsInterfacePlusTheme";

    if (document.getElementById(ROOT_ID)) return;

    const starterEntries = [
        {
            id: "starter-aircraft",
            title: "Aircraft controls",
            shortcut: "Check GeoFS controls",
            category: "Aircraft",
            notes: "Use the controls or help information in your current GeoFS version to confirm the assigned keys."
        },
        {
            id: "starter-camera",
            title: "Camera controls",
            shortcut: "Check GeoFS controls",
            category: "Camera",
            notes: "Record the camera shortcuts available in your simulator version."
        },
        {
            id: "starter-view",
            title: "View and display",
            shortcut: "Check GeoFS controls",
            category: "Interface",
            notes: "Add your preferred display and view shortcuts here."
        },
        {
            id: "starter-general",
            title: "General simulator controls",
            shortcut: "Check GeoFS controls",
            category: "General",
            notes: "Add verified general simulator shortcuts here."
        }
    ];

    function loadEntries() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);

            if (stored === null) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(starterEntries));
                return starterEntries.map(entry => ({ ...entry }));
            }

            const parsed = JSON.parse(stored);

            if (!Array.isArray(parsed)) return [];

            return parsed.filter(entry =>
                entry &&
                typeof entry.id === "string" &&
                typeof entry.title === "string"
            );
        } catch (error) {
            console.warn("[Keyboard Reference] Could not load entries:", error);
            return [];
        }
    }

    let entries = loadEntries();
    let editingId = null;
    let activeCategory = "All";

    function saveEntries() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
            return true;
        } catch (error) {
            console.warn("[Keyboard Reference] Could not save entries:", error);
            alert("Could not save your shortcut entries. Check browser storage.");
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
                z-index: 2147482997;
                pointer-events: none;
                font-family: Arial, Helvetica, sans-serif;
            }

            * { box-sizing: border-box; }

            button, input, select, textarea { font: inherit; }

            .launcher {
                position: fixed;
                left: 134px;
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
                left: 134px;
                width: min(440px, calc(100vw - 36px));
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

            .filters {
                display: flex;
                gap: 6px;
                padding: 10px 12px;
                overflow-x: auto;
                border-bottom: 1px solid var(--border);
            }

            .filter {
                flex: 0 0 auto;
                border: 1px solid var(--border);
                border-radius: 20px;
                padding: 6px 10px;
                background: var(--control);
                color: var(--text);
                font-size: 11px;
                cursor: pointer;
            }

            .filter.active {
                background: var(--accent);
                color: white;
                border-color: var(--accent);
            }

            .entry-list {
                overflow-y: auto;
                min-height: 100px;
                padding: 10px;
            }

            .entry {
                padding: 12px;
                margin-bottom: 9px;
                border: 1px solid var(--border);
                border-radius: 10px;
                background: var(--control);
            }

            .entry-top {
                display: flex;
                justify-content: space-between;
                gap: 10px;
            }

            .entry-title {
                font-size: var(--font-size);
                font-weight: 700;
                overflow-wrap: anywhere;
            }

            .entry-category {
                margin-top: 4px;
                font-size: 10px;
                opacity: .65;
            }

            .shortcut {
                display: inline-block;
                margin-top: 10px;
                padding: 6px 9px;
                border: 1px solid var(--border);
                border-radius: 7px;
                background: var(--panel);
                font-family: monospace;
                font-size: 12px;
                overflow-wrap: anywhere;
            }

            .entry-notes {
                margin-top: 9px;
                font-size: 12px;
                line-height: 1.5;
                white-space: pre-wrap;
                overflow-wrap: anywhere;
            }

            .entry-actions {
                display: flex;
                gap: 5px;
                flex-shrink: 0;
            }

            .entry-actions button {
                border: 1px solid var(--border);
                border-radius: 7px;
                padding: 6px 8px;
                background: transparent;
                color: var(--text);
                cursor: pointer;
            }

            .count, .footer {
                padding: 9px 12px;
                font-size: 10px;
                opacity: .6;
                text-align: center;
                border-top: 1px solid var(--border);
            }

            .editor {
                display: none;
                padding: 13px;
                border-top: 1px solid var(--border);
                overflow-y: auto;
                max-height: 48vh;
            }

            .editor.open { display: block; }

            .editor-title {
                margin-bottom: 12px;
                font-size: 14px;
                font-weight: 700;
            }

            .field { margin-bottom: 11px; }

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
                min-height: 70px;
                resize: vertical;
            }

            .form-actions {
                display: flex;
                gap: 8px;
            }

            .form-actions button { flex: 1; }

            .empty {
                padding: 24px 12px;
                text-align: center;
                font-size: 12px;
                opacity: .65;
            }

            @media (max-width: 480px) {
                .panel {
                    top: 10px;
                    left: 10px;
                    width: calc(100vw - 20px);
                    max-height: calc(100vh - 75px);
                }

                .launcher {
                    left: 134px;
                    bottom: 14px;
                }
            }
        </style>

        <button class="launcher" title="Keyboard Reference"
            aria-label="Open Keyboard Reference">⌨</button>

        <section class="panel" aria-label="GeoFS Keyboard Reference">
            <div class="header">
                <div>
                    <div class="heading">⌨ GeoFS Keyboard Reference</div>
                    <div class="subtitle">Search · Organize · Personalize</div>
                </div>
                <button class="close" aria-label="Close panel">✕</button>
            </div>

            <div class="toolbar">
                <input class="search" type="search"
                    placeholder="Search shortcuts and notes..."
                    aria-label="Search shortcuts">
                <button class="primary add">+ Add</button>
            </div>

            <div class="filters"></div>
            <div class="entry-list" aria-live="polite"></div>
            <div class="count"></div>

            <form class="editor">
                <div class="editor-title">Add shortcut</div>

                <div class="field">
                    <label for="entry-title">Shortcut name *</label>
                    <input id="entry-title" name="title" maxlength="80"
                        required placeholder="Example: Toggle preferred view">
                </div>

                <div class="field">
                    <label for="entry-key">Key or key combination *</label>
                    <input id="entry-key" name="shortcut" maxlength="80"
                        required placeholder="Example: Ctrl + Shift + K">
                </div>

                <div class="field">
                    <label for="entry-category">Category</label>
                    <select id="entry-category" name="category">
                        <option>Aircraft</option>
                        <option>Camera</option>
                        <option>Interface</option>
                        <option>General</option>
                        <option>Custom</option>
                    </select>
                </div>

                <div class="field">
                    <label for="entry-notes">Personal notes</label>
                    <textarea id="entry-notes" name="notes" maxlength="1500"
                        placeholder="Add what this shortcut does or where you verified it..."></textarea>
                </div>

                <div class="form-actions">
                    <button class="primary save" type="submit">Save entry</button>
                    <button class="secondary cancel" type="button">Cancel</button>
                </div>
            </form>

            <div class="footer">
                Reference only · Does not change GeoFS controls
            </div>
        </section>
    `;

    const $ = selector => shadow.querySelector(selector);
    const panel = $(".panel");
    const list = $(".entry-list");
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

        host.style.setProperty("--accent",
            /^#[0-9a-f]{6}$/i.test(theme.accent) ? theme.accent : "#10a37f");
        host.style.setProperty("--panel", palette.panel);
        host.style.setProperty("--text", palette.text);
        host.style.setProperty("--border", palette.border);
        host.style.setProperty("--control", palette.control);
        host.style.setProperty("--font-size", fontSizes[theme.textSize] || "14px");
        host.style.setProperty("--opacity",
            String(Math.min(100, Math.max(65, Number(theme.transparency) || 96)) / 100));
        host.style.setProperty("--roundness",
            Math.min(28, Math.max(0, Number(theme.roundness) || 14)) + "px");
    }

    function categories() {
        return ["All", ...new Set(entries.map(entry => entry.category || "Custom"))];
    }

    function renderFilters() {
        const container = $(".filters");
        container.replaceChildren();

        categories().forEach(category => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "filter" +
                (activeCategory === category ? " active" : "");
            button.textContent = category;

            button.addEventListener("click", () => {
                activeCategory = category;
                renderFilters();
                renderEntries();
            });

            container.appendChild(button);
        });
    }

    function renderEntries() {
        const query = search.value.trim().toLowerCase();

        const filtered = entries.filter(entry => {
            const matchesCategory = activeCategory === "All" ||
                (entry.category || "Custom") === activeCategory;

            const searchable = [
                entry.title,
                entry.shortcut,
                entry.category,
                entry.notes
            ].join(" ").toLowerCase();

            return matchesCategory && searchable.includes(query);
        });

        list.replaceChildren();

        if (!filtered.length) {
            const empty = document.createElement("div");
            empty.className = "empty";
            empty.textContent = "No matching shortcuts. Try another search or add an entry.";
            list.appendChild(empty);
        }

        filtered.forEach(entry => {
            const card = document.createElement("article");
            card.className = "entry";

            const top = document.createElement("div");
            top.className = "entry-top";

            const information = document.createElement("div");

            const title = document.createElement("div");
            title.className = "entry-title";
            title.textContent = entry.title;

            const category = document.createElement("div");
            category.className = "entry-category";
            category.textContent = entry.category || "Custom";

            const shortcut = document.createElement("div");
            shortcut.className = "shortcut";
            shortcut.textContent = entry.shortcut;

            information.append(title, category, shortcut);

            const actions = document.createElement("div");
            actions.className = "entry-actions";

            const edit = document.createElement("button");
            edit.type = "button";
            edit.textContent = "Edit";
            edit.dataset.action = "edit";
            edit.dataset.id = entry.id;

            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "Delete";
            remove.dataset.action = "delete";
            remove.dataset.id = entry.id;

            actions.append(edit, remove);
            top.append(information, actions);
            card.appendChild(top);

            if (entry.notes) {
                const notes = document.createElement("div");
                notes.className = "entry-notes";
                notes.textContent = entry.notes;
                card.appendChild(notes);
            }

            list.appendChild(card);
        });

        $(".count").textContent =
            `${filtered.length} shown · ${entries.length} saved`;
    }

    function openEditor(entry = null) {
        editingId = entry ? entry.id : null;
        editor.reset();

        $(".editor-title").textContent =
            entry ? "Edit shortcut" : "Add shortcut";
        $(".save").textContent = entry ? "Update entry" : "Save entry";

        if (entry) {
            editor.elements.title.value = entry.title || "";
            editor.elements.shortcut.value = entry.shortcut || "";
            editor.elements.category.value = entry.category || "Custom";
            editor.elements.notes.value = entry.notes || "";
        }

        editor.classList.add("open");
        editor.elements.title.focus();
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

        return "shortcut-" + Date.now() + "-" +
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
    search.addEventListener("input", renderEntries);

    editor.addEventListener("submit", event => {
        event.preventDefault();

        const title = editor.elements.title.value.trim();
        const shortcut = editor.elements.shortcut.value.trim();

        if (!title || !shortcut) {
            alert("Enter both a shortcut name and its key combination.");
            return;
        }

        const entry = {
            id: editingId || createId(),
            title,
            shortcut,
            category: editor.elements.category.value,
            notes: editor.elements.notes.value.trim()
        };

        if (editingId) {
            const index = entries.findIndex(item => item.id === editingId);
            if (index !== -1) entries[index] = entry;
        } else {
            entries.unshift(entry);
        }

        if (saveEntries()) {
            closeEditor();
            activeCategory = "All";
            renderFilters();
            renderEntries();
        }
    });

    list.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const entry = entries.find(item => item.id === button.dataset.id);
        if (!entry) return;

        if (button.dataset.action === "edit") {
            openEditor(entry);
        }

        if (button.dataset.action === "delete") {
            if (!confirm(`Delete "${entry.title}"?`)) return;

            entries = entries.filter(item => item.id !== entry.id);

            if (saveEntries()) {
                if (activeCategory !== "All" &&
                    !entries.some(item => item.category === activeCategory)) {
                    activeCategory = "All";
                }

                renderFilters();
                renderEntries();
            }
        }
    });

    // Drag the panel by its header.
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

    window.addEventListener("storage", event => {
        if (event.key === THEME_KEY) applyTheme();
    });

    renderFilters();
    renderEntries();
    applyTheme();

    console.info("[GeoFS Keyboard Reference] Loaded.");
})();
