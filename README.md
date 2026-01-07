# Music AI Kit Website

音楽アーティスト制作キッド「AIチーム(GPTs版) & AI搭載アプリ」の公式ウェブサイトです。

## 機能

- レスポンシブデザイン
- **セキュアなサーバーサイド認証システム**
- AIチーム（GPTs）紹介セクション
- AI搭載アプリ（Nano Banana）セクション（タブ機能付き）
- アニメーション波形ビジュアル

## ログイン情報

**パスワード:** `ai-teme-music26`

## セキュリティ機能

### サーバーサイド認証
- **Node.js + Express バックエンドAPI**
- パスワードのハッシュ化（SHA-256）はサーバー側で実行
- 環境変数（.env）でパスワードを安全に管理
- JWT（JSON Web Token）によるトークンベース認証
- ブルートフォース攻撃対策（5回の試行失敗で5分間ロックアウト）
- クライアント側にはトークンのみを保存

### クライアントサイド
- sessionStorageによる安全なトークン保持
- セッション管理（1時間の自動タイムアウト）
- API経由での認証処理

## ファイル構成

```
├── server.js           # Node.js/Expressサーバー（認証API）
├── package.json        # Node.js依存関係
├── .env                # 環境変数（パスワード設定）
├── .gitignore          # Git除外ファイル
├── index.html          # メインページ
├── login.html          # ログインページ
├── style.css           # メインスタイルシート
├── login-style.css     # ログインページスタイルシート
├── script.js           # メインJavaScript（タブ機能など）
├── auth.js             # 認証システム（クライアント側）
└── README.md           # このファイル
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルで以下を設定できます：

```env
PORT=3000
APP_PASSWORD=ai-teme-music26
JWT_SECRET=your-secret-key-here
```

### 3. サーバーの起動

```bash
npm start
```

または開発モードで：

```bash
npm run dev
```

### 4. ブラウザでアクセス

```
http://localhost:3000/login.html
```

## 使用方法

1. サーバーを起動する（`npm start`）
2. ブラウザで `http://localhost:3000/login.html` を開く
3. パスワード `ai-teme-music26` を入力してログイン
4. メインページにリダイレクトされる
5. ログアウトする場合は、ヘッダーの「ログアウト」ボタンをクリック

## API エンドポイント

### POST /api/login
ログイン認証を行います。

**リクエスト:**
```json
{
  "password": "ai-teme-music26"
}
```

**レスポンス（成功）:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "message": "ログイン成功"
}
```

**レスポンス（失敗）:**
```json
{
  "success": false,
  "message": "パスワードが正しくありません（残り試行回数: 4回）",
  "remainingAttempts": 4
}
```

### POST /api/verify
JWTトークンの検証を行います。

**リクエスト:**
```json
{
  "token": "jwt-token-here"
}
```

**レスポンス:**
```json
{
  "valid": true,
  "decoded": { ... }
}
```

### GET /api/health
サーバーのヘルスチェック。

**レスポンス:**
```json
{
  "status": "ok",
  "message": "Music AI Kit API is running"
}
```

## セキュリティの詳細

### なぜサーバーサイド認証が必要か

**以前の問題点:**
- クライアント側のJavaScriptファイルにパスワードハッシュが含まれていた
- ブラウザの開発者ツールでコードを閲覧できる
- 誰でもハッシュ値を取得して不正ログインが可能

**現在の対策:**
1. **パスワードはサーバー側のみに存在**
   - `.env`ファイルに保存（Gitにはコミットされない）
   - クライアント側からは完全に隠蔽

2. **サーバー側で認証処理**
   - パスワードのハッシュ化と検証はサーバーで実行
   - クライアントは生のパスワードのみを送信

3. **JWTトークンによる認証**
   - ログイン成功時にトークンを発行
   - 以降のリクエストはトークンで認証
   - トークンは署名付きで改ざん不可能

4. **ブルートフォース攻撃対策**
   - IPアドレスベースで試行回数を追跡
   - 5回失敗で5分間ロックアウト

## 本番環境への展開

### 必須の設定変更

1. **JWT_SECRETの変更**
   ```env
   JWT_SECRET=your-very-long-random-secret-key-here
   ```

2. **HTTPSの使用**
   - SSL/TLS証明書の設定
   - すべての通信を暗号化

3. **環境変数の安全な管理**
   - `.env`ファイルは絶対にGitにコミットしない
   - デプロイ先のサーバーで環境変数を設定

4. **データベースの追加（推奨）**
   - ユーザー情報の永続化
   - ログイン履歴の記録

5. **レート制限の強化**
   - express-rate-limitなどのミドルウェアを追加
   - DDoS攻撃対策

## 技術スタック

### バックエンド
- Node.js
- Express.js
- jsonwebtoken（JWT認証）
- dotenv（環境変数管理）
- crypto（パスワードハッシュ化）

### フロントエンド
- HTML5
- CSS3（グラデーション、アニメーション）
- JavaScript（ES6+）
- Fetch API（サーバー通信）

## ブラウザ対応

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）

## トラブルシューティング

### ログインできない場合

1. サーバーが起動しているか確認
   ```bash
   npm start
   ```

2. `.env`ファイルが存在するか確認

3. ブラウザのコンソールでエラーを確認

4. ロックアウトされている場合は5分待つ

### サーバーが起動しない場合

1. 依存関係を再インストール
   ```bash
   rm -rf node_modules
   npm install
   ```

2. ポートが既に使用されている場合は`.env`でポート番号を変更

## ライセンス

© 2022 Music. AI rights reserved.
