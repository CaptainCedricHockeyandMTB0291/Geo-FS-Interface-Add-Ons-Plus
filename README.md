# ✈️ Geo-FS-Interface-Add-Ons-Plus

### A customizable interface and add-on collection for GeoFS 4.0 Beta

Welcome to **Geo-FS-Interface-Plus**!

This repository is a collection of original JavaScript tools designed to improve the GeoFS experience through customizable interfaces, useful reference utilities and additional virtual aviation features.

The main idea behind this project is simple: give users more control over how their GeoFS experience looks and feels, while providing several independent tools that can be installed and used separately.

The collection is designed with both desktop browsers and iPad Safari in mind.

Each add-on is intended to have two versions:

- **Tampermonkey userscript** – for desktop browsers such as Microsoft Edge and Google Chrome.
- **Safari bookmarklet** – for iPad and other compatible browsers that support bookmarklets.

---

## 🧰 The Add-on Collection

The project will contain five main tools.

### 1. GeoFS UI Enhancer

A customizable interface enhancement system designed to give the add-on interfaces a more modern appearance.

Planned features:

- Light, Dark and System themes.
- Custom accent colours.
- Adjustable text sizes.
- Compact, Comfortable and Spacious layouts.
- Adjustable panel transparency.
- Customizable panel appearance.
- Movable interface panels.
- Adjustable panel sizing.
- Saved appearance preferences.
- Reset-to-default settings.

The visual design will take inspiration from modern applications such as ChatGPT, with a clean layout and straightforward customization controls.

**The theme settings will apply to this project's add-on interfaces, not automatically replace the entire built-in GeoFS interface.**

### 2. GeoFS Aircraft Reference Cards

A small aircraft reference library designed to keep useful virtual aviation information in one place.

Planned features:

- Aircraft reference cards.
- Searchable aircraft library.
- Aircraft descriptions.
- Personal notes.
- Editable reference information.
- Custom aircraft entries.
- Simple information panels.

Users will be able to maintain their own reference information without requiring an external account.

### 3. GeoFS ATC Phraseology Assistant

A virtual air traffic control phraseology reference and practice tool.

Planned features:

- Example ATC communication phrases.
- Selectable communication categories.
- Editable callsign information.
- Pilot and controller phrase examples.
- Searchable phrase library.
- Custom practice entries.
- Compact communication reference panel.

This is an educational and simulation companion. It does not connect to real air traffic control services or provide real-world flight clearances.

### 4. GeoFS Keyboard Reference

A searchable keyboard shortcut reference for convenient access to useful simulator controls.

Planned features:

- Searchable shortcut list.
- Categorized keyboard references.
- Custom shortcut notes.
- Editable entries.
- Compact reference panel.
- Desktop-friendly layout.
- Touch-friendly iPad layout.

The tool is intended to display reference information rather than automatically change simulator controls.

### 5. GeoFS Interface Profiles

A preference management tool for saving and switching between interface layouts.

Planned features:

- Save custom interface profiles.
- Create multiple named profiles.
- Switch between saved profiles.
- Rename profiles.
- Delete profiles.
- Restore default preferences.
- Store preferences locally.

Example profiles could include:

| Profile | Intended layout |
|---|---|
| Compact | Smaller panels and reduced spacing |
| Standard | Balanced everyday interface |
| Spacious | Larger panels and more comfortable spacing |
| Custom | User-defined appearance |

---

## 💻 Supported Platforms

| Platform | Intended version |
|---|---|
| Windows desktop | Tampermonkey |
| Microsoft Edge | Tampermonkey |
| Google Chrome | Tampermonkey |
| macOS | Compatible userscript manager |
| iPad Safari | Bookmarklet |
| Other browsers | Compatibility may vary |

Compatibility depends on browser security restrictions and changes to GeoFS.

---

## 📦 Project Structure

The planned repository structure is:

