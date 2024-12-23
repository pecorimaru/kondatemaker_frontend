import axios from 'axios';
import * as Const from '../constants/constants.js';


// Axiosインスタンスを作成
export const apiClient = axios.create({
//   baseURL: 'http://localhost:3000/', // ベースURLを設定
  timeout: process.env.REACT_APP_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  }
});

// 環境変数からログレベルを取得
const logLevel = process.env.REACT_APP_LOG_LEVEL || 'error';

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('request Error:', error);
    return Promise.reject(error);
  }
);

// レスポンス用インターセプター
apiClient.interceptors.response.use(

  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("originalRequest", originalRequest)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${Const.ROOT_URL}/login/refresh`);
        localStorage.setItem("token", response.data.newAccessToken);
        console.log("refresh successful")

        // 新しいアクセストークンをヘッダーに追加して再リクエスト
        originalRequest.headers["Authorization"] = `Bearer ${response.data.newAccessToken}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
      // } catch (error) {
        console.log("error", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedin");
        if (window.location.pathname !== "/") {
          window.location.href = '/';
        };
        return Promise.reject(refreshError);
      };
    };

    if (error.message === `timeout of ${process.env.REACT_APP_TIMEOUT}ms exceeded`) {
      error._messageTimeout = Const.MESSAGE.TIMEOUT
    };
    if (logLevel === 'debug') {
      console.error('Axios Error:', error);
    } else if (logLevel === 'error') {
      console.error('An error occurred');
    };
    return Promise.reject(error); // エラーを投げる
  }
);

