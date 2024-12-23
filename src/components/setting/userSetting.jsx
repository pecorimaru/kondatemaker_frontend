
import { decamelizeKeys } from 'humps';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import '../../css/styles.css';
import '../../css/output.css';

import * as Const from '../../constants/constants.js';
import { useKondateMaker } from '../global/global.jsx';

import { apiClient } from '../../utils/axiosClient.js';
import { ChangePasswordForm } from '../form/changePasswordForm.jsx';


export const UserSetting = () => {

  const { userNm, setUserNm, loginUser, loginUserStat, setIsLoggedIn, showMessage, clearMessage, setIsOpeningForm } = useKondateMaker();
  const [editUserNm, setEditUserNm] = useState(loginUser?.userNm);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const navigate = useNavigate();

  const closeChangePasswordForm = () => {
    setIsChangePassword(false);
    setIsOpeningForm(false);
  }

  useEffect(() => {
    if (!loginUserStat.isLoading) {
      setEditUserNm(loginUser?.userNm);
    };
  }, [loginUser, loginUserStat.isLoading]);

  const submitEditUserNm = async () => {
    if (userNm === editUserNm) {
      return;
    };
    clearMessage();
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/setting/submitEditUserNm`, decamelizeKeys({ editUserNm }));
      const data = response.data;
      console.log(data.messaage, data);
      setUserNm(editUserNm);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const submitChangePassword = async (formData) => {
    clearMessage();
    try {
      const response = await apiClient.post(
        `${Const.ROOT_URL}/setting/submitChangePassword`, 
        decamelizeKeys({ currentPassword: formData.currentPassword, newPassword: formData.newPassword })
      );
      const data = response.data;
      closeChangePasswordForm();
      showMessage(data.message, Const.MESSAGE_TYPE.INFO);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const submitDeleteUser = async () => {
    const deletable = window.confirm("アカウントを削除します。\n削除した情報は元に戻すことができません。\n本当によろしいですか？");
    if (!deletable) {
      return;
    };
    clearMessage();
    try {
      const response = await apiClient.delete(`${Const.ROOT_URL}/setting/submitDeleteUser`, { 
      });
      const data = await response.data;
      console.log("削除成功", data);
      showMessage("アカウントの削除が完了しました。\nご利用ありがとうございました。", Const.MESSAGE_TYPE.INFO)
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      navigate("/")
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  return (
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <div className="w-full max-w-sm mt-4 py-8 bg-white shadow-lg rounded-md">
          <div className="px-8">
            <label className="block text-md text-gray-700">表示名:</label>
            <input
                type="text"
                value={editUserNm}
                className="form-input-base"
                onChange={(e) => setEditUserNm(e.target.value)}
                onBlur={() => submitEditUserNm()}
                required
            />
          </div>
        </div>
        <div className="w-full max-w-sm mt-4  bg-white shadow-lg rounded-md">
          <button
            className="w-full h-10 text-stale-700 rounded-sm border-t hover:bg-gray-100"
            onClick={() => setIsChangePassword(true)}
          >
            <i className="fa-solid fa-key"></i>
            <span className="mx-2">パスワード変更</span>
          </button>
          <button
            className="w-full h-10 text-stale-700 border-y rounded-sm hover:bg-gray-100"
            onClick={() => submitDeleteUser()}
          >
            <i className="fa-solid fa-trash"></i>
            <span className="mx-2">アカウント削除</span>
            
          </button>
        </div>
        {isChangePassword && <ChangePasswordForm submitAction={submitChangePassword} closeChangePasswordForm={closeChangePasswordForm} />}
      </div>
    </div>
  );
};