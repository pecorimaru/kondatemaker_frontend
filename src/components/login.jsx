import '../css/styles.css';
import '../css/output.css';
import * as Const from '../constants/constants.js';
import { useNavigate } from 'react-router-dom';
import { BasicButton} from './common';
import { useEffect, useState } from 'react';
import { useKondateMaker } from './global';

export const Login = () => {

  const {user, setUser} = useKondateMaker();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // エラー状態
  const [loading, setLoading] = useState(true); // ローディング状態
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("rerendering")
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${Const.ROOT_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });    
      const data = await response.json();
      if (response.ok) {
        console.log(response)
        setUser({"id": data.detail.id, "name": data.detail.name});
        localStorage.setItem("user", JSON.stringify({id: data.detail.id, name: data.detail.name}));
        navigate("/main");
      } else {
        throw new Error(data.detail.message || "Login failed");
      }
      setMessage(data.detail.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200 text-slate-700">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">ログイン</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ログイン
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <a href="#" className="text-blue-500 hover:underline">パスワードを忘れた場合</a>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
      </div>
    </div>
  );
}