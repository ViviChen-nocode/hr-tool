# 組織圖工具 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 建立一個純前端的組織圖工具，支援表格/樹狀輸入、即時預覽、圖上編輯、匯出 PNG。

**Architecture:** React SPA，使用 React Flow 渲染組織圖節點，dagre 計算佈局。資料用 Zustand 管理狀態，localStorage 持久化。首次輸入為全版面，產生後切換為左右分割編輯模式。

**Tech Stack:** React 18, Vite, TypeScript, React Flow, dagre, Zustand, html-to-image, Tailwind CSS

---

### Task 1: 專案初始化與基礎設定

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

**Step 1: 用 Vite 建立 React + TypeScript 專案**

Run: `npm create vite@latest . -- --template react-ts`

**Step 2: 安裝依賴**

Run: `npm install @xyflow/react dagre @types/dagre zustand html-to-image tailwindcss @tailwindcss/vite`

**Step 3: 設定 Tailwind**

在 `vite.config.ts` 加入 Tailwind plugin，在 `src/index.css` 加入 `@import "tailwindcss";`。

**Step 4: 驗證開發伺服器啟動**

Run: `npm run dev`
Expected: Vite dev server 啟動，瀏覽器可看到預設頁面

**Step 5: Commit**

```bash
git init && git add -A && git commit -m "chore: init React + Vite + Tailwind project"
```

---

### Task 2: 資料模型與狀態管理

**Files:**
- Create: `src/types.ts`
- Create: `src/store/useOrgStore.ts`
- Create: `src/store/useAppStore.ts`

**Step 1: 定義資料類型**

```typescript
// src/types.ts
export interface OrgMember {
  id: string
  name: string
  title: string
  parentId: string | null
  department: string
  customFields: Record<string, string>
}

export interface FieldConfig {
  key: string
  label: string
  visible: boolean // 是否在卡片上顯示
}

export interface OrgChart {
  id: string
  name: string
  members: OrgMember[]
  fieldConfigs: FieldConfig[]
  createdAt: number
  updatedAt: number
}

export type AppView = 'input' | 'editor'
export type InputMode = 'table' | 'tree'
export type LayoutDirection = 'TB' | 'LR'
```

**Step 2: 建立 Org Store（Zustand + localStorage）**

```typescript
// src/store/useOrgStore.ts
// 管理組織圖資料：CRUD members, 多份組織圖管理
// persist middleware 自動存 localStorage
```

包含 actions：
- `addMember(member)` / `updateMember(id, data)` / `removeMember(id)`
- `moveMember(id, newParentId)` — 拖曳改階層
- `addChart()` / `switchChart(id)` / `deleteChart(id)`
- `addField(config)` / `removeField(key)`

**Step 3: 建立 App Store**

```typescript
// src/store/useAppStore.ts
// 管理 UI 狀態：view, inputMode, layoutDirection, spacing
```

**Step 4: Commit**

```bash
git add src/types.ts src/store/
git commit -m "feat: add data model and Zustand stores"
```

---

### Task 3: 首次輸入頁面 — 表格模式

**Files:**
- Create: `src/components/InputView.tsx`
- Create: `src/components/TableInput.tsx`
- Modify: `src/App.tsx`

**Step 1: 建立 InputView 外框**

全版面置中的輸入介面，包含：
- 標題「建立組織圖」
- 兩個 tab：「表格模式」「樹狀模式」
- 底部「產生組織圖」按鈕

**Step 2: 建立 TableInput 元件**

可編輯表格，欄位：姓名、職稱、上級（下拉）、部門。
- 「上級」下拉列出已輸入且有名字的人
- 按 Enter 自動新增下一列
- 每列有刪除按鈕
- 最下方有「+ 新增一列」按鈕

**Step 3: 接入 App.tsx**

根據 `appStore.view` 切換顯示 InputView 或 EditorView（先用 placeholder）。

**Step 4: 驗證**

Run: `npm run dev`
Expected: 可在表格中輸入資料，上級下拉正確顯示已輸入的人

**Step 5: Commit**

```bash
git add src/components/InputView.tsx src/components/TableInput.tsx src/App.tsx
git commit -m "feat: add table input mode for first-time entry"
```

---

### Task 4: 首次輸入頁面 — 樹狀模式

**Files:**
- Create: `src/components/TreeInput.tsx`
- Modify: `src/components/InputView.tsx`

**Step 1: 建立 TreeInput 元件**

樹狀結構顯示，每個節點：
- 顯示「名字（職稱）」
- 展開/收合箭頭
- 操作按鈕：「+子級」「編輯」「刪除」
- 支援拖曳排序調整階層

根節點有「+ 新增根節點」按鈕。

**Step 2: 接入 InputView tab 切換**

兩個 tab 切換時資料即時同步（共用 store）。

**Step 3: 驗證**

Run: `npm run dev`
Expected: 可在樹狀模式新增節點、展開收合、切換 tab 資料一致

**Step 4: Commit**

```bash
git add src/components/TreeInput.tsx src/components/InputView.tsx
git commit -m "feat: add tree input mode with drag-and-drop"
```

---

### Task 5: 組織圖畫布 — React Flow 基礎渲染

**Files:**
- Create: `src/components/EditorView.tsx`
- Create: `src/components/OrgChartCanvas.tsx`
- Create: `src/components/OrgNode.tsx`
- Create: `src/utils/layoutEngine.ts`
- Modify: `src/App.tsx`

**Step 1: 建立 dagre 佈局引擎**

```typescript
// src/utils/layoutEngine.ts
// 接收 OrgMember[] + direction + spacing
// 輸出 React Flow 的 Node[] 和 Edge[]
// 使用 dagre 計算座標
```

**Step 2: 建立自訂 OrgNode 元件**

