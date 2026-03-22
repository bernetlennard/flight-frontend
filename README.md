# Flugbuchungssystem - Frontend

Dieses Projekt beinhaltet das Frontend für das Flugbuchungssystem.
Es wurde als Single Page Application mit React umgesetzt.

## 1. Verwendete Software & Technologien

* **Framework:** React 18
* **Sprache:** TypeScript
* **Build-Tool:** Vite
* **Styling / UI:** Bootstrap 5 (via `react-bootstrap`)
* **Routing:** `react-router-dom`
* **Node.js:** Version 18 oder neuer (empfohlen)
* **Paketmanager:** npm

## 2. Voraussetzungen

* Damit das Frontend funktioniert, **muss zwingend das Backend (Spring Boot) laufen** (siehe `https://github.com/bernetlennard/fligth-api`).
* Das Backend wird standardmäßig unter `http://localhost:8080` erwartet.
* Node.js muss auf dem System installiert sein.

## 3. Installation & Start

Befolge diese Schritte, um die Frontend-Applikation lokal zu starten:

1.  **Terminal öffnen:** Navigiere im Terminal in das Root-Verzeichnis dieses Frontend-Projekts (`flight-frontend`).
2.  **Abhängigkeiten installieren:** Führe den folgenden Befehl aus, um alle nötigen npm-Pakete herunterzuladen:
    ```bash
    npm install
    ```
3.  **Entwicklungsserver starten:** Starte die Applikation mit:
    ```bash
    npm run dev
    ```
4.  **App im Browser öffnen:** Das Terminal zeigt nun eine URL an (in der Regel `http://localhost:5173/`). Öffne diesen Link in deinem Webbrowser.