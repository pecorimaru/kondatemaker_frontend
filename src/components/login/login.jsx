import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

import '../../css/styles.css';
import '../../css/output.css';

import * as Const from '../../constants/constants.js';
import { useKondateMaker } from '../global/global.jsx';

import { LoadingSpinner, MessageArea } from '../global/common.jsx';
import { decamelizeKeys } from 'humps';


export const Login = () => {

  const { setUser, isMessageVisible, setIsMessageVisible } = useKondateMaker();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [googleEmail, setGoogleEmail] = useState("");

  const googleLogin = useCallback(async () => {
    if (!googleEmail) return;
    try {
      const response = await axios.post(`${Const.ROOT_URL}/googleLogin`, { email: googleEmail });
      const data  = response.data;
      if (data.statusCode === 200) {
        localStorage.setItem("user", JSON.stringify({id: data?.user_id, name: data?.user_nm}));
        setUser({"id": data?.user_id, "name": data?.user_nm});
        navigate("/main");
      } else {
        throw new Error(data.detail.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, [googleEmail, navigate, setUser]);

  useEffect(() => {
    if (googleEmail) {
      googleLogin()
    }
  }, [googleEmail, googleLogin]);

  const getGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // 取得したトークンを使用してサーバーに認証情報を送信
      const { access_token } = tokenResponse;
      console.log('tokenResponse:', tokenResponse);
      await fetchGoogleEmail(access_token);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },  
  })

  const fetchGoogleEmail = async (accessToken) => {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      setGoogleEmail(data.email)
    } catch (error) {
      console.error('Error fetching Google email:', error);
    }
  };




  const loginSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {

      const response = await axios.post(`${Const.ROOT_URL}/login/login`, decamelizeKeys({ email, password }));
      const data  = response?.data;
      console.log(data)
      if (data?.statusCode === 200) {
        localStorage.setItem("user", JSON.stringify({id: data.userId, nm: data.userNm}));
        setUser({"id": data.userId, "nm": data.userNm});
        navigate("/home");
      } else {
        console.log(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error", error);
        setError(error.response.data.detail ? error.response.data.detail : Const.MSG_MISSING_REQUEST);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-slate-100 text-slate-700">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center">ログイン</h2>
          <form onSubmit={loginSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-base"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                パスワード
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  text-base"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 h-12 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLoading ? <LoadingSpinner /> : <p>ログイン</p>}
              </button>
            </div>
          </form>
          <div>
            <button onClick={getGoogleAuth}>Googleでログイン</button>
          </div>
          <div className="text-sm text-center">
            {/* <a href="#" className="text-blue-500 hover:underline">パスワードを忘れた場合</a> */}
            <p className="text-blue-500 hover:underline">パスワードを忘れた場合</p>
          </div>
          {/* {loading && <LoadingSpinner />} */}
          {error && <p className="text-red-500">{error}</p>}
          {/* {message && <p className="text-green-500">{message}</p>} */}
        </div>
      </div>
    </>
  );
}