import '../../css/styles.css';
import '../../css/output.css';

import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

import * as Const from '../../constants/constants.js';
import { useKondateMaker } from '../global/global.jsx';

import { ButtonContinueWithGooble, LoadingSpinner } from '../global/common.jsx';
import { decamelizeKeys } from 'humps';
import { apiClient } from '../../utils/axiosClient.js';


export const Login = () => {

  const { setIsLoggedIn, showMessage, clearMessage } = useKondateMaker();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();


  const verifyToken = useCallback(async (token) => {
    try {
      await apiClient.post(`${Const.ROOT_URL}/login/verify`, { token });
      setIsLoggedIn(true);
      navigate('/home');
    } catch (error) {
      // ステータスコード[401]はトークンの有効期限切れの際に返却する仕様
      if (error?.response?.statusCode !== 401) {
        // 想定するエラー：論理エラー > タイムアウト > ネットワークエラー(原因不明)
        showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
        setIsLoggedIn(false);
      }
    };
  }, [setIsLoggedIn, navigate, showMessage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    }
  }, [verifyToken]);


  const getGoogleAuth = useGoogleLogin({    
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const userinfoResponse = await apiClient.get('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userinfoData = userinfoResponse.data;
        const verifyResponse = await apiClient.post(`${Const.ROOT_URL}/login/googleLogin`, decamelizeKeys({ email: userinfoData.email }));
        const verifyData = verifyResponse.data;
        localStorage.setItem("token", verifyData.accessToken);
        localStorage.setItem("isLoggedIn", true);
        setIsLoggedIn(true);
        navigate("/home");
      } catch (error) {
        showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },  
  });

  const submitLogin = async (e) => {
    e.preventDefault();
    clearMessage();
    setLoading(true);
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/login/login`, decamelizeKeys({ email, password }));
      const data = response.data;
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("isLoggedIn", true);
      setIsLoggedIn(true);
      navigate("/home");
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white shadow-lg rounded-md">
        <h2 className="text-2xl text-center text-slate-700">ログイン</h2>
        <form onSubmit={submitLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-slate-700">
              メールアドレス:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-slate-700">
              パスワード:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input-base"
            />
          </div>
          <div>
            <span 
              className="login-link-text-base"
              onClick={() => navigate("/resetPassword")}
            >
                パスワードを忘れた場合</span>
          </div>
          <div>
            <button
              type="submit"
              className="button-base h-12 w-full text-white bg-blue-400 border-b-blue-500 rounded-sm hover:text-gray-100"
            >
              {isLoading ? <LoadingSpinner /> : <span>ログイン</span>}
            </button>
          </div>
        </form>
        <div>
            <span className="text-sm text-slate-700">アカウントをお持ちでない場合 </span>
            <span 
              className="login-link-text-base"
              onClick={() => navigate("/signUp")}
            >
              新規登録
            </span>
        </div>
        <div className="flex justify-center items-center">
          <div className="border-t border-gray-300 w-2/5"></div>
          <span className="my-1 mx-3 text-sm text-slate-700">または</span>
          <div className="border-t border-gray-300 w-2/5"></div>
        </div>
        <div>
          <ButtonContinueWithGooble getGoogleAuth={getGoogleAuth} isGoogleLoading={isGoogleLoading} />
        </div>
      </div>
    </div>
  );
}