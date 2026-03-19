# Easy 繪製組織圖

純前端的組織圖工具，讓 HR 或任何人都能快速建立、編輯、匯出公司組織架構圖。資料存在瀏覽器，不需要後端。

**線上使用：** https://org-chart.vivichen.ai

## 功能特色

- 表格模式 / 樹狀模式兩種輸入方式
- 支援 CSV 匯入（提供範本下載）
- 自動產生組織架構圖，支援拖曳調整階層
- 即時編輯節點內容（點擊卡片直接改）
- 多張組織圖管理，可切換 / 新增 / 刪除
- 自訂欄位（除了姓名、職稱、部門，可新增任意欄位）
- 佈局方向切換（上下 / 左右）、間距調整、縮放
- 5 種主題色 + 自訂色彩
- 匯出為 PNG 圖片
- 卡片寬度、文字對齊方式可調

## 技術棧

| 套件 | 負責什麼 |
|------|----------|
| React 19 | 畫面框架，負責所有 UI 的渲染 |
| Vite 8 | 開發伺服器和打包工具，讓開發時改完程式馬上看到結果 |
| TypeScript | 型別檢查，幫助減少程式錯誤 |
| Tailwind CSS v4 | 樣式系統，用 class 名稱快速設定外觀 |
| @xyflow/react | 組織圖繪製引擎，處理節點、連線、拖曳互動 |
| dagre | 自動排版演算法，計算每個節點該放在哪裡 |
| Zustand | 資料狀態管理，負責儲存所有成員資料並同步到 localStorage |
| html-to-image | 把畫面上的組織圖轉成 PNG 圖片檔 |

## 開發指令

```bash
npm run dev        # 啟動開發伺服器（http://localhost:5173）
npm run build      # 建置正式版到 dist/
npm run preview    # 預覽建置結果
```

首次安裝依賴：
```bash
npm install --legacy-peer-deps
```
> `--legacy-peer-deps` 是因為部分套件版本相依性需要這個參數

## 部署

託管在 Cloudflare Pages，部署指令：

```bash
npm run build
npx wrangler pages deploy dist --project-name=hr-tool
```

自訂網域 `org-chart.vivichen.ai` 透過 Cloudflare DNS CNAME 指向 `hr-tool-69m.pages.dev`。

## 專案結構

```
src/
├── types.ts                 # 資料型別定義（成員、組織圖、欄位設定）
├── App.tsx                  # 根元件，切換輸入頁 / 編輯器頁
├── store/
│   ├── useOrgStore.ts       # 組織圖資料（成員、欄位、多圖管理）
│   ├── useAppStore.ts       # UI 狀態（目前頁面、輸入模式、佈局方向）
│   └── useStyleStore.ts     # 樣式設定（主題色、對齊、卡片寬度）
├── components/
│   ├── InputView.tsx        # 起始頁（輸入資料 + CSV 匯入）
│   ├── TableInput.tsx       # 表格輸入模式
│   ├── TreeInput.tsx        # 樹狀輸入模式
│   ├── EditorView.tsx       # 編輯器頁（左側面板 + 右側畫布）
│   ├── OrgChartCanvas.tsx   # React Flow 組織圖畫布
│   ├── OrgNode.tsx          # 單一節點卡片元件
│   ├── ChartSelector.tsx    # 頂部多組織圖切換列
│   ├── Toolbar.tsx          # 工具列（佈局、縮放、匯出）
│   ├── FieldSettings.tsx    # 欄位設定 modal
│   ├── StyleSettings.tsx    # 樣式設定 modal
│   ├── Footer.tsx           # 頁尾
│   ├── FloatingMascot.tsx   # 右下角浮動人物
│   └── MobileHint.tsx       # 手機提示 banner
└── utils/
    ├── layoutEngine.ts      # dagre 佈局計算
    ├── exportPng.ts         # PNG 匯出
    └── csvImport.ts         # CSV 解析與匯入
```

## 資料儲存

- 所有資料儲存在瀏覽器的 localStorage，不會上傳至任何伺服器
- 清除瀏覽資料會導致資料遺失
- 換瀏覽器或裝置無法存取原本的資料
- 重要資料請匯出 PNG 保存
