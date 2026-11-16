# ✈️ Geo-FS-Interface-Add-Ons-Plus

### A customizable interface and reference-tool collection for GeoFS

Geo-FS-Interface-Add-Ons-Plus is a collection of independent JavaScript add-ons for GeoFS. The tools focus on interface customization, personal reference information, phraseology practice, keyboard documentation, and saved appearance profiles.

The repository contains five add-ons. Each has a desktop Tampermonkey userscript and an iPad Safari bookmarklet loader.

> **Project status:** The files are published, but compatibility can vary by browser and GeoFS version. Please test each add-on in your own setup before relying on it.

---

## 🧰 The five add-ons

### 1. GeoFS UI Enhancer

Customizes the appearance of this project's add-on panels.

- Light, Dark, and System themes.
- Custom accent colour.
- Small, Medium, and Large text settings.
- Compact, Comfortable, and Spacious density setting.
- Panel transparency and corner roundness.
- Movable settings panel.
- Local preference storage.
- Reset-to-default settings.

**Scope:** These settings style compatible add-on panels. They do not replace or reskin the built-in GeoFS interface. Panel resizing is not currently included.

Files:
- [Desktop userscript](UIEnhancer.User.js)
- [Safari bookmarklet loader](UIEnhancerbookmarklet.txt)

### 2. GeoFS Aircraft Reference Cards

A searchable, editable personal library for aircraft information.

- Searchable aircraft cards.
- Built-in starter reference entries.
- Custom aircraft entries.
- Editable titles and reference details.
- Personal notes.
- Local browser storage.
- Appearance settings compatible with the shared theme preference key.

Files:
- [Desktop userscript](aircraftreference.user.js)
- [Safari bookmarklet loader](aircraftreferencebookmarklet.txt)

Aircraft information is supplied for simulator reference and personal learning. Check authoritative sources for real-world aviation information.

### 3. GeoFS ATC Phraseology Assistant

An educational phraseology reference and fictional practice panel.

- Searchable example phrase library.
- Phrase categories.
- Fictional practice scenarios.
- Pilot and controller example views.
- Editable practice callsign and fictional station name.
- Save and delete personal practice notes.
- Local browser storage.
- Shared theme colour and appearance preferences.

Files:
- [Desktop userscript](atcphraseology.user.js)
- [Safari bookmarklet loader](atcphraseologybookmarklet.txt)

**Educational use only:** This tool does not connect to live air traffic control, issue clearances, or provide operational flight instructions. Its simplified examples are not a substitute for official aviation training or current publications.

### 4. GeoFS Keyboard Reference

A searchable and editable personal keyboard shortcut notebook.

- Search shortcut titles, key combinations, categories, and notes.
- Filter entries by category.
- Add, edit, and delete custom entries.
- Save entries locally in the browser.
- Uses the shared theme preferences for compatible appearance settings.

Files:
- [Desktop userscript](keyboardreference.user.js)
- [Safari bookmarklet loader](keyboardreferencebookmarklet.txt)

The starter entries are placeholders. Confirm key assignments in your current GeoFS version before adding them as verified shortcuts. This tool does not intercept, remap, or change simulator controls.

### 5. GeoFS Interface Profiles

A local profile manager for compatible add-on appearance settings.

- Save multiple named profiles.
- Apply a saved profile.
- Rename, update, and delete profiles.
- Includes starter layout profiles.
- Reset appearance settings.
- Stores profile data in local browser storage.
- Uses the same shared theme preference key as the UI Enhancer.

Files:
- [Desktop userscript](interfaceprofiles.user.js)
- [Safari bookmarklet loader](interfaceprofilesbookmarklet.txt)

Profiles manage appearance preferences used by compatible add-on panels. They do not save aircraft state, simulator controls, or GeoFS account settings.

---

## 📁 Repository layout

All files are currently stored in the repository root:

~~~text
Geo-FS-Interface-Add-Ons-Plus/
├── README.md
├── LICENSE
├── UIEnhancer.User.js
├── UIEnhancerbookmarklet.txt
├── aircraftreference.user.js
├── aircraftreferencebookmarklet.txt
├── atcphraseology.user.js
├── atcphraseologybookmarklet.txt
├── interfaceprofiles.user.js
├── interfaceprofilesbookmarklet.txt
├── keyboardreference.user.js
└── keyboardreferencebookmarklet.txt
~~~

The names and capitalization above match the files in the main branch.

---

## 💻 Desktop installation — Tampermonkey

1. Install Tampermonkey in a supported desktop browser.
2. Open the userscript file for the add-on you want.
3. Open its Raw view on GitHub.
4. Use Tampermonkey's installation page to review and install the script.
5. Open or refresh GeoFS.
6. Look for the add-on's launcher button.

Install only the add-ons you want. They are designed to be independent.

### Direct userscript links

