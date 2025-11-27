# AGENTS.md

## Commands

- **Build**: `bun run build` (this generates the `dist/` folder)

## Working Guidelines

### Before Starting Tasks
- Read the `README.md` to get project context and progress
- When needing current date/time, run `date +%Y-%m-%d@%H:%M` for YYYY-MM-DD@HH:MM format (24-hour, no AM/PM)
- Git operations (commits, branches, merges, rebases) are NOT part of agent tasks

### Working with Plans
- Save plans in `docs/llm/plans/YYYY/MM/` directory structure
- Name files as `DD-task-name.md` (day + dash + lowercase task with dashes)
- Include implementation details: files to modify/create, code samples for new functions
- If applicable, suggest existing npm packages that can help with the implementation during plan creation; if multiple packages exist, list pros/cons and recommend one
- Never include git operations, changelogs, PR descriptions, version bumps, or release notes in plans
- Never worry about backwards compatibility if the version is pre-1.0.0
- If plan involves using a component from Shadcn that is not already created, include the command to generate it using the Shadcn CLI
- Do not code immediately after writing plans - wait for user review/approval

### Implementing Plans
- Only start implementation after explicit user command
- During implementation, STOP and inform user if deviating from the plan in any way
- Never implement anything not explicitly mentioned in the plan
- After implementation is fully finished and all tests pass, run the linter command and fix any issues


## Project Structure

- This is a Bun project. Never use `npm`, `node`, `typescript`, or `tsc` commands. Always use `bun` commands.
- This is a Vue project using Typescript natively (via Bun). Typescript transpilation is not required.
- Entry point is `src/main.ts`.
- Main app component is `src/App.vue`.
- Views live in `src/views/`.
- Components live in `src/components/`.
- Stores live in `src/stores/`.
  - The project uses Pinia for state management.
  - The Auth store stores user session state from the GraphQL backend.
- The router (Vue Router) is configured in `src/lib/router.ts`.
- The lib folder (`src/lib/`) also contains utility functions and modules.
- The project uses Shadcn-Vue for component generation. Generated components live in `src/components/ui/`.
  - When installing new Shadcn-Vue components, use the `bunx --bun shadcn-vue@latest add <component>` command.
- Other components live in `src/components/` (not in `ui/`).
- The project has an `@` alias pointing to `src/` for easier imports. When importing from `src/`, use `@/` instead of relative paths.
- Styles live in `src/style.css`. However that file is mostly for TailwindCSS imports and global styles.
  - For global styles, use App.vue's `<style>` block.
  - For component-specific styles, use the component's own `<style>` block. Do not use `scoped` styles.
- In `.vue` files, always place the `<script>` block first, followed by the `<template>`, and then the `<style>`.
  - If the `<style>` block has no styles set, omit it entirely.
- The project uses composition API with `<script setup lang="ts">` syntax in Vue components.
- When designing interfaces, use TailwindCSS 4 for styling.
- When working with links to routes use `router-link`. For links or buttons with the `to` argument, use route objects (with `name` property) instead of strings.

## Backend Interaction

- The app interacts with a GraphQL backend for authentication and user management.
- The GraphQL schema is documented in `docs/backend-graphql-schema.md`.


## Code Style Guidelines

### General
- Bias towards simplicity: don't over-engineer
- Do not install any new packages unless they are specified in the plan

### Testing

For unit tests of non-Vue code:
- Use `bun:test` framework with `describe`, `it`, and `expect` functions
- Do not use "should" in test descriptions (e.g., use `it('returns the correct path')` instead of `it('should return...')`)

Testing of Vue components is not currently required.

### Linting

There currently no linter configured. Use these simple rules:
- Use 2 spaces for indentation
- Use single quotes for strings
- No semicolons at the end of lines
- Use trailing commas in multi-line objects and arrays
- Files should end with a newline
- Use a space before the brackets in function definitions
