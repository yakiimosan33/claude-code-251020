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

    res.status(200).json({
        status: 'ok',
        message: 'Music AI Kit API is running on Vercel',
        timestamp: new Date().toISOString()
    });
};
