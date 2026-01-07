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

## デプロイオプション

このプロジェクトは以下の環境にデプロイできます：

### 1. **Vercel（推奨）** ⭐
- サーバーレス関数として自動デプロイ
- 環境変数の簡単設定
- 無料プランで利用可能
- HTTPSが自動で有効

### 2. **ローカル/VPS**
- Node.js + Express サーバーとして実行
- 完全なコントロールが可能

## ファイル構成

```
├── api/                # Vercel サーバーレス関数
│   ├── login.js        # ログインAPI
│   ├── verify.js       # トークン検証API
│   └── health.js       # ヘルスチェックAPI
├── server.js           # Node.js/Expressサーバー（ローカル実行用）
├── package.json        # Node.js依存関係
├── vercel.json         # Vercel設定ファイル
├── .env                # 環境変数（パスワード設定）
├── .env.example        # 環境変数の例
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

## オプション A: Vercelにデプロイ（推奨）

### 1. Vercelアカウントの準備

[Vercel](https://vercel.com) にアカウントを作成します（無料）。

### 2. Vercel CLIのインストール（オプション）

```bash
npm install -g vercel
```

### 3. GitHubリポジトリと連携

1. このプロジェクトをGitHubにプッシュ
2. Vercelダッシュボードで「New Project」
3. GitHubリポジトリを選択してインポート

### 4. 環境変数の設定 ⚠️ 重要

Vercelダッシュボードで以下の環境変数を**必ず**設定してください：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `APP_PASSWORD` | `ai-teme-music26` | ログインパスワード |
| `JWT_SECRET` | `your-random-secret-key` | JWT署名用シークレット（ランダムな長い文字列） |

**詳細な設定手順:**

1. **Vercelプロジェクトページを開く**
   - デプロイ後、プロジェクトのダッシュボードに移動

2. **Settings タブをクリック**

3. **左サイドバーから「Environment Variables」を選択**

4. **環境変数を追加**

   **APP_PASSWORD の追加:**
   - Name: `APP_PASSWORD`
   - Value: `ai-teme-music26`
   - Environment: `Production`, `Preview`, `Development` すべてにチェック
   - 「Save」をクリック

   **JWT_SECRET の追加:**
   - Name: `JWT_SECRET`
   - Value: 強力なランダム文字列（例: `openssl rand -base64 32` で生成）
   - Environment: `Production`, `Preview`, `Development` すべてにチェック
   - 「Save」をクリック

5. **環境変数を追加したら必ず再デプロイ**
   - 「Deployments」タブに戻る
   - 最新のデプロイの右側の「...」メニューをクリック
   - 「Redeploy」を選択

**⚠️ 注意事項:**
- 環境変数を追加・変更した後は**必ず再デプロイ**が必要です
- JWT_SECRETは本番環境では必ず強力なランダム文字列を使用してください
- これらの環境変数がないとログインできません

### 5. デプロイ

Vercelが自動的にデプロイします。数分後にURLが発行されます。

例: `https://music-ai-kit.vercel.app`

### 6. カスタムドメインの設定（オプション）

Vercelダッシュボードの「Domains」から独自ドメインを設定できます。

---

## オプション B: ローカル/VPSで実行

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

---

## 使用方法

### Vercelの場合

1. デプロイされたURLにアクセス（例: `https://your-project.vercel.app/login.html`）
2. パスワード `ai-teme-music26` を入力してログイン
3. メインページにリダイレクトされる
4. ログアウトする場合は、ヘッダーの「ログアウト」ボタンをクリック

### ローカルの場合

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

### Vercelへのデプロイ（推奨）

✅ **Vercelの利点:**
- HTTPSが自動で有効化
- 環境変数の安全な管理
- グローバルCDN
- 自動スケーリング
- 無料プラン利用可能

**必須の設定:**

1. **環境変数の設定**
   - Vercelダッシュボードで`APP_PASSWORD`と`JWT_SECRET`を設定
   - `.env`ファイルはGitにコミットしない（`.gitignore`で除外済み）

