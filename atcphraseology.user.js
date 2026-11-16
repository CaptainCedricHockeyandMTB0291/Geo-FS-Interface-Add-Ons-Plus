
// ==UserScript==
// @name         GeoFS ATC Phraseology Assistant
// @namespace    https://github.com/CaptainCedricHockeyandMTB0291/Geo-FS-Interface-Add-Ons-Plus
// @version      1.0.0
// @description  Educational ATC phraseology reference and fictional practice panel for GeoFS.
// @author       GeoFS Interface Plus contributors
// @match        https://www.geo-fs.com/*
// @match        https://geo-fs.com/*
// @match        https://beta.geo-fs.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
    "use strict";

    const ROOT_ID = "geofs-atc-phraseology-root";
    const NOTES_KEY = "geofsInterfacePlusATCNotes";
    const THEME_KEY = "geofsInterfacePlusTheme";

    if (document.getElementById(ROOT_ID)) return;

    const phrases = [
        {
            category: "General communication",
            title: "Initial contact",
            phrase: "[Station name], [callsign], hello.",
            explanation: "A simple example of opening a fictional practice exchange."
        },
        {
            category: "General communication",
            title: "Requesting information",
            phrase: "[Calls sign], request information about the practice scenario.",
            explanation: "Use a clear, concise request when asking for information in a practice session."
        },
        {
            category: "General communication",
            title: "Confirming a message",
            phrase: "[Station name], [callsign], message understood.",
            explanation: "A simple acknowledgement for a non-operational practice exchange."
        },
        {
            category: "General communication",
            title: "Asking for repetition",
            phrase: "[Station name], [callsign], say again, please.",
            explanation: "A polite way to ask for a message to be repeated."
        },
        {
            category: "General communication",
            title: "Asking for clarification",
            phrase: "[Station name], [callsign], please clarify.",
            explanation: "Use when a practice message is unclear."
        },
        {
            category: "General communication",
            title: "Ending a practice exchange",
            phrase: "[Station name], [callsign], ending this practice exchange.",
            explanation: "A clear way to close a fictional learning session."
        },
        {
            category: "Readback and confirmation",
            title: "Practice readback",
            phrase: "[Calls sign], reading back the practice message: [repeat the sample message].",
            explanation: "Practise repeating information accurately. This is a learning exercise, not an operational readback."
        },
        {
            category: "Readback and confirmation",
            title: "Requesting a correction",
            phrase: "[Station name], [callsign], I may have misunderstood. Please repeat the practice message.",
            explanation: "Practise asking for clarification instead of guessing."
        },
        {
            category: "Position and status reports",
            title: "Position report",
            phrase: "[Station name], [callsign], simulated position report: [fictional location].",
            explanation: "A fictional simulator-only position report. Do not use invented positions as real reports."
        },
        {
            category: "Position and status reports",
            title: "Status update",
            phrase: "[Station name], [callsign], status update: [brief simulated status].",
            explanation: "Practise giving a short, organised status update."
        },
        {
            category: "Learning and corrections",
            title: "Requesting feedback",
            phrase: "[Station name], [callsign], please provide feedback on my phraseology.",
            explanation: "Use this to ask a practice partner to review your wording."
        },
        {
            category: "Learning and corrections",
            title: "Practice acknowledgement",
            phrase: "[Calls sign], message received. This is a simulated learning exchange.",
            explanation: "An example acknowledgement for a fictional training conversation."
        }
    ];

    const scenarios = {
        introduction: {
            title: "First contact",
            prompt: "You are beginning a fictional practice session at Example Field. Introduce your aircraft using your chosen callsign.",
            pilot: "[Station name], [callsign], hello. Ready for phraseology practice.",
            controller: "[Calls sign], hello. Example Field practice desk here. This is a fictional learning exchange."
        },
        repetition: {
            title: "Requesting repetition",
            prompt: "Your fictional practice partner has sent a message you did not understand. Write a polite request for repetition.",
            pilot: "[Station name], [callsign], say again, please.",
            controller: "[Calls sign], understood. I will repeat the fictional practice message."
        },
        clarification: {
            title: "Clarification",
            prompt: "A practice message is unclear. Write a short request asking your partner to clarify it.",
            pilot: "[Station name], [callsign], please clarify.",
            controller: "[Calls sign], understood. Please tell me which part of the practice message needs clarification."
        },
        readback: {
            title: "Practice readback",
            prompt: "Your practice partner has sent a short fictional message. Practise repeating it accurately in your own words.",
            pilot: "[Station name], [callsign], reading back the practice message: [repeat the sample message].",
            controller: "[Calls sign], your practice readback has been received. Compare it with the original sample."
        },
        position: {
            title: "Simulated position report",
            prompt: "Give a fictional position report using an invented location. Make clear that it is a simulator exercise.",
            pilot: "[Station name], [callsign], simulated position report: near Example Point.",
            controller: "[Calls sign], simulated position report received. Thank you."
        },
        feedback: {
            title: "Request feedback",
            prompt: "Ask your practice partner to review your phraseology and suggest improvements.",
            pilot: "[Station name], [callsign], please provide feedback on my phraseology.",
            controller: "[Calls sign], understood. I can provide feedback on clarity and structure."
        }
    };

    function loadNotes() {
        try {
            const value = JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
            return Array.isArray(value) ? value.filter(item => typeof item === "string") : [];
        } catch {
            return [];
        }
    }

    let notes = loadNotes();
    let activeScenario = "introduction";

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
                z-index: 2147482998;
                pointer-events: none;
                font-family: Arial, Helvetica, sans-serif;
            }

            * { box-sizing: border-box; }

            button, input, select, textarea { font: inherit; }

            .launcher {
                position: fixed;
                left: 76px;
                bottom: 18px;
                width: 49px;
                height: 49px;
                border: 0;
                border-radius: 50%;
                background: var(--accent);
                color: white;
                font-size: 19px;
                cursor: pointer;
                pointer-events: auto;
                box-shadow: 0 4px 18px #0005;
            }

            .panel {
                display: none;
                position: fixed;
                top: 65px;
                left: 76px;
                width: min(450px, calc(100vw - 36px));
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

            .tabs {
                display: flex;
                gap: 6px;
                padding: 10px 12px;
                border-bottom: 1px solid var(--border);
            }

            .tab {
                flex: 1;
                padding: 9px 5px;
                border: 1px solid var(--border);
                border-radius: 8px;
                background: var(--control);
                color: var(--text);
                cursor: pointer;
                font-size: 12px;
            }

            .tab.active {
                border-color: var(--accent);
                background: var(--accent);
                color: white;
            }

            .view {
                display: none;
                overflow-y: auto;
                padding: 13px;
            }

            .view.active { display: block; }

            .search, .field input, .field select, .field textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid var(--border);
                border-radius: 9px;
                background: var(--control);
                color: var(--text);
                outline-color: var(--accent);
            }

            .search { margin-bottom: 10px; }

            .phrase-card {
                padding: 11px;
                margin-bottom: 9px;
                border: 1px solid var(--border);
                border-radius: 10px;
                background: var(--control);
            }

            .phrase-category {
                font-size: 10px;
                color: var(--accent);
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: .4px;
            }

            .phrase-title {
                margin-top: 5px;
                font-size: var(--font-size);
                font-weight: 700;
            }

            .phrase-text {
                margin-top: 8px;
                font-size: 12px;
                line-height: 1.5;
                overflow-wrap: anywhere;
            }

            .explanation {
                margin-top: 7px;
                font-size: 11px;
                line-height: 1.5;
                opacity: .7;
            }

            .section-title {
                margin: 3px 0 10px;
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

            .field textarea {
                min-height: 90px;
                resize: vertical;
            }

            .primary {
                padding: 10px 13px;
                border: 0;
                border-radius: 9px;
                background: var(--accent);
                color: white;
                font-weight: 700;
                cursor: pointer;
            }

            .full { width: 100%; }

            .scenario-box {
                padding: 12px;
                margin: 10px 0;
                border: 1px solid var(--border);
                border-radius: 10px;
                background: var(--control);
            }

            .scenario-prompt {
                font-size: 12px;
                line-height: 1.6;
            }

            .sample {
                margin-top: 10px;
                padding: 10px;
                border-left: 3px solid var(--accent);
                background: var(--panel);
                border-radius: 5px;
                font-size: 12px;
                line-height: 1.5;
                overflow-wrap: anywhere;
            }

            .sample-label {
                display: block;
                margin-bottom: 5px;
                font-size: 10px;
                font-weight: 700;
                opacity: .65;
                text-transform: uppercase;
            }

            .note {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                margin-bottom: 8px;
                padding: 10px;
                border: 1px solid var(--border);
                border-radius: 9px;
                background: var(--control);
                font-size: 12px;
                line-height: 1.5;
                white-space: pre-wrap;
                overflow-wrap: anywhere;
            }

            .note span { flex: 1; }
            .note button {
                border: 0;
                background: transparent;
                color: var(--text);
                cursor: pointer;
            }

            .notice {
                padding: 10px;
                margin-bottom: 12px;
                border: 1px solid var(--border);
                border-radius: 9px;
                font-size: 11px;
                line-height: 1.5;
                opacity: .8;
            }

            .empty {
                padding: 20px 10px;
                text-align: center;
                font-size: 12px;
                opacity: .65;
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
                    left: 76px;
                    bottom: 14px;
                }
            }
        </style>

        <button class="launcher" title="ATC Phraseology Assistant"
            aria-label="Open ATC Phraseology Assistant">🎧</button>

        <section class="panel" aria-label="ATC Phraseology Assistant">
            <div class="header">
                <div>
                    <div class="heading">🎧 ATC Phraseology Assistant</div>
                    <div class="subtitle">Reference · Practice · Personal notes</div>
                </div>
                <button class="close" aria-label="Close panel">✕</button>
            </div>

            <div class="tabs">
                <button class="tab active" data-view="reference">Reference</button>
                <button class="tab" data-view="practice">Practice</button>
                <button class="tab" data-view="notes">My Notes</button>
            </div>

            <div class="view active" data-panel="reference">
                <input class="search" type="search"
                    placeholder="Search phraseology..."
                    aria-label="Search phraseology">
                <div class="phrase-list"></div>
            </div>

            <div class="view" data-panel="practice">
                <div class="notice">
                    Fictional simulator practice only. These examples are not
                    real clearances, instructions, or a substitute for official
                    aviation training and current publications.
                </div>

                <div class="field">
                    <label for="callsign">Practice callsign</label>
                    <input id="callsign" maxlength="24" value="GEFS 01">
                </div>

                <div class="field">
                    <label for="station">Fictional station name</label>
                    <input id="station" maxlength="40" value="Example Field">
                </div>

                <div class="field">
                    <label for="role">Practice role</label>
                    <select id="role">
                        <option value="pilot">Pilot</option>
                        <option value="controller">Controller</option>
                    </select>
                </div>

                <div class="field">
                    <label for="scenario">Scenario</label>
                    <select id="scenario">
                        <option value="introduction">First contact</option>
                        <option value="repetition">Requesting repetition</option>
                        <option value="clarification">Clarification</option>
                        <option value="readback">Practice readback</option>
                        <option value="position">Simulated position report</option>
                        <option value="feedback">Request feedback</option>
                    </select>
                </div>

                <div class="scenario-box">
                    <div class="section-title scenario-title">First contact</div>
                    <div class="scenario-prompt"></div>
                    <div class="sample">
                        <span class="sample-label">Example response</span>
                        <span class="sample-text"></span>
                    </div>
                </div>

                <div class="field">
                    <label for="response">Your practice response</label>
                    <textarea id="response" maxlength="1000"
                        placeholder="Write your own practice response here..."></textarea>
                </div>

                <button class="primary full save-response">Save practice note</button>
            </div>

            <div class="view" data-panel="notes">
                <div class="section-title">My saved notes</div>
                <div class="notice">Notes are stored locally in this browser.</div>
                <div class="notes-list"></div>
            </div>

            <div class="footer">
                Geo-FS-Interface-Add-Ons-Plus · Educational simulator tool
            </div>
        </section>
    `;

    const $ = selector => shadow.querySelector(selector);
    const $$ = selector => [...shadow.querySelectorAll(selector)];
    const panel = $(".panel");

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

    function substitute(text) {
        const callsign = $("#callsign").value.trim() || "GEFS 01";
        const station = $("#station").value.trim() || "Example Field";

        return text
            .replaceAll("[Calls sign]", callsign)
            .replaceAll("[callsign]", callsign)
            .replaceAll("[Station name]", station)
            .replaceAll("[station name]", station);
    }

    function renderPhrases() {
        const query = $(".search").value.trim().toLowerCase();
        const results = phrases.filter(item =>
            [
                item.category,
                item.title,
                item.phrase,
                item.explanation
            ].join(" ").toLowerCase().includes(query)
        );

        const container = $(".phrase-list");
        container.replaceChildren();

        if (!results.length) {
            const empty = document.createElement("div");
            empty.className = "empty";
            empty.textContent = "No matching phrases found.";
            container.appendChild(empty);
            return;
        }

        results.forEach(item => {
            const card = document.createElement("article");
            card.className = "phrase-card";

            const category = document.createElement("div");
            category.className = "phrase-category";
            category.textContent = item.category;

            const title = document.createElement("div");
            title.className = "phrase-title";
            title.textContent = item.title;

            const phrase = document.createElement("div");
            phrase.className = "phrase-text";
            phrase.textContent = substitute(item.phrase);

            const explanation = document.createElement("div");
            explanation.className = "explanation";
            explanation.textContent = item.explanation;

            card.append(category, title, phrase, explanation);
            container.appendChild(card);
        });
    }

    function renderScenario() {
        activeScenario = $("#scenario").value;
        const scenario = scenarios[activeScenario];
        const role = $("#role").value;

        $(".scenario-title").textContent = scenario.title;
        $(".scenario-prompt").textContent = scenario.prompt;
        $(".sample-text").textContent = substitute(
            role === "pilot" ? scenario.pilot : scenario.controller
        );
    }

    function saveNotes() {
        try {
            localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
            return true;
        } catch (error) {
            alert("Could not save your notes. Check browser storage.");
            console.warn("[ATC Phraseology Assistant] Save failed:", error);
            return false;
        }
    }

    function renderNotes() {
        const container = $(".notes-list");
        container.replaceChildren();

        if (!notes.length) {
            const empty = document.createElement("div");
            empty.className = "empty";
            empty.textContent = "No saved notes yet. Complete a practice exercise to add one.";
            container.appendChild(empty);
            return;
        }

        notes.forEach((note, index) => {
            const row = document.createElement("div");
            row.className = "note";

            const text = document.createElement("span");
            text.textContent = note;

            const remove = document.createElement("button");
            remove.type = "button";
            remove.textContent = "✕";
            remove.title = "Delete note";
            remove.setAttribute("aria-label", "Delete note");

            remove.addEventListener("click", () => {
                notes.splice(index, 1);
                if (saveNotes()) renderNotes();
            });

            row.append(text, remove);
            container.appendChild(row);
        });
    }

    $(".launcher").addEventListener("click", () => {
        applyTheme();
        panel.classList.toggle("open");
        if (panel.classList.contains("open")) renderScenario();
    });

    $(".close").addEventListener("click", () => {
        panel.classList.remove("open");
    });

    $$(".tab").forEach(tab => {
        tab.addEventListener("click", () => {
            $$(".tab").forEach(item => item.classList.remove("active"));
            $$(".view").forEach(item => item.classList.remove("active"));

            tab.classList.add("active");
            $(`[data-panel="${tab.dataset.view}"]`).classList.add("active");

            if (tab.dataset.view === "notes") renderNotes();
        });
    });

    $(".search").addEventListener("input", renderPhrases);
    $("#role").addEventListener("change", renderScenario);
    $("#scenario").addEventListener("change", renderScenario);
    $("#callsign").addEventListener("input", renderScenario);
    $("#station").addEventListener("input", renderScenario);

    $(".save-response").addEventListener("click", () => {
        const response = $("#response").value.trim();

        if (!response) {
            alert("Write a practice response before saving.");
            $("#response").focus();
            return;
        }

        const scenario = scenarios[activeScenario];
        const role = $("#role").value;
        const callsign = $("#callsign").value.trim() || "GEFS 01";

        const note = [
            `Scenario: ${scenario.title}`,
            `Role: ${role}`,
            `Callsign: ${callsign}`,
            `Response: ${response}`
        ].join("\n");

        notes.unshift(note);

        if (saveNotes()) {
            $("#response").value = "";
            alert("Practice note saved.");
        }
    });

    // Drag panel by its header.
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

    renderPhrases();
    renderScenario();
    renderNotes();
    applyTheme();

    console.info("[GeoFS ATC Phraseology Assistant] Loaded.");
})();
