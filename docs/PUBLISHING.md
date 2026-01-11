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
npm search ai-cowork
# 已確認 ai-cowork 可用
```

## 發布流程

### 1. Build CLI

```bash
cd /path/to/ai-cowork
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
npm pack /path/to/ai-cowork
npm install ai-cowork-0.1.0.tgz

# 測試 CLI
npx ai-cowork --help
npx ai-cowork init

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
npx ai-cowork init
```

## 版本更新

### 更新版本號

```bash
# Patch (0.1.0 -> 0.1.1) - Bug fixes
npm version patch

# Minor (0.1.0 -> 0.2.0) - New features
npm version minor

# Major (0.1.0 -> 1.0.0) - Breaking changes / Stable release
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
  "name": "@ademkao/ai-cowork"
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
npm install -g ai-cowork

# 或使用 npx（推薦）
npx ai-cowork init

# 初始化特定技術棧
npx ai-cowork init --stack react-typescript

# 跳過提示
npx ai-cowork init --yes
```
