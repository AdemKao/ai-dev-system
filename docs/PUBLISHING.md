# NPM 發布指南

## 準備工作

### 1. 登入 npm

```bash
npm login
# 或使用 token
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN
```

### 2. 確認 package name 可用

```bash
npm search ai-dev-system
# 如果名稱被佔用，考慮使用 scoped package: @your-username/ai-dev-system
```

## 發布流程

### 1. Build CLI

```bash
cd /path/to/ai-dev-system
npm run build
```

### 2. 檢查發布內容

```bash
# 查看會發布哪些檔案
npm pack --dry-run

# 確認包含:
# - .ai/            (核心內容)
# - cli/dist/       (編譯後的 CLI)
# - cli/bin/        (執行檔)
# - package.json
```

### 3. 測試本地安裝

```bash
# 建立測試目錄
mkdir /tmp/test-install && cd /tmp/test-install

# 本地安裝
npm pack /path/to/ai-dev-system
npm install ai-dev-system-1.0.0.tgz

# 測試 CLI
npx ai-dev --help
npx ai-dev init

# 清理
cd .. && rm -rf /tmp/test-install
```

### 4. 發布到 npm

```bash
# 發布 (第一次)
npm publish

# 如果使用 scoped package
npm publish --access public
```

### 5. 驗證發布

```bash
# 全新目錄測試
mkdir /tmp/verify && cd /tmp/verify
npm init -y
npx ai-dev init
```

## 版本更新

### 更新版本號

```bash
# Patch (1.0.0 -> 1.0.1) - Bug fixes
npm version patch

# Minor (1.0.0 -> 1.1.0) - New features
npm version minor

# Major (1.0.0 -> 2.0.0) - Breaking changes
npm version major
```

### 發布更新

```bash
npm run build
npm publish
```

## 常見問題

### Package name 被佔用

使用 scoped package:

```json
{
  "name": "@ademkao/ai-dev-system"
}
```

```bash
npm publish --access public
```

### 忘記 build

`prepublishOnly` script 會自動執行 build，但建議手動確認。

### 檔案太大

檢查 `.npmignore` 或 `files` 欄位，確保只包含必要檔案。

## 使用者安裝方式

發布後，使用者可以：

```bash
# 全域安裝
npm install -g ai-dev-system

# 或使用 npx（推薦）
npx ai-dev-system init

# 或簡寫
npx ai-dev init
```
