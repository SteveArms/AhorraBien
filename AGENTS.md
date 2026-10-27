# AhorraBien

App web responsive (pensada primero para móvil) que compara el **costo real** de dos alternativas de compra en soles (S/). Todo es local: no hay backend; preferencias e historial viven en `localStorage`.

**Fórmula de costo** (`src/features/comparison/lib/calculate-cost.ts`):
`costo = precio − descuento − beneficio de pago + transporte + otros gastos` (redondeado a 2 decimales, mínimo 0). El **cashback** es referencial: se muestra aparte y **no** reduce el costo. Si la alternativa no pasa `altSchema`, el costo es `null`.

Documentación para personas (presentación, instalación, capturas): `README.md`. Capturas en `docs/screenshots/`; si cambias una pantalla visible, actualiza su captura.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 6 (strict) · Tailwind CSS v4 · Zustand 5 (`persist`) · Zod 4 · Vitest + Testing Library · ESLint 9 (`eslint-config-next`) · Prettier (+ plugin de Tailwind) · pnpm 11 · Node 22 (ver `.mise.toml`).

> TypeScript está fijado en 6.x y ESLint en 9.x porque `typescript-eslint` y los plugins de `eslint-config-next` aún no soportan TS 7 / ESLint 10.

## Comandos

| Comando                             | Qué hace                                       |
| ----------------------------------- | ---------------------------------------------- |
| `pnpm dev`                          | Servidor de desarrollo (http://localhost:3000) |
| `pnpm build` / `pnpm start`         | Build de producción / servirlo                 |
| `pnpm typecheck`                    | `tsc --noEmit`                                 |
| `pnpm lint`                         | ESLint                                         |
| `pnpm test` / `pnpm test:watch`     | Vitest (`src/**/*.test.ts(x)`, entorno jsdom)  |
| `pnpm format` / `pnpm format:check` | Prettier                                       |

Antes de terminar un cambio: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`.

## Mapa del proyecto

```
src/
  app/            Rutas (App Router). Las page.tsx son delgadas: solo metadata + componente de features/.
  components/
    ui/           Piezas genéricas sin lógica de negocio (Button, NumberField, ConfirmDialog…)
    layout/       Estructura de pantalla (Screen, ScreenHeader, BottomNav, AppFrame, hidratación)
  features/<f>/   Pantallas y piezas de cada dominio; lógica pura en features/<f>/lib/
  hooks/          Hooks compartidos (validación, navegación protegida, hidratación…)
  schemas/        Esquemas Zod: la fuente de verdad de los datos y sus mensajes de error
  store/          Store global de Zustand y selectores
  lib/            Utilidades puras (cn, formato de moneda/fecha)
  types/          Tipos inferidos de los esquemas (z.infer). No declares tipos de datos a mano.
```

### Rutas → archivos

| URL                          | Página                                                  | Componente principal                                  |
| ---------------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| `/`                          | `src/app/page.tsx`                                      | `features/onboarding/components/welcome-screen.tsx`   |
| `/onboarding/objetivo`       | `src/app/(onboarding)/onboarding/objetivo/page.tsx`     | `features/onboarding/components/goal-step.tsx`        |
| `/onboarding/dificultades`   | `src/app/(onboarding)/onboarding/dificultades/page.tsx` | `features/onboarding/components/difficulty-step.tsx`  |
| `/demo`                      | `src/app/(onboarding)/demo/page.tsx`                    | `features/onboarding/components/demo-screen.tsx`      |
| `/inicio`                    | `src/app/(app)/inicio/page.tsx`                         | `features/home/components/home-screen.tsx`            |
| `/comparar`                  | `src/app/(app)/comparar/page.tsx`                       | `features/comparison/components/comparison-form.tsx`  |
| `/comparar/a`, `/comparar/b` | `src/app/(app)/comparar/[alt]/page.tsx`                 | `features/comparison/components/alt-details-form.tsx` |
| `/resultado`                 | `src/app/(app)/resultado/page.tsx`                      | `features/comparison/components/result-view.tsx`      |
| `/aprender`                  | `src/app/(app)/aprender/page.tsx`                       | `features/learn/components/lessons-index-screen.tsx`  |
| `/aprender/[slug]`           | `src/app/(app)/aprender/[slug]/page.tsx`                | `features/learn/components/lesson-screen.tsx`         |
| `/historial`                 | `src/app/(app)/historial/page.tsx`                      | `features/history/components/history-screen.tsx`      |
| `/perfil`                    | `src/app/(app)/perfil/page.tsx`                         | `features/profile/components/profile-screen.tsx`      |

Grupos de rutas:

- `(onboarding)/layout.tsx` y `(app)/layout.tsx` envuelven en `HydrationGate` (no renderizan hasta leer `localStorage`).
- `(app)/layout.tsx` además monta `BottomNavSlot` (`components/layout/bottom-nav.tsx`): en móvil y tablet es una barra inferior visible solo en `BOTTOM_NAV_PATHS`; desde `lg` es una barra superior de 64px (logo a la izquierda, secciones a la derecha) en todas las pantallas de `(app)`, y el layout desplaza el contenido con `lg:pt-16`.
- `src/app/layout.tsx`: fuentes (`next/font`), metadata, `StoreHydrator`, `AppFrame` y `Toast`.

### ¿Dónde está…?

| Necesito…                                     | Archivo                                                                                                   |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Cálculo de costo / ganador / diferencia       | `src/features/comparison/lib/calculate-cost.ts` (`calculateCost`, `compareAlternatives`)                  |
| Datos de ejemplo, borrador inicial            | `src/features/comparison/lib/factories.ts`                                                                |
| ¿Es un ejemplo? (etiqueta, historial, ahorro) | `isIllustrative` en `src/features/comparison/lib/illustrative.ts` (producto y montos, no basta el nombre) |
| Reglas de validación y mensajes de error      | `src/schemas/comparison.schema.ts` (`MESSAGES`, `altSchema`, `productSchema`, `altKeySchema`)             |
| Qué se guarda en `localStorage`               | `src/schemas/persisted-state.schema.ts` + `partialize` en `src/store/app-store.ts`                        |
| Estado global y acciones                      | `src/store/app-store.ts` (`useAppStore`)                                                                  |
| Valores derivados del estado                  | `src/store/selectors.ts`                                                                                  |
| Errores por campo para formularios            | `src/hooks/use-alt-validation.ts`                                                                         |
| Confirmar antes de salir con cambios          | `src/hooks/use-guarded-navigation.ts`                                                                     |
| Textos de los diálogos de confirmación        | `CONFIRM_PRESETS` en `src/components/ui/confirm-dialog.tsx`                                               |
| Contenido de las lecciones, lección sugerida  | `src/features/learn/lessons.ts` (`LESSONS`, `suggestLesson`)                                              |
| Volver atrás con ruta de respaldo             | `src/hooks/use-back-navigation.ts` (`useBackNavigation`)                                                  |
| Opciones del onboarding                       | `src/features/onboarding/constants.ts`                                                                    |
| Dificultades/objetivo → temas, pesos, filas   | `src/features/personalization/topics.ts` (`topicWeights`, `highlightedFields`)                            |
| Detector de ilusiones (alertas del resultado) | `src/features/comparison/lib/detect-illusions.ts` + `components/illusion-alerts.tsx`                      |
| Lecciones ordenadas para el usuario           | `rankLessons` en `src/features/learn/lessons.ts`                                                          |
| Colores, radios, fuentes, animaciones         | `@theme` en `src/app/globals.css`                                                                         |
| Íconos SVG                                    | `src/components/ui/icon.tsx` (agrega el path al mapa `paths`)                                             |
| Formato de soles y fechas                     | `src/lib/format.ts`                                                                                       |

## Estado (Zustand)

- `useAppStore` guarda `goal`, `difficulties`, `saved` (historial), `draft` (comparación en edición), `dirty` y `toast`.
- Solo `goal`, `difficulties` y `saved` se persisten (clave `ahorrabien:v1`). El `draft` y `dirty` se guardan por pestaña en `sessionStorage` (`src/store/draft-session.ts`, clave `ahorrabien:borrador`) y se restauran dentro de `merge`, junto al resto del estado: así una recarga no lo pierde y no se sobrescribe `localStorage` antes de leerlo.
- La hidratación es manual (`skipHydration`): la dispara `StoreHydrator` en el cliente. Los datos guardados se validan con `persistedStateSchema`; si son inválidos se ignoran. El almacenamiento pasa por `createSafeStorage` (`src/store/safe-storage.ts`): JSON dañado → se descarta y `storageStatus` vale `'reset'` (aviso); sin `localStorage` → memoria y `'unavailable'` (franja `StorageNotice`).
- Lee con selectores finos: `useAppStore((s) => s.saved)`, no `useAppStore()` entero.
- Nunca uses `localStorage` directamente: pasa por el store.
- `flash(mensaje, tono?)` muestra un toast global (`'success'` por defecto, `'info'` para avisos).
- Errores de renderizado: `src/app/error.tsx` (dentro del layout) y `src/app/global-error.tsx` (si falla el layout raíz). En Next 16 reciben `retry`, no `reset`.

## Convenciones

- **Archivos** en kebab-case (`result-view.tsx`); **componentes** en PascalCase con export nombrado. Las `page.tsx`/`layout.tsx` usan `export default` (lo exige Next).
- Imports con alias `@/` (→ `src/`). Dentro de una misma feature se permiten imports relativos.
- **Tipos**: se derivan de Zod en `src/types/index.ts`. Si cambias los datos, cambia primero el esquema.
- **Client vs server**: agrega `'use client'` solo en componentes con estado, hooks o eventos. Las páginas se mantienen como server components (exportan `metadata`).
- **Textos de UI en español** (es-PE). Montos siempre con `money()`.
- **Navegación**: usa `ButtonLink`/`Link` para ir a otra ruta; `router.push` solo cuando antes hay que ejecutar una acción del store (p. ej. `startNew()` y luego `/comparar`).
- **Modales**: `ConfirmDialog` con un `preset`; se monta con portal en `<body>` (dentro de `<Screen>` quedaría bajo la barra inferior por el contexto de apilamiento de la animación).
- **Tests** junto al archivo que prueban (`*.test.ts`). Toda lógica pura (cálculo, esquemas, store) debe tener test.

## Estilos (Tailwind v4)

- No hay `tailwind.config`; los tokens están en `@theme` dentro de `src/app/globals.css`:
  colores `cream`, `forest`, `ink`, `accent` (naranja), `sage`, `paper`, `muted`, `line`, `danger`, `danger-soft`; radios `rounded-ctl` / `rounded-card` / `rounded-sheet`; fuentes `font-sans` (DM Sans) / `font-serif` (Newsreader); animaciones `animate-enter|winner|fade|sheet|toast`.
- Variante propia `short:` para pantallas de ≤720px de alto.
- Usa los tokens en vez de colores hex sueltos. Combina clases con `cn()` (`src/lib/cn.ts`) para que las de `className` ganen.
- Estilos globales de elementos van en `@layer base` (así las utilidades pueden sobrescribirlos). `h1` ya tiene tamaño/tracking base y `h1 em` usa la serif en verde.
- Cada pantalla se envuelve en `<Screen>` (márgenes, ancho máximo, espacio para la barra inferior, animación de entrada). Su prop `size` fija el ancho del contenido (`SCREEN_WIDTHS`): `narrow` (600px, por defecto: formularios, listas, lectura) o `wide` (1040px: inicio, resultado, bienvenida).
- **Responsive**: se diseña primero para móvil y se amplía con `md:` (≥768px, tablet: márgenes de 40px, diálogos centrados, rejillas de 2 columnas) y `lg:`/`xl:` (≥1024px: barra superior; ≥1280px: resultado en dos columnas). Usa `max-w-*` y `min-h-*` en vez de anchos o altos fijos, y comprueba 320px, 768px, 1024px y 1440px.

## Recetas

**Agregar una pantalla**

1. Crea el componente en `src/features/<feature>/components/<nombre>-screen.tsx` usando `Screen` (elige su `size`) + `ScreenHeader`.
2. Crea `src/app/(app)/<ruta>/page.tsx` (o `(onboarding)` si no lleva barra inferior ni es parte de la app principal) con `metadata` y el componente.
3. Si debe aparecer en la navegación principal, agrega la ruta a `ITEMS` en `src/components/layout/bottom-nav.tsx`.
4. Agrega la fila a la tabla “Rutas → archivos” de este documento.

**Agregar un campo a una alternativa** (p. ej. “seguro”)

1. `altShape` en `src/schemas/comparison.schema.ts` (y su mensaje en `MESSAGES` si aplica).
2. `blankAlt` en `src/features/comparison/lib/factories.ts`.
3. La fórmula en `calculateCost` si afecta el costo.
4. `FIELDS` en `alt-details-form.tsx` y una fila en `breakdown.tsx`.
5. Tests en `calculate-cost.test.ts` y `comparison.schema.test.ts`.
6. Si cambia la forma persistida de forma incompatible, sube la clave `STORAGE_KEY` o agrega `version`/`migrate` en el `persist` del store.

**Agregar una lección**

1. Agrega un objeto a `LESSONS` en `src/features/learn/lessons.ts` (slug en kebab-case, `number` correlativo).
2. Asígnale un `topic` (`discount`, `transport`, `extras` o `payment`): conecta la lección con las dificultades del onboarding y con las alertas del resultado.
3. El ejemplo usa `Alt` reales: declara `winner` y escribe la conclusión con `{diff}` (se reemplaza por la diferencia calculada; no escribas el monto a mano).
4. `pnpm test`: `lessons.test.ts` falla si el ganador declarado no coincide con el cálculo.
5. La ruta `/aprender/<slug>`, la tarjeta del inicio y el índice se generan solos. Si aplica, ajusta `suggestLesson`.

**Agregar un diálogo de confirmación**: añade una entrada a `CONFIRM_PRESETS` y usa `<ConfirmDialog preset="…" open onCancel onConfirm />` con estado local `open`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
