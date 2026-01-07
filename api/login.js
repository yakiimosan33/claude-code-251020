const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// パスワードをハッシュ化
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// ログイン試行を追跡（メモリ内 - Vercelの制限に注意）
const loginAttempts = new Map();
const LOCKOUT_TIME = 5 * 60 * 1000; // 5分
const MAX_ATTEMPTS = 5;

module.exports = async (req, res) => {
    // CORSヘッダー設定
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // OPTIONSリクエストの処理
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // POSTメソッドのみ許可
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { password } = req.body;
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // 環境変数から設定を取得
    const CORRECT_PASSWORD = process.env.APP_PASSWORD || 'ai-teme-music26';
    const JWT_SECRET = process.env.JWT_SECRET || 'music-ai-kit-secret-key-change-this-in-production-2024';
    const PASSWORD_HASH = hashPassword(CORRECT_PASSWORD);

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

        return res.status(200).json({
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
};
