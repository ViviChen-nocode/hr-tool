# CLAUDE.md — HR 組織圖工具

## 專案一句話

純前端的組織圖工具，讓 HR 或任何人都能快速建立、編輯、匯出公司組織架構圖。資料存在瀏覽器 localStorage，不需要後端。

## 技術架構

- 框架：React 18 + Vite
- 語言：TypeScript
- 樣式：Tailwind CSS v4
- 組織圖渲染：@xyflow/react (React Flow v12)
- 佈局引擎：dagre
- 狀態管理：Zustand（含 persist middleware）
- 匯出：html-to-image
- 部署：純靜態，可部署到任何靜態託管

## 開發指令

```bash
npm run dev        # 啟動開發伺服器 (localhost:5173)
npm run build      # 建置到 dist/
npm run preview    # 預覽建置結果
```

## 專案結構重點

```
src/
├── types.ts                    # 資料型別定義
├── store/
│   ├── useOrgStore.ts          # 組織圖資料 store（members, charts, fields）
│   ├── useAppStore.ts          # UI 狀態 store（view, layout, spacing）
│   └── useStyleStore.ts        # 樣式設定 store（theme, alignment, cardWidth）
├── components/
│   ├── App.tsx                 # 根元件，路由 input/editor view
│   ├── ChartSelector.tsx       # 頂部多組織圖切換列
│   ├── InputView.tsx           # 首次輸入全版面（表格/樹狀 tab）
│   ├── TableInput.tsx          # 表格輸入模式
│   ├── TreeInput.tsx           # 樹狀輸入模式
│   ├── EditorView.tsx          # 左右分割編輯器（面板 + 畫布）
│   ├── OrgChartCanvas.tsx      # React Flow 畫布
│   ├── OrgNode.tsx             # 自訂組織圖節點元件
│   ├── Toolbar.tsx             # 工具列（佈局、縮放、匯出、設定）
│   ├── FieldSettings.tsx       # 欄位設定 modal
│   └── StyleSettings.tsx       # 樣式設定 modal
└── utils/
    ├── layoutEngine.ts         # dagre 佈局計算
    └── exportPng.ts            # PNG 匯出工具
```

## 重要注意事項

- Zustand selector 要訂閱實際資料，不要訂閱函式參考：`useOrgStore((s) => s.getCurrentChart())` ✅
- Vite 8 與 @tailwindcss/vite 有 peer dep 衝突，安裝時需 `--legacy-peer-deps`
- 動態主題色用 inline style（Tailwind 無法處理動態值）
