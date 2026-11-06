# Estructura proyectada del proyecto

```text
academic-pet/
├── README.md
├── PROMPT_MAESTRO_ASTRA.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── netlify.toml
├── index.html
├── public/
│   ├── manifest.webmanifest
│   ├── icons/
│   └── sprites/
├── src/
│   ├── main.ts
│   ├── app/
│   │   ├── app-shell.ts
│   │   └── game-coordinator.ts
│   ├── core/
│   │   ├── commands.ts
│   │   ├── result.ts
│   │   ├── errors.ts
│   │   ├── state.ts
│   │   ├── engine-needs.ts
│   │   ├── engine-actions.ts
│   │   ├── engine-projects.ts
│   │   ├── engine-progression.ts
│   │   ├── engine-economy.ts
│   │   ├── engine-combos.ts
│   │   ├── engine-automation.ts
│   │   ├── engine-time.ts
│   │   └── engine-events.ts
│   ├── data/
│   │   ├── stages.ts
│   │   ├── activities.ts
│   │   ├── events.ts
│   │   └── normative.ts
│   ├── persistence/
│   │   ├── indexed-db.ts
│   │   ├── migrations.ts
│   │   └── export-import.ts
│   ├── pwa/
│   │   └── service-worker.ts
│   ├── ui/
│   │   ├── dashboard.ts
│   │   ├── activities.ts
│   │   ├── career.ts
│   │   ├── dossier.ts
│   │   ├── events.ts
│   │   └── legacy.ts
│   └── styles/
│       └── main.css
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/
```

La estructura es una propuesta. El equipo puede ajustar nombres o dividir archivos si mantiene los contratos, las responsabilidades y la cobertura de pruebas.