React Flow 自訂節點，顯示卡片：
- 根據 fieldConfigs 顯示對應欄位
- 卡片樣式：圓角、陰影、hover 效果

**Step 3: 建立 OrgChartCanvas**

React Flow 畫布，接收 store 資料，透過 layoutEngine 計算佈局後渲染。

**Step 4: 建立 EditorView（左右分割）**

左側面板（表格/樹狀 tab）+ 右側畫布，中間可拖曳調整寬度。

**Step 5: 接入 App.tsx**

點「產生組織圖」→ 切換 view 到 editor。

**Step 6: 驗證**

Run: `npm run dev`
Expected: 輸入資料後產生組織圖，右側正確渲染樹狀結構

**Step 7: Commit**

```bash
git add src/components/ src/utils/
git commit -m "feat: add React Flow org chart canvas with dagre layout"
```

---

### Task 6: 圖上直接編輯

**Files:**
- Modify: `src/components/OrgNode.tsx`
- Modify: `src/components/OrgChartCanvas.tsx`

**Step 1: 卡片 inline 編輯**

雙擊卡片進入編輯模式：
- 文字變成 input
- 按 Enter 或點外面儲存
- 按 Esc 取消
- 更新 store → 左側同步

**Step 2: 拖曳改變階層**

拖曳節點到另一個節點上方時：
- 顯示 drop target 高亮
- 放下後更新 parentId
- 重新計算佈局
- 左側同步更新

**Step 3: 驗證**

Run: `npm run dev`
Expected: 可雙擊編輯文字、拖曳改變上下級

**Step 4: Commit**

```bash
git add src/components/OrgNode.tsx src/components/OrgChartCanvas.tsx
git commit -m "feat: add inline editing and drag-to-reparent on canvas"
```

---

### Task 7: 佈局控制工具列

**Files:**
- Create: `src/components/Toolbar.tsx`
- Modify: `src/components/EditorView.tsx`

**Step 1: 建立 Toolbar**

包含：
- 方向切換按鈕（上→下 / 左→右）
- 間距滑桿（水平 + 垂直，範圍 50-200，預設 100）
- 縮放按鈕（+/-）+ fit to view
- 匯出 PNG 按鈕（先空 handler）

**Step 2: 接入 store 和畫布**

方向和間距變更 → 重新計算 dagre 佈局 → 畫布更新。

**Step 3: 驗證**

Run: `npm run dev`
Expected: 切換方向組織圖重排，拉滑桿間距即時調整

**Step 4: Commit**

```bash
git add src/components/Toolbar.tsx src/components/EditorView.tsx
git commit -m "feat: add layout controls toolbar"
```

---

### Task 8: 匯出 PNG

**Files:**
- Create: `src/utils/exportPng.ts`
- Modify: `src/components/Toolbar.tsx`

**Step 1: 實作匯出函數**

```typescript
// src/utils/exportPng.ts
// 使用 html-to-image 的 toPng()
// 抓取 React Flow viewport 完整範圍
// 觸發瀏覽器下載
```

**Step 2: 接入 Toolbar 匯出按鈕**

**Step 3: 驗證**

Run: `npm run dev`
Expected: 點匯出 → 下載 PNG 檔案，圖片包含完整組織圖

**Step 4: Commit**

```bash
git add src/utils/exportPng.ts src/components/Toolbar.tsx
git commit -m "feat: add PNG export"
```

---

### Task 9: 自訂欄位設定

**Files:**
- Create: `src/components/FieldSettings.tsx`
- Modify: `src/components/Toolbar.tsx`
- Modify: `src/components/OrgNode.tsx`
- Modify: `src/components/TableInput.tsx`

**Step 1: 建立 FieldSettings 彈窗**

從 Toolbar 的「欄位設定」按鈕開啟 modal：
- 列出所有欄位（姓名、職稱、部門 + 自訂）
- 每個欄位可切換「顯示在卡片上」
- 可新增自訂欄位（輸入欄位名稱）
- 可刪除自訂欄位

**Step 2: OrgNode 和 TableInput 根據 fieldConfigs 動態渲染**

**Step 3: 驗證**

Run: `npm run dev`
Expected: 新增自訂欄位後，表格多一欄，卡片也顯示

**Step 4: Commit**

```bash
git add src/components/FieldSettings.tsx src/components/Toolbar.tsx src/components/OrgNode.tsx src/components/TableInput.tsx
git commit -m "feat: add custom field configuration"
```

---

### Task 10: 多份組織圖管理

**Files:**
- Create: `src/components/ChartSelector.tsx`
- Modify: `src/App.tsx`

**Step 1: 建立 ChartSelector**

頂部或側邊的組織圖選擇器：
- 下拉選單列出所有已儲存的組織圖
- 「+ 新增」按鈕
- 「刪除」按鈕（確認後刪除）
- 切換時載入對應資料

**Step 2: 接入 App.tsx**

**Step 3: 驗證**

Run: `npm run dev`
Expected: 可建立多份組織圖並切換，資料獨立

**Step 4: Commit**

```bash
git add src/components/ChartSelector.tsx src/App.tsx
git commit -m "feat: add multi-chart management"
```

---

### Task 11: UI 打磨與部署

**Files:**
- Modify: 各元件樣式
- Modify: `index.html`（title, favicon）

**Step 1: 整體 UI 美化**

- 統一色系、字體
- 響應式：小螢幕時左側面板可收合
- 空狀態提示
- Loading 狀態

**Step 2: 設定 meta 和 title**

`index.html` 加入正確的 title 和 favicon。

**Step 3: 驗證 build**

Run: `npm run build && npm run preview`
Expected: build 成功，preview 功能正常

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: polish UI and prepare for deployment"
```
