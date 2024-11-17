import axios from 'axios';

// Axiosインスタンスを作成
export const apiClient = axios.create({
//   baseURL: 'http://localhost:3000/', // ベースURLを設定
  timeout: 10000, // タイムアウトを設定（任意）
});

// 環境変数からログレベルを取得
const logLevel = process.env.REACT_APP_LOG_LEVEL || 'error';

// レスポンス用インターセプター
apiClient.interceptors.response.use(
  (response) => response, // 正常なレスポンスをそのまま返す
  (error) => {
    if (logLevel === 'debug') {
      console.error('Axios Error:', error); // 開発用詳細ログ
    } else if (logLevel === 'error') {
      console.error('An error occurred'); // 本番用簡略ログ
    }

    return Promise.reject(error); // エラーを投げる
  }
);
