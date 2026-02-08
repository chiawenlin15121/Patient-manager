# Patient Manager System

## 🚀 技術架構 (Tech Stack)

*   **Frontend**: React (Vite), Material UI (MUI), Axios
*   **Backend**: Node.js (Express)
*   **Database**: PostgreSQL (Prisma ORM)
*   **Containerization**: Docker Compose

## ✨ 開發實務與亮點 (Best Practices Implemented)

本專案不僅僅是功能的實作，更著重於架構的安全性、可維護性與使用者體驗。以下是我特別強化的開發細節：

### 🛡️ 安全性 (Security)
*   **CORS 設定**: 嚴格限制跨來源請求，僅允許來自前端開發伺服器的存取，防止 CSRF 攻擊。
*   **HTTP 安全標頭 (Security Headers)**: 使用 `Helmet` 自動設定 HTTP Headers (如 X-Frame-Options, Content-Security-Policy)，防範常見 Web 攻擊。
*   **請求速率限制 (Rate Limiting)**: 實作 `express-rate-limit`，限制單一 IP 請求頻率，保護伺服器免受 DoS 攻擊或暴力破解。
*   **防範 XSS 與 SQL Injection**: 
    *   前端利用 React 的自動跳脫機制。
    *   後端透過 Prisma 的參數化查詢 (Parameterized Queries) 徹底杜絕 SQL 注入風險。

### 🚨 錯誤處理 (Error Handling)
*   **全域錯誤處理 (Global Error Handler Middleware)**: 後端建立統一的 Error Handler 中間件，確保所有異常都能被捕獲並以標準格式回傳。
*   **敏感資訊保護**: 在 Production 環境自動隱藏 Stack Trace，避免伺服器內部資訊外洩。
*   **前端錯誤回饋**: 捨棄原生的 `alert()`，改用 Material UI `Snackbar` 提供更優雅且明確的錯誤提示，並優先顯示後端回傳的具體錯誤原因。

### ✅ 資料驗證 (Validation)
*   **雙重驗證機制**:
    *   **前端驗證**: 在表單送出前即時檢查必填欄位與格式，提供即時 UI 回饋 (Red border / Helper text)，提升 UX 並減少無效請求。
    *   **後端驗證**: 在 API 層級再次驗證資料完整性與唯一性 (如 MRN 重複檢查)，確保資料庫資料的一致性。

### ⚡ 效能與架構優化 (Performance & Architecture)
*   **Custom Hooks 封裝**: 將邏輯抽離為可重用的 Hooks (如 `useSearch`, `useDebounce`, `useUrlPagination`)，保持 UI Component 乾淨。
*   **URL 狀態同步**: 分頁與搜尋狀態直接同步至 URL 參數，讓使用者可以分享特定搜尋結果的連結，並支援瀏覽器上一頁/下一頁功能。
*   **防抖動搜尋 (Debounce)**: 實作 Search Debounce 機制，減少使用者輸入時對後端的無效請求次數。

## 🛠️ 如何執行 (How to Run)

1. **啟動 Docker 環境**
   ```bash
   docker-compose up -d
   ```

2. **初始化資料庫**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **啟動前端**
   ```bash
   cd client
   npm run dev
   ```
