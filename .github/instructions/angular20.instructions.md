---

applyTo: "**"
description: Complete Angular 20+ Coding, Structure, and Naming Guidelines (LLM/AI, Team Onboarding, Maintenance, Testing)

---

# 🟢 Angular 20+ Coding, Structure & Naming Unified Guide

> **🚨 重要提醒: 本專案採用共用服務架構，請務必使用 HttpErrorHandlerService 進行 HTTP 錯誤處理，不要建立私有的 handleError 方法。**

**Adapted from angular.dev/llms-full.txt, engineering best practices, and the latest v20+ architectural, naming, and code structure guidelines for large-scale Angular projects.**

---

## 1. Top-Level Project Structure

* `src/app/core/`
  * Global infrastructure and non-business utilities (layouts, authentication, interceptors, guards, shared services, error handling, utils)
    
* `src/app/features/`
  * Each business domain/feature in a separate folder: contains pages, components, services, store (signals), types, routes, etc.

* `src/app/shared/`
  * **Only** dumb UI components, shared pipes, and utilities; **no business logic allowed**

* `src/environments/`
  * Environment config files: `environment.ts`, `environment.prod.ts`, etc.

* `src/assets/`
  * Static resources (images, icons, fonts, SVGs, i18n, media, etc.)

**Example:**

```plaintext
src/
├── app/
│   ├── core/                    # 全站共用：服務、攔截器、路由守衛、工具函式
│   │   ├── services/            # 共用服務（如：HttpErrorHandlerService）
│   │   ├── interceptors/        # HTTP 攔截器（如：AuthInterceptor）
│   │   ├── guards/              # 路由守衛（如：AuthGuard）
│   │   ├── system-parameter.ts  # 系統參數（如：API 基礎 URL）
│   │   └── util.ts              # 工具函式（如：日期格式化）
│   │
│   ├── shared/                  # 可重用的 UI 元件、指令、管道
│   │   ├── components/          # 像是「搜尋欄」、「表格」、「按鈕組」等元件
│   │   ├── directives/          # 自訂指令，像是 appFocus 自動聚焦輸入框
│   │   └── pipes/               # 管道，像是把日期轉成 2025/07/22 格式
│   │
│   ├── features/                # 功能模組：auth、employee、department 等
│   │   ├── auth/                # 登入、註冊、登出等功能
│   │   │   ├── components/      # 該功能內的畫面元件
│   │   │   ├── services/        # 該功能自己的 API 或資料處理服務
│   │   │   ├── store/           # 狀態管理服務（如：AuthStoreService）
│   │   │   ├── pages/           # 該功能的頁面元件
│   │   │   ├── models/          # 該功能的資料模型（（像 EmployeeDto, DepartmentModel）
│   │   │   └── xxx.routes.ts    # 該功能的路由設定
│   │   ├── employee/            # 員工管理功能
│   │   ├── department/          # 部門管理功能
│   │   ├── dialog-demo/         # Dialog 示範頁面
│   │   └── ...                  # 其他功能模組
│   │
│   ├── layouts/                 # 主畫面與登入畫面的版型
│   │   ├── main-layout/         # 主畫面版型（包含側邊選單、頂部導航）
│   │   │   ├── main-layout.component.ts
│   │   │   ├── main-layout.component.html
│   │   │   └── main-layout.component.scss
│   │   ├── auth-layout/         # 登入畫面版型（簡單的登入表單）
│   │   └── ...
│   │
│   ├── app.config.ts            # 全站設定
│   ├── app.routes.ts            # 整個網站的路由設定入口
│   ├── app.component.ts         # 網站的根元件（通常是外框）
│   └── main.ts                  # Angular 程式進入點
│   
├── assets/                      # 靜態資源：圖片、樣式、JSON、翻譯
│   ├── images/                  # 圖片資源
│   ├── styles/                  # 全站樣式（如：變數、混合、全局樣式）
│   │   └── theme.scss           # 主題樣式
│   ├── icons/                   # 圖示資源（如：SVG 圖示）
│   ├── fonts/                   # 字型資源
│   ├── i18n/                    # 翻譯檔案（如：zh.json、en.json）
│   └── data/                    # 模擬資料（如：employees.json、city-codes.json）
│   
└── environments/                # 環境設定檔（開發與正式）
    ├── environment.ts           # 開發環境設定
    └── environment.prod.ts      # 正式環境設定
```

---

## 2. Component File Separation Principle
**Standalone First**: Create components as standalone by default
**Naming**: Use kebab-case for component selectors (e.g., `app-user-list`)
* Each component **must** be split into three files:
  * `component-name.component.ts` — Logic
  * `component-name.component.html` — Template
  * `component-name.component.scss` — Styles