| Add-on | Userscript |
|---|---|
| UI Enhancer | [UIEnhancer.User.js](https://raw.githubusercontent.com/CaptainCedricHockeyandMTB0291/Geo-FS-Interface-Add-Ons-Plus/main/UIEnhancer.User.js) |
| Aircraft Reference Cards | [aircraftreference.user.js](https://raw.githubusercontent.com/CaptainCedricHockeyandMTB0291/Geo-FS-Interface-Add-Ons-Plus/main/aircraftreference.user.js) |
| ATC Phraseology Assistant | [atcphraseology.user.js](https://raw.githubusercontent.com/CaptainCedricHockeyandMTB0291/Geo-FS-Interface-Add-Ons-Plus/main/atcphraseology.user.js) |
| Interface Profiles | [interfaceprofiles.user.js](https://raw.githubusercontent.com/CaptainCedricHockeyandMTB0291/Geo-FS-Interface-Add-Ons-Plus/main/interfaceprofiles.user.js) |
| Keyboard Reference | [keyboardreference.user.js](https://raw.githubusercontent.com/CaptainCedricHockeyandMTB0291/Geo-FS-Interface-Add-Ons-Plus/main/keyboardreference.user.js) |

---

## 📱 iPad installation — Safari bookmarklets

Each bookmarklet file in this repository is a small loader. When activated on a GeoFS page, it requests the matching JavaScript userscript from this repository's Raw GitHub address.

For each add-on:

1. Open Safari and create a bookmark for any page.
2. Edit that bookmark and give it the add-on's name.
3. Open the matching bookmarklet TXT file from this repository.
4. Copy the entire line beginning with the text javascript:.
5. Paste that line into the bookmark's URL field, replacing the existing address.
6. Save the bookmark.
7. Open GeoFS and activate the bookmark.

### Bookmarklet source files

| Add-on | Bookmarklet file |
|---|---|
| UI Enhancer | [UIEnhancerbookmarklet.txt](UIEnhancerbookmarklet.txt) |
| Aircraft Reference Cards | [aircraftreferencebookmarklet.txt](aircraftreferencebookmarklet.txt) |
| ATC Phraseology Assistant | [atcphraseologybookmarklet.txt](atcphraseologybookmarklet.txt) |
| Interface Profiles | [interfaceprofilesbookmarklet.txt](interfaceprofilesbookmarklet.txt) |
| Keyboard Reference | [keyboardreferencebookmarklet.txt](keyboardreferencebookmarklet.txt) |

**Bookmarklet requirements and limitations**

- An internet connection is required because the loader fetches the main script from GitHub.
- The bookmarklet must be activated on a GeoFS page.
- Safari or the page's Content Security Policy may block script injection. If that happens, use the desktop userscript version on a supported desktop browser.
- If a bookmarklet does not appear to work after an update, refresh GeoFS and activate it again.
- Keep the complete javascript: prefix when saving the bookmark. Some browsers may remove it when editing a bookmark, so check the saved URL.

---

## 🎨 Shared appearance preferences

The add-ons use a shared localStorage preference key:

**geofsInterfacePlusTheme**

The UI Enhancer is the main settings panel for this preference object. Other add-ons read compatible settings from the same key when they render.

Supported appearance values include:
- Theme: dark, light, or system.
- Accent colour.
- Text size.
- Transparency.
- Corner roundness.
- Density where the individual add-on implements it.

Not every setting affects every panel identically. The add-ons remain independently installable, and the shared preferences are stored by the browser for the current site origin.

---

## ⚙️ How the add-ons work

- **Userscripts** include Tampermonkey metadata that tells a userscript manager which GeoFS pages they are intended to run on.
- **Bookmarklets** are saved browser bookmarks containing JavaScript. In this project, each bookmarklet loads its matching userscript from the repository's Raw GitHub address.
- **Panels** are created by the scripts in the page. Most use Shadow DOM to isolate their interface styling from the surrounding page.
- **Local storage** keeps settings, cards, notes, profiles, and custom keyboard entries in the browser.

The bookmarklet loaders depend on the exact repository paths and filenames shown above. If a file is renamed or moved, its loader URL must be updated too.

---

## 🔒 Privacy and security

The add-ons are designed to work locally in the browser.

- No project account is required.
- The scripts do not ask for passwords.
- Personal entries and settings are stored in the browser's local storage.
- The bookmarklet loaders download the corresponding script from GitHub.
- Review the source code before installing or running it.
- Clearing browser site data may remove saved preferences, notes, cards, and profiles.
- Local data does not automatically synchronize between devices.

---

## ⚠️ Compatibility and disclaimer

Geo-FS-Interface-Add-Ons-Plus is an independent community project. It is not affiliated with, sponsored by, or officially supported by GeoFS.

The scripts target the GeoFS website domains listed in their userscript metadata. Browser updates, GeoFS changes, Safari restrictions, and content security policies may affect compatibility.

Aircraft cards, keyboard entries, and phraseology examples are for simulator reference and learning. They are not intended for real-world flight operations, navigation, or flight planning.

Use at your own discretion. Test each add-on in the simulator before relying on it.

---

## 🛠️ Development principles

1. Keep each add-on independent.
2. Use original code and document its purpose.
3. Provide desktop and iPad-oriented installation paths.
4. Keep personal data local where practical.
5. Avoid claiming a feature is tested unless it has actually been tested.
6. Keep bookmarklet URLs synchronized with the repository's actual file paths.
7. Document limitations clearly.

---

## 📜 License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for the full terms.

---

**Geo-FS-Interface-Add-Ons-Plus — Customize your interface. Organize your simulator toolkit.**
