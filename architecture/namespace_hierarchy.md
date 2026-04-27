# Namespace Hierarchy

```text
App
├── ExampleContext [context] Public API boundary for example features
│   ├── ExampleSchema [schema] Ecto schema for example records
│   └── ExampleRepository [module] Data access for example records
└── AppWeb
    └── ExampleLive [liveview] LiveView surface for the example feature
```
