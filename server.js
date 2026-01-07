const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // 静的ファイルの配信

// パスワードをハッシュ化
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// JWTシークレットキー
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// パスワード（環境変数から取得）
const CORRECT_PASSWORD = process.env.APP_PASSWORD || 'ai-teme-music26';
const PASSWORD_HASH = hashPassword(CORRECT_PASSWORD);

// ログイン試行を追跡（メモリ内）
const loginAttempts = new Map();
const LOCKOUT_TIME = 5 * 60 * 1000; // 5分
const MAX_ATTEMPTS = 5;

// ログインエンドポイント
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const clientIP = req.ip;

    // ログイン試行の確認
    const attemptData = loginAttempts.get(clientIP);
    if (attemptData) {
        const { count, lockoutUntil } = attemptData;

        // ロックアウト中か確認
        if (lockoutUntil && Date.now() < lockoutUntil) {
            const remainingMinutes = Math.ceil((lockoutUntil - Date.now()) / 60000);
            return res.status(429).json({
                success: false,
                message: `アカウントがロックされています。${remainingMinutes}分後に再試行してください。`,
                locked: true
            });
        }

        // ロックアウト期間が終了していれば試行回数をリセット
        if (lockoutUntil && Date.now() >= lockoutUntil) {
            loginAttempts.delete(clientIP);
        }
    }

    // パスワード検証
    const inputHash = hashPassword(password);

    if (inputHash === PASSWORD_HASH) {
        // ログイン成功
        loginAttempts.delete(clientIP);

        // JWTトークン生成
        const token = jwt.sign(
            { authenticated: true, timestamp: Date.now() },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            success: true,
            token: token,
            message: 'ログイン成功'
        });
    } else {
        // ログイン失敗
        const currentAttempts = attemptData ? attemptData.count + 1 : 1;

        if (currentAttempts >= MAX_ATTEMPTS) {
            // ロックアウト
            const lockoutUntil = Date.now() + LOCKOUT_TIME;
            loginAttempts.set(clientIP, { count: currentAttempts, lockoutUntil });

            return res.status(429).json({
                success: false,
                message: 'ログイン試行回数が上限に達しました。5分後に再試行してください。',
                locked: true
            });
        } else {
            loginAttempts.set(clientIP, { count: currentAttempts, lockoutUntil: null });

            return res.status(401).json({
                success: false,
                message: `パスワードが正しくありません（残り試行回数: ${MAX_ATTEMPTS - currentAttempts}回）`,
                remainingAttempts: MAX_ATTEMPTS - currentAttempts
            });
        }
    }
});

// トークン検証エンドポイント
app.post('/api/verify', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ valid: false, message: 'トークンがありません' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ valid: true, decoded });
    } catch (error) {
        return res.status(401).json({ valid: false, message: 'トークンが無効です' });
    }
});

// ヘルスチェック
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Music AI Kit API is running' });
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`🚀 Music AI Kit server is running on http://localhost:${PORT}`);
    console.log(`📝 Password: ${CORRECT_PASSWORD}`);
});