```text
Geo-FS-Interface-Plus/
│
├── README.md
├── LICENSE
├── CHANGELOG.md
│
├── UI-Enhancer/
│   ├── ui-enhancer.user.js
│   └── ui-enhancer-bookmarklet.txt
│
├── Aircraft-Reference-Cards/
│   ├── aircraft-reference.user.js
│   └── aircraft-reference-bookmarklet.txt
│
├── ATC-Phraseology-Assistant/
│   ├── atc-assistant.user.js
│   └── atc-assistant-bookmarklet.txt
│
├── Keyboard-Reference/
│   ├── keyboard-reference.user.js
│   └── keyboard-reference-bookmarklet.txt
│
└── Interface-Profiles/
    ├── interface-profiles.user.js
    └── interface-profiles-bookmarklet.txt
```

Each folder will contain its own desktop userscript and Safari bookmarklet version.

---

## 📱 Installation

### Desktop — Tampermonkey

1. Install Tampermonkey in your supported desktop browser.
2. Open the add-on's `.user.js` file from this repository.
3. Open the file using Tampermonkey's installation interface.
4. Review the script and install it.
5. Open GeoFS.
6. Open the add-on's interface if it does not appear automatically.

Repeat these steps for any other add-ons you want to install.

### iPad — Safari Bookmarklet

1. Open Safari.
2. Create a bookmark for any webpage.
3. Edit the bookmark.
4. Rename it to the corresponding add-on name.
5. Replace its URL with the complete bookmarklet code.
6. Save the bookmark.
7. Open GeoFS.
8. Activate the bookmarklet.

**Important:** Bookmarklets may be affected by Safari security restrictions. Some implementations may require an internet connection to load the corresponding script from GitHub.

---

## 🎨 Shared Customization System

One of the main design goals is to make the five add-ons feel like parts of the same application.

The shared customization system is intended to provide:

- Consistent visual styling.
- Shared colour preferences.
- Matching typography.
- Consistent panel layouts.
- Locally saved appearance settings.
- Independent add-on installation.

The goal is to make the tools look and feel connected without forcing users to install every add-on.

---

## ⚙️ How the Add-ons Work

The project uses JavaScript to create additional browser-based interfaces.

The desktop versions use userscript metadata to identify supported GeoFS webpages and run the add-on code when the page loads.

The iPad versions use bookmarklets. A bookmarklet is a JavaScript command saved as a browser bookmark. When activated, it can load or initialize the corresponding add-on.

Depending on the browser and page security policies, bookmarklet versions may need to load their main JavaScript file from this GitHub repository.

The add-ons are intended to use their own interface components and documented browser capabilities. They do not require undocumented GeoFS APIs or access to private simulator data.

---

## 🔒 Privacy and Security

This project aims to keep its tools simple and transparent.

- No account is required.
- No passwords are collected.
- No hidden analytics are intended.
- Local preferences are stored in the browser.
- Custom reference entries remain locally stored unless a particular export feature is added.
- No unnecessary external libraries are intended.

Always inspect scripts before installing or running them.

---

## ⚠️ Important Notice

Geo-FS-Interface-Plus is an independent community project.

It is not affiliated with, sponsored by, or officially supported by GeoFS.

All tools are intended for browser customization and virtual flight simulation.

Aircraft reference information and ATC examples are educational and are not intended for real-world aviation operations, navigation or flight planning.

Browser updates and GeoFS changes may affect compatibility.

Use at your own discretion.

---

## 🛠️ Development Principles

This project follows a few basic principles:

1. Original code rather than copied add-ons.
2. Separate desktop and iPad implementations.
3. Clear documentation.
4. Simple installation.
5. Touch-friendly controls.
6. Customizable interfaces.
7. Local-first data storage where practical.
8. Independent tools that do not require the entire collection.

The project is also intended to remain separate from other GeoFS repositories maintained by the same developer, with distinct features and purposes.

---

## 📜 License

This project is released under the **MIT License**.

See the `LICENSE` file for details.

---

**Geo-FS-Interface-Plus — Customize your interface. Expand your simulator toolkit.**
