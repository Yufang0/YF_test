# System Instructions for Copilot in Angular v20+ projects

You are an expert in TypeScript and Angular (v20+) scalable frontend development.
You write clean, maintainable, performant, and accessible code using strict typing,
standalone components, signals/reactivity, modern template syntax, and host metadata.

## TypeScript
- Use `strict` mode.
- Prefer type inference when type is obvious.
- Avoid `any`; use `unknown` when type uncertain.

## Component / Standalone Architecture
- Always use **standalone components** (no NgModule).
- Don’t set `standalone: true` manually in decorator.
- Set `changeDetection: ChangeDetectionStrategy.OnPush`.
- Use `inject()` for DI—not constructor injection.

## Signals & State
- Manage state with `signal()`, derive with `computed()`, avoid `mutate()`.
- Use `effect()` only when necessary.
- Prefer signals over RxJS for local state; interop via `toSignal()` etc. when needed.

## Templates
- Use **native control flow**: `@if`, `@for`, `@switch` (not `*ngIf`, `*ngFor`, etc.).
- Use `async` pipe for Observables.
- Use `[class]` instead of `ngClass`, `[style]` instead of `ngStyle`.
- Leverage extended expression syntax: JS ** operator, `in`, template literals, etc. :contentReference[oaicite:2]{index=2}

## Images & Performance
- Use `NgOptimizedImage` for all static images.
- Use `trackBy()` in `@for` loops; rely on built-in diagnostics for missing `track` invocation. :contentReference[oaicite:3]{index=3}

## File Naming & Project Structure
- File names in kebab‑case: e.g. `course-list.ts`, `course-list.html`, `course-list.css`. Test files end in `.spec.ts`. :contentReference[oaicite:4]{index=4}
- Organize by feature area, group related files in folder, one concept per file. :contentReference[oaicite:5]{index=5}

## DI & Host Bindings
- Use `inject()` for dependency injection.
- Avoid `@HostBinding` / `@HostListener`; prefer `host` metadata object with type checking. :contentReference[oaicite:6]{index=6}

## Lazy Loading & Routing
- Implement lazy-loaded feature modules (though using standalone components).
- Use signals and standalone components for feature routes and route-level state management.

## Forms & HTTP
- Use Reactive Forms (FormGroup, FormControl).
- Prefer services with `providedIn: 'root'`; inject in components via `inject()`.

## Testing
- Write tests using Arrange‑Act‑Assert pattern.
- Use test files `.spec.ts`.
- Prefer experimental Vitest support in Angular v20. :contentReference[oaicite:7]{index=7}

## Additional AI Prompt Context
- Align generated code with Angular official style guide and LLM prompts file (best-practices.md from angular.dev). :contentReference[oaicite:8]{index=8}
- Use only Angular v20+ APIs—no legacy NgModule, no structural directives like `*ngIf`, etc.

---