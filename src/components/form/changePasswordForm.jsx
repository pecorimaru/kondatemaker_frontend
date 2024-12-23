import '../../css/styles.css';
import '../../css/output.css';

import * as Const from '../../constants/constants.js';
import React, { useEffect, useState } from "react";

import { useEventHandler } from "../../hooks/useEventHandler";

import { FormCloseButton, FormSubmitButton, Required } from "../global/common";
import { useKondateMaker } from '../global/global';


export const ChangePasswordForm = ({ submitAction, closeChangePasswordForm }) => {

  const { showMessage, clearMessage, setIsOpeningForm } = useKondateMaker();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState();
  const [newPasswordAgain, setNewPasswordAgain] = useState();

  useEffect(() => {setIsOpeningForm(true)}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    clearMessage();
    if (newPassword !== newPasswordAgain) {
      showMessage(Const.MESSAGE.PASSWORD_NOT_EQUALS, Const.MESSAGE_TYPE.WARN)
      return;
    }
    submitAction({ currentPassword, newPassword });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeChangePasswordForm();
    };
  };
  useEventHandler("keydown", handleKeyDown)
  
  return (
    <div 
      className="form-bg-layout-base"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700">現在のパスワード<Required/></label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input-base"
              autocomplete="off"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">新しいパスワード<Required/></label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input-base"
              autocomplete="off"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">新しいパスワード（再入力）<Required/></label>
            <input
              type="password"
              value={newPasswordAgain}
              onChange={(e) => setNewPasswordAgain(e.target.value)}
              className="form-input-base"
              autocomplete="off"
              required
            />
          </div>

          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeChangePasswordForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
