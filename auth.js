// 認証システム
(function() {
    'use strict';

    // セキュリティ設定
    const CONFIG = {
        // パスワードのハッシュ（SHA-256）: ai-teme-music26
        PASSWORD_HASH: '06c687879bf891c7c430b9d0fc47d30ff6fee41cc88c742c47f515f4e26af064',
        MAX_ATTEMPTS: 5,
        LOCKOUT_TIME: 300000, // 5分
        SESSION_TIMEOUT: 3600000, // 1時間
        SESSION_KEY: 'musicai_auth_session',
        ATTEMPTS_KEY: 'musicai_login_attempts',
        LOCKOUT_KEY: 'musicai_lockout_until'
    };

    // SHA-256ハッシュ関数（簡易版）
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // ログイン試行回数チェック
    function checkLockout() {
        const lockoutUntil = localStorage.getItem(CONFIG.LOCKOUT_KEY);
        if (lockoutUntil) {
            const lockoutTime = parseInt(lockoutUntil);
            if (Date.now() < lockoutTime) {
                const remainingMinutes = Math.ceil((lockoutTime - Date.now()) / 60000);
                return {
                    locked: true,
                    message: `アカウントがロックされています。${remainingMinutes}分後に再試行してください。`
                };
            } else {
                // ロックアウト期間が終了
                localStorage.removeItem(CONFIG.LOCKOUT_KEY);
                localStorage.removeItem(CONFIG.ATTEMPTS_KEY);
            }
        }
        return { locked: false };
    }

    // ログイン試行を記録
    function recordLoginAttempt(success) {
        if (success) {
            localStorage.removeItem(CONFIG.ATTEMPTS_KEY);
            localStorage.removeItem(CONFIG.LOCKOUT_KEY);
            return;
        }

        let attempts = parseInt(localStorage.getItem(CONFIG.ATTEMPTS_KEY) || '0');
        attempts++;
        localStorage.setItem(CONFIG.ATTEMPTS_KEY, attempts.toString());

        if (attempts >= CONFIG.MAX_ATTEMPTS) {
            const lockoutUntil = Date.now() + CONFIG.LOCKOUT_TIME;
            localStorage.setItem(CONFIG.LOCKOUT_KEY, lockoutUntil.toString());
            return {
                locked: true,
                message: `ログイン試行回数が上限に達しました。5分後に再試行してください。`
            };
        }

        return {
            locked: false,
            remainingAttempts: CONFIG.MAX_ATTEMPTS - attempts
        };
    }

    // セッションを作成
    function createSession() {
        const sessionData = {
            authenticated: true,
            timestamp: Date.now(),
            expiresAt: Date.now() + CONFIG.SESSION_TIMEOUT
        };
        sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(sessionData));
    }

    // セッションを検証
    function validateSession() {
        const sessionData = sessionStorage.getItem(CONFIG.SESSION_KEY);
        if (!sessionData) return false;

        try {
            const session = JSON.parse(sessionData);
            if (Date.now() > session.expiresAt) {
                sessionStorage.removeItem(CONFIG.SESSION_KEY);
                return false;
            }
            return session.authenticated === true;
        } catch (e) {
            return false;
        }
    }

    // ログアウト
    function logout() {
        sessionStorage.removeItem(CONFIG.SESSION_KEY);
        window.location.href = 'login.html';
    }

    // ページ保護（メインページ用）
    function protectPage() {
        // login.htmlの場合は保護しない
        if (window.location.pathname.includes('login.html')) {
            return;
        }

        if (!validateSession()) {
            window.location.href = 'login.html';
        }
    }

    // ログインフォーム処理
    function setupLoginForm() {
        const form = document.getElementById('loginForm');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('errorMessage');

        if (!form) return;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // ロックアウトチェック
            const lockoutStatus = checkLockout();
            if (lockoutStatus.locked) {
                errorMessage.textContent = lockoutStatus.message;
                errorMessage.style.display = 'block';
                return;
            }

            const password = passwordInput.value;

            try {
                // パスワードをハッシュ化して検証
                const hashedPassword = await hashPassword(password);

                if (hashedPassword === CONFIG.PASSWORD_HASH) {
                    // ログイン成功
                    recordLoginAttempt(true);
                    createSession();
                    window.location.href = 'index.html';
                } else {
                    // ログイン失敗
                    const attemptResult = recordLoginAttempt(false);

                    if (attemptResult.locked) {
                        errorMessage.textContent = attemptResult.message;
                    } else {
                        errorMessage.textContent = `パスワードが正しくありません（残り試行回数: ${attemptResult.remainingAttempts}回）`;
                    }

                    errorMessage.style.display = 'block';
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            } catch (error) {
                console.error('認証エラー:', error);
                errorMessage.textContent = '認証処理中にエラーが発生しました';
                errorMessage.style.display = 'block';
            }
        });

        // エラーメッセージを入力時に非表示
        passwordInput.addEventListener('input', function() {
            errorMessage.style.display = 'none';
        });
    }

    // 初期化
    document.addEventListener('DOMContentLoaded', function() {
        // ログインページの場合
        if (window.location.pathname.includes('login.html')) {
            // 既にログイン済みの場合はメインページへ
            if (validateSession()) {
                window.location.href = 'index.html';
                return;
            }
            setupLoginForm();
        } else {
            // メインページの場合は保護
            protectPage();
        }
    });

    // グローバルに公開
    window.MusicAIAuth = {
        logout: logout,
        validateSession: validateSession,
        protectPage: protectPage
    };

})();
