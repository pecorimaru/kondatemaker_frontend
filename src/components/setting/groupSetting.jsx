import { apiClient } from '../../utils/axiosClient.js';
import { decamelizeKeys } from 'humps';

import { useEffect, useState } from "react";

import * as Const from '../../constants/constants.js';
import { useGroupList, useGroupMemberList } from "../../hooks/useFetchData";
import { useKondateMaker } from "../global/global";
import { MemberInviteForm } from '../form/memberInviteForm.jsx';

export const GroupSetting = () => {

  const { currentGroup, currentGroupStat, currentGroupMutate, showMessage, clearMessage } = useKondateMaker();
  const { groupList, groupListStat } = useGroupList(currentGroup);
  const { groupMemberList, groupMemberListStat } = useGroupMemberList();
  const [isMemberInvite, setIsMemberInvite] = useState(false);
  const [editGroupNm, setEditGroupNm] = useState("");

  useEffect(() => {
    if (!currentGroupStat.isLoading) {
      setEditGroupNm(currentGroup?.groupNm);
    };
  }, [currentGroup, currentGroupStat.isLoading]);

  const submitEditGroupNm = async (e) => {
    e.preventDefault();
    if (editGroupNm === currentGroup.groupNm) {
      return;
    };
    clearMessage();
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/setting/submitEditGroupNm`, decamelizeKeys({ editGroupNm }));
      const data = response.data;
      console.log(data.message, data);
      currentGroupMutate(data.editGroup);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const submitExitGroup = async () => {
    const deletable = window.confirm("グループから脱退すると、再度招待されない限り元に戻すことはできません。\n本当によろしいですか？");
    if (!deletable) {
      return;
    };
    clearMessage();
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/setting/exitGroup`);
      const data = response.data;
      console.log(data.message, data);
      localStorage.setItem("token", data.accessToken);
      window.location.reload();
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const submitChangeGroup = async(groupId) => {
    clearMessage();
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/setting/changeGroup`, decamelizeKeys({ groupId }));
      const data = response.data;
      localStorage.setItem("token", data.accessToken);
      window.location.reload();
    } catch (error) {
      showMessage(error.response.data.detail ? error.response.data.detail : Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  }

  const closeMemberInviteForm = () => {setIsMemberInvite(false)};

  const submitMemberInvite = async (formData) => {
    clearMessage();
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/setting/submitMemberInvite`, decamelizeKeys({ toEmail: formData.toEmail }));
      const data = response.data;
      console.log(data.message, data);
      showMessage(data.message, Const.MESSAGE_TYPE.INFO);
      closeMemberInviteForm();
    } catch (error) {
      showMessage(error.response.data.detail ? error.response.data.detail : Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  return (
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <div className="w-full max-w-md mt-4 py-8 bg-white shadow-lg rounded-md">
          <div className="px-8">
            <label className="block text-md text-gray-700">グループ名:</label>
            <input
                type="text"
                value={editGroupNm}
                onChange={(e) => setEditGroupNm(e.target.value)}
                onBlur={(e) => submitEditGroupNm(e)}
                className="form-input-base"
                disabled={currentGroup?.hasOwnership !== "T" && true}
            />
          </div>
        </div>
        <div className="w-full mt-4 border bg-gray-50 shadow-lg rounded-sm">
          <span className="text-xs px-2 text-slate-700">メンバー</span>
          {!groupMemberListStat.isLoading &&
            <>
              {groupMemberList?.map((row) => (
                <div
                  key={row.userNm}
                  className="flex items-center bg-white h-10 w-full text-slate-700 border-t"
                >
                  <div className="w-8 text-center">
                    <i className={`${row.ownerFlg === "T" && "fa-solid fa-circle-user"}`}></i>
                  </div>
                  <span className="">{row.userNm}</span>
              </div>
              ))}
            </>
          }
        </div>
        <div className="w-full max-w-sm mt-4  bg-white shadow-lg rounded-md">
          {currentGroup?.hasOwnership === "T" ?
            <button
              className="w-full h-10 text-stale-700 rounded-sm border-t hover:bg-gray-100"
              onClick={() => setIsMemberInvite(true)}
            >
              <i className="fa-solid fa-envelope"></i>
              <span className="mx-2">メンバー招待</span>
            </button>
          :          
            <button
              className="w-full h-10 text-stale-700 border-y rounded-sm hover:bg-gray-100"
              onClick={() => submitExitGroup()}
            >
              <i className="fa-solid fa-trash"></i>
              <span className="mx-2">グループ退出</span>
              
            </button>
          }
        </div>
        <div className="w-full mt-4 border bg-gray-50 shadow-lg rounded-sm">
          <span className="text-xs px-2 text-slate-700">グループ切り替え</span>
          {!groupListStat.isLoading &&
            <>
              {groupList?.map((row) => (
                <button key={row.groupId}
                  className="flex items-center bg-white h-10 w-full text-slate-700 border-t hover:bg-gray-100"
                  onClick={() => submitChangeGroup(row.groupId)}  
                >
                  <div className="w-8 text-center">
                    <i className={`${row.currentFlg === "T" && "fa-solid fa-square-check"}`}></i>
                  </div>
                  <span className="">{row.groupNm}</span>
                </button>
              ))}
            </>
          }
        </div>
        {isMemberInvite && <MemberInviteForm submitAction={submitMemberInvite} closeMemberInviteForm={closeMemberInviteForm}/>}
      </div>
    </div>
  );
};

// const GroupRow = () => {



//   <span
//     className="w-full h-10 text-stale-700 border-y rounded-sm hover:bg-gray-100"
//   >
//     <i className="fa-solid fa-trash"></i>
//     <span className="mx-2">グループを脱退する</span>
    
//   </span>


// }