* Inline templates/styles are **prohibited** (except rare cases)
* No style attributes or inline CSS in templates unless truly necessary
* Do not use class/id in HTML to override SCSS; all overrides go in stylesheets
* HTML should be clean, semantic, and only for structure
* **Shared Components**: Place reusable UI components in `shared/components/`
* **Feature Components**: Place feature-specific components in `features/{feature}/components/`
* **Data Conversion**: Always handle snake_case ↔ camelCase conversion in components

  ```typescript
  // ✅ Correct Component Pattern with Data Conversion
  export class DepartmentQueryComponent {
    performSearch(): void {
      // 1. Build camelCase query object
      const queryDto: DepartmentQueryDto = {
        deptCode: this.queryForm.value.deptCode,
        deptName: this.queryForm.value.deptName,
        isActive: this.queryForm.value.isActive,
        firstIndexInPage: firstIndex,
        lastIndexInPage: lastIndex
      };

      // 2. Convert to snake_case for API request
      const requestData = objectToSnakeCase(queryDto);

      // 3. Make API call
      this.departmentService.searchDepartments(requestData)
        .subscribe(response => {
          if (response.code === 1000 && response.data) {
            // 4. Convert response back to camelCase
            const convertedResponse = objectToCamelCase<any>(response);
            const data = convertedResponse.data;
            
            // 5. Use camelCase data in component
            this.results = {
              dataList: data.dataList,
              totalRecords: data.totalRecords,
              firstIndex: data.firstIndexInPage
            };
          }
        });
    }
  }
  ```

---

## 3. Layouts Directory
* All layout components go in `core/layout/`
* Examples: `main-layout/`, `admin-layout/`, `auth-layout/`
* Layouts also use the three-file split rule

```plaintext
core/
  └── layout/
        ├── main-layout/
        ├── admin-layout/
        └── auth-layout/
```

---

## 4. Assets & Environments
### Assets
* All static files (images, SVGs, fonts, i18n, etc.) go under `assets/` in proper subfolders
* CLI/Vite will automatically process and bundle assets

### Environments
* Environment variables/settings must be placed in `environments/` and referenced from there—never hardcoded
* **All environment variables must be retrieved via these files – never hardcode in code**

---

## 5. Naming Conventions
當然，以下是你描述的**命名慣例，第 5 點的英語版 instructions 條文**，格式可直接替換原本文件的第 5 點。

---

## 5. Naming Conventions
* **Feature-related files must include a clear functional suffix:**
  * `xxx.component.ts`: Component file
  * `xxx.service.ts`: Service file
  * `xxx.directive.ts`: Directive file
  * `xxx.pipe.ts`: Pipe file
  * `xxx.guard.ts`: Guard file

* **Domain types and utility files do not use functional suffixes. Name them according to their content, using kebab-case:**
  * Examples:
    * `department.model.ts`
    * `date-util.ts`
    * `api.dto.ts`
    * `status.enum.ts`

* **All folder and file names should use kebab-case** (e.g., `employee-list`, `department-management`).

* **All test files must end with `.spec.ts` and be placed next to their corresponding source files:**
  * Examples:
    * `employee.service.spec.ts`
    * `user-form.component.spec.ts`

* **Class, interface, and type names:** Use PascalCase (e.g., `EmployeeListComponent`, `DepartmentDto`).

* **Variable and function names:** Use camelCase (e.g., `employeeList`, `getEmployee()`).

* **Constant names:** Use UPPER\_SNAKE\_CASE (e.g., `DEFAULT_PAGE_SIZE`).

> **Recommendation:**
> This naming convention aligns with Angular CLI standards and is suitable for large-scale, collaborative, and AI-assisted development.
> Please follow these rules consistently to ensure clarity, maintainability, and ease of onboarding for all team members.

---

## 6. Feature-First & Standalone Principles
* Every feature/domain folder is fully self-contained (pages, components, services, signals/store, types, routes, etc.)
* Use **standalone components/directives/pipes** exclusively—no NgModules
* Routing, DI, and state are all handled via standalone APIs

---

## 7. State Management & Signals
* Use `signal()`, `computed()`, and `effect()` for all local state (never use class properties for state)
* Use `input()`, `input.required()` instead of `@Input()`
* Use `output()` instead of `@Output()`
* Use `linkedSignal()` for two-way binding if needed
* Feature folders should always use signals/store for state

---

## 8. Dependency Injection
* **Always use the `inject()` function** for all DI (Angular services, ActivatedRoute, ChangeDetectorRef, etc.); never use constructor injection

---

## 9. Routing
* Use `loadComponent()` for lazy routes (**no NgModule-based routing**)
* Place route files inside each feature folder
* Use signal-based `input()` for route params

---

## 10. HttpClient & Resource API
* Use `resource()` / `httpResource()` for data fetching and reactive flows (Angular 20+)
* Each resource should define `request()` and `loader()`; provide input via signals
* Never use `subscribe()` inside components; always use reactive patterns
* Use `async` pipe to subscribe to Observables in templates.

---

## 11. Testing & Test Files
* Test files are placed next to source, always named `.spec.ts`
* Tests should cover components, services, pipes, guards, etc.
* Use Vitest + jsdom (recommended for Angular 20+; replaces Karma)
* Arrange–Act–Assert structure for all tests
* Use signal-based APIs for testing component behavior

