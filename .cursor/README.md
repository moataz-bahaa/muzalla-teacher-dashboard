# Cursor rules template — copy to new React projects

Copy the `.cursor/rules/` folder and `AGENTS.md` from `emtethal-frontend` when bootstrapping a new project that should follow the same conventions.

## Files to copy

```
.cursor/rules/
  core-standards.mdc      # always-on naming, types, formatting
  react-components.mdc    # *.tsx patterns
  data-api.mdc            # src/data/** patterns
  testing.mdc             # __tests__/** patterns
  new-features.mdc        # feature checklist
AGENTS.md                 # agent onboarding
.prettierrc               # optional — formatting
```

## Personal skill (all projects)

Skill installed at `~/.cursor/skills/emtethal-react-style/`. Cursor loads it when you mention matching Emtethal style or React conventions from this stack.

## Customize for a new repo

1. Update `AGENTS.md` stack table and folder layout
2. Adjust glob paths in rules if directory structure differs
3. Keep naming (`I`/`T` prefixes, kebab-case) and layer patterns (endpoints → client → hooks)
