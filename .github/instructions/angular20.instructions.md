---
applyTo: "**"
description: Complete Angular 19+ Coding, Structure, and Naming Guidelines (LLM/AI, Team Onboarding, Maintenance, Testing)
---

> **🚨 重要提醒**: 本專案採用共用服務架構，請務必使用 `HttpErrorHandlerService` 進行 HTTP 錯誤處理，不要建立私有的 `handleError` 方法。
> **Adapted from angular.dev/llms-full.txt, engineering best practices, and detailed team structure/naming guidelines for scalable, modern Angular projects.**

---

## 🎯 核心架構原則

### Shared Services Pattern (共用服務模式)
本專案實作了統一的共用服務模式，以提升程式碼的可重用性和維護性：

- **HttpErrorHandlerService**: 統一的 HTTP 錯誤處理服務
- **位置**: `src/app/core/services/http-error-handler.service.ts`
- **用途**: 為所有 HTTP 請求提供一致的錯誤處理和使用者友善的錯誤訊息
- **必須使用**: 所有服務的 HTTP 請求都必須使用此共用服務

```typescript
// ✅ 正確使用方式
constructor(
  private http: HttpClient,
  private errorHandler: HttpErrorHandlerService
) {}

return this.http.get<DataType>('/api/endpoint')
  .pipe(catchError(this.errorHandler.createErrorHandler('操作說明')));

// ❌ 避免這種做法
private handleError(error: HttpErrorResponse) { ... }
```

# System Instructions for Copilot in Angular v20+ projects
You are an expert in TypeScript and Angular (v20+), writing scalable, maintainable, accessible, and AI‑aware frontend code using Angular’s most modern APIs and conventions.

## ✅ TypeScript Best Practices
* Enable strict type checking.
* Prefer type inference when the type is obvious.
* Avoid `any`; use `unknown` when type uncertain.
* Use `interface` or type alias; prefer immutability (`const`) for state or configuration objects.

## ✅ Angular Core Guidelines
* Always use **standalone components, directives, and pipes**. No NgModule.
* Do *not* set `standalone: true` manually in decorators.
* Use **signals** and `computed()` for component state management; avoid manual mutation—use `update()` or `set()`. 
* Use `inject()` for DI, not constructor injection.
* Set `changeDetection: ChangeDetectionStrategy.OnPush`.
* Use `host` metadata instead of `@HostBinding` / `@HostListener`. Ensure `"typeCheckHostBindings": true` in tsconfig.json under `angularCompilerOptions`.
* Use reactive forms (FormGroup/FormControl) over template‑driven forms.
* Use class bindings (`[class]`) instead of `ngClass`, and style bindings (`[style]`) instead of `ngStyle`.

## ✅ Reactivity & State Management
* Use signal() for local state, computed() for derived state; avoid mutate(), use .set() or .update().
* Leverage extended expression syntax: JS ** operator, `in`, template literals, etc.
* Leverage stable APIs: effect, linkedSignal, toSignal, toObservable.
* Use @if, @for, @switch instead of *ngIf, *ngFor, *ngSwitch.
* Use `async` pipe to subscribe to Observables in templates.
* Use `effect()` only when necessary.
* Prefer signals over RxJS for local state; interop via `toSignal()` etc. when needed.
* Use `input()` / `output()` functions in components rather than decorator inputs/outputs.

## ✅ Component & Folder Structure
- Use **kebab-case** file names (e.g. `course-list.component.ts`, `course.service.ts`).
- One component = one file triplet: `.ts`, `.html`, `.css` with shared base name.
- Organize as:
  """
  src/
  app/
  core/
  services/
  guards/
  shared/
  components/
  features/
  course-management/
  course-list.ts
  course-list.html
  course-list.css
  app.ts

markdown
複製程式碼

  """

## ✅ CLI & Migration Tools
* Use CLI generators like:
  - ng generate @angular/core:control‑flow
  - ng generate @angular/core:signal‑input‑migration
  - cleanup‑unused‑import, self‑closing‑tag
* Use incremental hydration and @defer for SSR; hydrate controls; use placeholder blocks.

## ✅ Naming & Folder Structure
* No suffix on filenames or class names for components/directives/services (e.g. user-profile.ts not user-profile.component.ts).
* Pipes, guards, interceptors use hyphen suffix: auth-guard.ts, currency-pipe.ts.
* Filenames use kebab-case; test files end in .spec.ts.
* Organize by domain features: core/, domains/, shared/, etc with one concept per file.
* File names in kebab‑case: e.g. `course-list.ts`, `course-list.html`, `course-list.css`. Test files end in `.spec.ts`.
* Organize by feature area, group related files in folder, one concept per file.

## ✅ Forms, HTTP & Performance
* Use Reactive Forms (FormGroup/FormControl).
* Services single responsibility with providedIn: 'root'; inject in components via `inject()`.
* Use `NgOptimizedImage` for all static images.
* In @for loops include trackBy(). rely on built-in diagnostics for missing `track` invocation.
* Use pure pipes for heavy computation; defer non-critical UI.

## ✅ Lazy Loading & Routing
* Implement lazy-loaded feature modules (though using standalone components).
* Use signals and standalone components for feature routes and route-level state management.

## ✅ Accessibility & Security
* Use semantic HTML and ARIA attributes.
* Avoid innerHTML; rely on Angular sanitization.
* Enable CLI autoCsp for production builds.

## ✅ Testing
* Tests follow Arrange–Act–Assert.
* test files end in .spec.ts.
* Prefer Vitest + jsdom in Angular v20 if feasible.
* Use signal-based APIs in test code.

## ✅ AI Context & Code Generation
* Include llms.txt in root with links to official docs, code recipes.
* System prompts align with Angular official style guide and “Develop with AI” conventions; avoid legacy APIs (NgModule, structural directives, ZoneJS).
* Use only Angular v20+ APIs—no legacy NgModule, no structural directives like `*ngIf`, etc.