---

## 12. Coding Style & Control Flow
* Use new native control flow: `@if`, `@for`, `@defer` (never use `*ngIf`, `*ngFor`)
* Always set `ChangeDetectionStrategy.OnPush`
* Never use `ngClass`/`ngStyle`; always use `[class]`/`[style]`
* Use Reactive Forms; do not use template-driven forms
* Folder structure should be flat and clear—no excessive nesting

---

## 13. Images & Optimization
* Always use `NgOptimizedImage` for static images (never plain `<img>`)
* All static assets must be managed under `assets/`

---

## 14. Practices to Avoid
* **Do not** create technology-first root folders (`components/`, `services/`, etc.); always organize by feature
* **Do not** put any business logic in `shared/`; only UI, pipes, or utilities allowed
* Avoid NgModule, template-driven forms, class property state, inline styles, direct subscribe()
* Do not hardcode environment variables in code

---

## 15. Additional Recommendations
* **Always** use Angular CLI/Vite generators (schematics) to create files
* Regularly refactor and clean up unused files/components
* Add a short `README.md` in each major folder to document its purpose if possible
* All code must pass linting (eslint, prettier) and type checking before commit (setup pre-commit hooks).
* Copilot/AI should always generate code conforming to these lint rules.


---

## 16. AI/Copilot/LLM Prompt Context
* If your team uses AI tools (e.g., Copilot, ChatGPT, or custom LLM solutions) to assist development, you **must** include a `llms.txt` file in the project root.
* The `llms.txt` should contain:
  - Official Angular documentation and reference links
  - Project-specific code conventions and recipes
  - Any additional AI/system prompt instructions to improve automation or code generation consistency
* This helps ensure all AI tools generate code that matches the team’s latest standards and conventions.
* Example:
 ```
 llms.txt
 Angular official docs: https://angular.dev/docs
 Project coding conventions: see README.md in /core, /features, /shared
 Code samples: https://github.com/example/angular-samples
 ```

## 17. ReadMe Markdown
For every major folder (such as core/, domains/, features/, shared/), you must include a detailed README.md file.
* This README should be written in simple, beginner-friendly language.
* It must clearly explain:
  - The overall purpose of the folder (why it exists and its role in the application)
  - What kinds of files/components/resources are inside
  - Any important coding or usage conventions that apply to this folder
  - How someone new to the project should use or extend this folder (with practical examples if possible)
* The goal: Anyone, even without prior experience on this project, should be able to read this file and immediately understand what this part of the codebase is for, and how to work with it.
* Prefer clear, step-by-step explanations, diagrams, or file tree samples where helpful.
* Every folder (core, features, shared) must have a beginner-friendly README.md, including:
 - Overview of purpose and contents
 - Key usage conventions
 - **A minimum working code example**

---

## 18. Getting Started & Onboarding
For new contributors and Copilot-assisted development:
- See the "minimum working example" in each major folder's README.md for direct copy-paste usage.
- Refer to the "Common Pitfalls & FAQ" section for typical errors and solutions.

---

## 18. Do's and Don'ts Summary Table

| ✅ Do                             | ❌ Don't                                  |
| -------------------------------- | ---------------------------------------- |
| signals, input()/output()        | class properties, @Input(), @Output()    |
| inject()                         | constructor injection                    |
| loadComponent()                  | loadChildren()                           |
| resource()/httpResource()        | subscribe() in components                |
| @if/@for/@defer                  | \*ngIf/\*ngFor                           |
| NgOptimizedImage                 | plain <img> (no optimization)            |
| Reactive Forms                   | template-driven forms                    |
| Small, focused components        | Large, monolithic components             |
| Consistent naming                | Inconsistent naming                      |
| Three-file component separation  | Inline templates/styles (except trivial) |
| Use assets/ for all static files | Scatter static files in app/             |
| Feature-first folder structure   | Technology-first root folders            |
| Use CLI/Vite generators          | Manual file creation, inconsistent style |

---

## 19. Official References

* [Angular LLM Guidelines](https://angular.dev/llms)
* [Angular Signals](https://angular.dev/guide/signals)
* [Angular Routing](https://angular.dev/guide/router)
* [HttpClient Resource API](https://angular.dev/api/common/http/httpResource)
* [Angular 20 Standalone Best Practices](https://blog.angular.dev/announcing-angular-v20-b5c9c06cf301?utm_source=chatgpt.com)

---

## 20. Notes

* Applies to all Angular 20+ projects, team onboarding, and LLM/Copilot scenarios
* Special rules may be added in feature folders as needed
* This guide merges all v19 principles that are still compatible with v20+ and adds new v20+ specifics (Standalone Components, Signals, Resource API, Native Control Flow, new naming conventions)

---

## 21. Git Commit Message Standards
All commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/).
Example: `feat(employee): add profile picture upload`
This helps Copilot/AI generate correct changelogs and PR descriptions.
