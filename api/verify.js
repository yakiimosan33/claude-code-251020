const jwt = require('jsonwebtoken');

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
        return res.status(405).json({ valid: false, message: 'Method not allowed' });
    }

    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ valid: false, message: 'トークンがありません' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'music-ai-kit-secret-key-change-this-in-production-2024';

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.status(200).json({ valid: true, decoded });
    } catch (error) {
        return res.status(401).json({ valid: false, message: 'トークンが無効です' });
    }
};
