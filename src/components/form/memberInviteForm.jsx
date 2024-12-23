import '../../css/styles.css';
import '../../css/output.css';

import React, { useEffect, useState } from "react";

import { useEventHandler } from "../../hooks/useEventHandler.js";

import { FormCloseButton, FormSubmitButton, Required } from "../global/common.jsx";
import { useKondateMaker } from '../global/global.jsx';


export const MemberInviteForm = ({ submitAction, closeMemberInviteForm }) => {

  const { setIsOpeningForm } = useKondateMaker();
  const [toEmail, setToEmail] = useState("");
  
  useEffect(() => {setIsOpeningForm(true)}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAction({ toEmail });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMemberInviteForm();
    };
  };
  useEventHandler("keydown", handleKeyDown)
  
  return (
    <div 
      className="form-bg-layout-base"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-96 w-full">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700">招待するユーザーのメールアドレス<Required/></label>
            <input
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="form-input-base"
              autocomplete="off"
              required
            />
          </div>

          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeMemberInviteForm} />
            <FormSubmitButton textContent={"送信"} />
          </div>
        </form>
      </div>
    </div>
  );
};
