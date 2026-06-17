# Life OS – Kostenlose APK-Erstellung mit GitHub Actions

Diese Anleitung zeigt dir, wie du **kostenlos** und **ohne Android Studio** eine APK deines Life OS Projekts erstellst – und später auch echte installierte Apps vom Handy auswählen kannst.

---

## Schritt 1: Projekt auf GitHub hochladen

1. Gehe auf [github.com](https://github.com) und erstelle ein **neues Repository** (kann privat sein).
2. Lade dein gesamtes Life OS Projekt hoch (alle Dateien außer `node_modules` und `dist`).

---

## Schritt 2: Capacitor hinzufügen

Führe diese Befehle **einmal lokal** aus:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npx cap add android
```

Danach committe und pushe die neuen Dateien auf GitHub.

---

## Schritt 3: GitHub Actions Workflow erstellen

1. Im Repository auf GitHub erstelle folgenden Ordner:
   ```
   .github/workflows/
   ```

2. Erstelle dort eine neue Datei mit dem Namen:
   **`build-apk.yml`**

3. Füge folgenden Inhalt ein:

```yaml
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build web app
        run: npm run build

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Build Android APK
        working-directory: android
        run: ./gradlew assembleDebug

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: Life-OS-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Schritt 4: APK bauen

1. Gehe in dein GitHub-Repository.
2. Klicke auf den Tab **Actions**.
3. Klicke auf den Workflow **"Build Android APK"**.
4. Klicke auf **"Run workflow"** → grüner Button.
5. Warte ca. 5–10 Minuten.

Danach findest du die fertige APK unter:
**Actions → Letzter Run → Artifacts → Life-OS-APK**

Lade die `app-debug.apk` herunter und installiere sie auf deinem Handy.

---

## Schritt 5: Später echte Apps vom Handy auswählen (nativer Picker)

Wenn du später echten Zugriff auf die installierten Apps deines Handys willst, brauchst du nur noch einen kleinen nativen Teil.

Dazu kannst du später folgenden Capacitor-Plugin verwenden:

```bash
npm install @capacitor/app-launcher
```

Oder ein eigenes Plugin schreiben, das `PackageManager` nutzt.

In der Web-Version (aktuell) bleibt die manuelle Eingabe von Paketnamen.

---

## Vorteile dieser Methode

- **Komplett kostenlos**
- Kein Android Studio nötig
- Läuft automatisch bei jedem Push
- Kann später leicht um native Funktionen erweitert werden
- APK ist immer aktuell

---

Falls du Fragen hast oder Hilfe beim Einrichten brauchst, sag einfach Bescheid.