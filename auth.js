// 認証システム（サーバーAPI連携版）
(function() {
    'use strict';

    // 設定
    const CONFIG = {
        API_BASE_URL: window.location.origin,
        SESSION_KEY: 'musicai_auth_token',
        SESSION_TIMEOUT: 3600000, // 1時間
    };

    // APIリクエストヘルパー
    async function apiRequest(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, options);
            const result = await response.json();
            return { success: response.ok, data: result, status: response.status };
        } catch (error) {
            console.error('API request failed:', error);
            return { success: false, error: error.message };
        }
    }

    // トークンを保存
    function saveToken(token) {
        const sessionData = {
            token: token,
            timestamp: Date.now(),
            expiresAt: Date.now() + CONFIG.SESSION_TIMEOUT
        };
        sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(sessionData));
    }

    // トークンを取得
    function getToken() {
        const sessionData = sessionStorage.getItem(CONFIG.SESSION_KEY);
        if (!sessionData) return null;

        try {
            const session = JSON.parse(sessionData);
            // 有効期限チェック
            if (Date.now() > session.expiresAt) {
                sessionStorage.removeItem(CONFIG.SESSION_KEY);
                return null;
            }
            return session.token;
        } catch (e) {
            return null;
        }
    }

    // セッションを検証
    async function validateSession() {
        const token = getToken();
        if (!token) return false;

        // サーバーでトークンを検証
        const result = await apiRequest('/api/verify', 'POST', { token });
        return result.success && result.data.valid;
    }

    // ログアウト
    function logout() {
        sessionStorage.removeItem(CONFIG.SESSION_KEY);
        window.location.href = 'login.html';
    }

    // ページ保護（メインページ用）
    async function protectPage() {
        // login.htmlの場合は保護しない
        if (window.location.pathname.includes('login.html')) {
            return;
        }

        const isValid = await validateSession();
        if (!isValid) {
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

            const password = passwordInput.value;

            // ログインボタンを無効化
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = '認証中...';

            try {
                // サーバーにログインリクエストを送信
                const result = await apiRequest('/api/login', 'POST', { password });

                if (result.success && result.data.success) {
                    // ログイン成功
                    saveToken(result.data.token);
                    window.location.href = 'index.html';
                } else {
                    // ログイン失敗
                    errorMessage.textContent = result.data.message || 'ログインに失敗しました';
                    errorMessage.style.display = 'block';
                    passwordInput.value = '';
                    passwordInput.focus();
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = 'サーバーとの通信に失敗しました';
                errorMessage.style.display = 'block';
            } finally {
                // ボタンを再度有効化
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });

        // エラーメッセージを入力時に非表示
        passwordInput.addEventListener('input', function() {
            errorMessage.style.display = 'none';
        });
    }

    // 初期化
    document.addEventListener('DOMContentLoaded', async function() {
        // ログインページの場合
        if (window.location.pathname.includes('login.html')) {
            // 既にログイン済みの場合はメインページへ
            const isValid = await validateSession();
            if (isValid) {
                window.location.href = 'index.html';
                return;
            }
            setupLoginForm();
        } else {
            // メインページの場合は保護
            await protectPage();
        }
    });

    // グローバルに公開
    window.MusicAIAuth = {
        logout: logout,
        validateSession: validateSession,
        protectPage: protectPage
    };

})();
