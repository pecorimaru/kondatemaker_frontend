import React, { useEffect, useState } from "react";

import * as Const from '../../constants/constants.js';

import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from '../../utils/axiosClient.js';
import { decamelizeKeys } from 'humps';

import { LoadingSpinner } from "../global/common.jsx";

export const Activation = () => {

  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [token] = useState(searchParams.get("token"));
  const [isDone, setIsDone] = useState(false);
  const [message, setMessage] = useState("")
  const navigate = useNavigate();
  

  useEffect(() => {
    activateUser();
  }, []);

  const activateUser = async () => {
    if (!token) {
      setStatus("error");
      return;
    }
    if (isDone) {
      return
    };
    setMessage("アカウントを有効化しています...")
    try { 
      const response = await apiClient.post(`${Const.ROOT_URL}/login/activate`, decamelizeKeys({ token }));
      const data = response.data;
      setStatus("ok")
      setMessage(data.message)
    } catch (error) {
      setStatus("error");
      setMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    } finally {
      setIsDone(true);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white shadow-lg rounded-md">
        <div>
          {status === "loading" && 
            <>
              <LoadingSpinner />
              <p className="mt-4">{message}</p>
            </>
          }
          {status === "ok" && 
          <>
            {message?.includes("\n") ?
              <>
                {message.split("\n").map((line, index, arr) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < arr.length - 1 && <br />} {/* 改行がある場合のみ <br /> */}
                  </React.Fragment>
                ))}
              </>
              :
              <>{message}</>
            }
            <div className="mt-4 text-center">
              <span 
                className="login-link-text-base"
                onClick={() => navigate("/")}
              >ログイン画面に移動する</span>
            </div>
          </>
          }
          {status === "error" && 
          <>
            {message?.includes("\n") ?
              <>
                {message.split("\n").map((line, index, arr) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < arr.length - 1 && <br />} {/* 改行がある場合のみ <br /> */}
                  </React.Fragment>
                ))}
              </>
              :
              <>{message}</>
            }
            <div className="mt-4 text-center">
              <span 
                className="login-link-text-base"
                onClick={() => navigate("/")}
              >ログイン画面に移動する</span>
            </div>
          </>
          }
        </div>
      </div>
    </div>
  );
}