2. **JWT_SECRETの変更**
   - 本番環境では必ず強力なランダム文字列を使用
   - 例: `openssl rand -base64 32` で生成

3. **カスタムドメインの設定（オプション）**
   - Vercelダッシュボードで独自ドメインを追加
   - SSL証明書は自動で発行される

### VPS/専用サーバーへのデプロイ

**必須の設定変更:**

1. **JWT_SECRETの変更**
   ```env
   JWT_SECRET=your-very-long-random-secret-key-here
   ```

2. **HTTPSの使用**
   - SSL/TLS証明書の設定（Let's Encrypt推奨）
   - すべての通信を暗号化

3. **環境変数の安全な管理**
   - `.env`ファイルは絶対にGitにコミットしない
   - サーバー上で適切な権限設定（chmod 600 .env）

4. **プロセスマネージャーの使用**
   - PM2やForeverを使用してサーバーを常時稼働
   - 自動再起動の設定

5. **リバースプロキシの設定**
   - NginxやApacheでリバースプロキシを設定
   - 静的ファイルの効率的な配信

### 将来の改善案

1. **データベースの追加**
   - ユーザー情報の永続化
   - ログイン履歴の記録

2. **レート制限の強化**
   - express-rate-limitなどのミドルウェアを追加
   - DDoS攻撃対策

3. **ロギングとモニタリング**
   - アクセスログの記録
   - エラー監視システムの導入

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

### Vercelでログインできない場合

1. **環境変数の確認（最重要）**
   - Vercelダッシュボードで`APP_PASSWORD`と`JWT_SECRET`が設定されているか確認
   - Settings → Environment Variables で両方の変数が存在するか確認
   - **環境変数を追加・変更した後は必ず再デプロイが必要**
   - Deployments → 最新のデプロイ → ... → Redeploy

2. **ブラウザのコンソールでエラーを確認**
   - F12キーで開発者ツールを開く
   - Console タブでエラーメッセージを確認

3. **APIエンドポイントの確認**
   - `https://your-project.vercel.app/api/health` にアクセスして動作確認

4. **ロックアウトの場合**
   - 5回失敗すると5分間ロックアウトされます
   - 5分待つか、別のネットワーク（モバイル回線など）から試す

5. **Vercelのログを確認**
   - Vercelダッシュボードの「Deployments」→最新のデプロイ→「Functions」タブ
   - サーバーサイドのエラーログを確認

### ローカル環境でログインできない場合

1. **サーバーが起動しているか確認**
   ```bash
   npm start
   ```

2. **`.env`ファイルが存在するか確認**
   - `.env.example`をコピーして`.env`を作成
   - パスワードとJWT_SECRETを設定

3. **ブラウザのコンソールでエラーを確認**

4. **ロックアウトされている場合は5分待つ**

### ローカル環境でサーバーが起動しない場合

1. **依存関係を再インストール**
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **ポートが既に使用されている場合**
   - `.env`でポート番号を変更
   - または他のプロセスを終了

3. **Node.jsのバージョン確認**
   ```bash
   node --version
   ```
   - Node.js 14以上が必要

### Vercelデプロイが失敗する場合

1. **環境変数エラー: "references Secret which does not exist"**
   - **原因**: vercel.jsonで`@secret_name`形式で環境変数を参照している
   - **解決策**:
     - vercel.jsonから`env`セクションを削除（最新版では削除済み）
     - Vercelダッシュボードから環境変数を直接設定
     - 最新のコードをプルして再デプロイ

2. **ビルドログを確認**
   - Vercelダッシュボードでデプロイのログを確認
   - エラーメッセージから原因を特定

3. **package.jsonの確認**
   - 必要な依存関係がすべて記載されているか確認
   - `express`, `cors`, `jsonwebtoken`, `dotenv` が含まれているか

4. **vercel.jsonの確認**
   - 構文エラーがないか確認
   - JSONとして正しい形式か検証

5. **再デプロイ**
   - Vercelダッシュボードから「Redeploy」を実行
   - または、Gitにプッシュして自動デプロイをトリガー

## ライセンス

© 2022 Music. AI rights reserved.
