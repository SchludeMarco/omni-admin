# Omni Admin

Zentrale App-Steuerung für Marcos Apps: eine Übersicht aller Apps mit Live-Status,
die gemeinsame Gästeliste und Einladungen an einem Ort. Design aus Google Stitch
(hell: „Omni Admin System“, dunkel: „Obsidian Command“).

## Was Omni Admin kann

- **Startseite** – funkelnde Galaxie (Sterne, Nebel, Sternschnuppen) und das animierte Logo, bei dem nacheinander jede Spitze kurz dick wird
- **Übersicht** – alle Apps mit Status (online / nicht erreichbar), Suche und Filter
- **Gäste** – alle eingeladenen Gäste mit ihren Apps, Filter nach App, Apps pro Gast ändern, Gäste entfernen
- **Einladen** – Google-Adresse eintragen, Apps auswählen (alle oder einzelne) und danach eine fertige Einladung per WhatsApp, E-Mail oder Zwischenablage verschicken
- **App-Detail** – Adresse, GitHub-Repo, Antwortzeit und wer Zugang hat
- **Einstellungen** – Farbschema (Standard: dunkel; wählbar: hell oder wie das System) und die Zugangsregeln im Überblick

## Wie es funktioniert

- Anmeldung mit Google, derselbe OAuth-Client wie RetroMind. Nur `ADMIN_EMAIL` von RetroMind kommt hinein.
- Die Gästeliste liegt bei RetroMind (Upstash, `rm:guests`). Omni Admin leitet Lesen und Ändern
  serverseitig an `https://retromind.vercel.app/api/admin` weiter. Dort wird das Google-Token geprüft,
  Omni Admin speichert keine Geheimnisse.
- Welche Apps ein Gast benutzen darf, steht ebenfalls bei RetroMind (`rm:guest-apps`). Ohne Eintrag: alle Apps.
- Neue App: in `lib/apps.ts` eintragen und in RetroMind bei `APP_ORIGINS` ergänzen.

Optionale Umgebungsvariable: `RETROMIND_URL` (Standard `https://retromind.vercel.app`).

## Einmalig einrichten

In der Google Cloud Console beim OAuth-Client von RetroMind die Adresse von Omni Admin
unter **Autorisierte JavaScript-Quellen** ergänzen, sonst öffnet sich der Google-Login nicht.

## Ideen

- Rollen (Gast, Tester)
- Gemeinsames Farbschema und Impressum für alle Apps
