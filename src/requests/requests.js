import axios from 'axios';
import * as Const from '../constants/constants.js';

// export async function login (email, password) {

//   try {

//     const response = await axios.post(`${Const.ROOT_URL}/login`, { email, password});
//     const data  = response.data 

//   } catch (error) {
//     setError(error.message);
//   } finally {
//     setLoading(false);
//   }


//     if (response.ok) {
//       console.log(response)
//       setUser({"id": data.detail.id, "name": data.detail.name});
//       localStorage.setItem("user", JSON.stringify({id: data.detail.id, name: data.detail.name}));
//       navigate("/main");
//     } else {
//       throw new Error(data.detail.message || "Login failed");
//     }
//     setMessage(data.detail.message);

// }

export async function refreshToweekPlan(selected_plan, user_id)  {
  try {
    const response = await axios.put(`${Const.ROOT_URL}/home/refreshToweekPlan`, { selected_plan, user_id });
    const data  = response.data
    console.log(data.message);
  } catch (error) {
    console.error(error.message);
  } finally {
  }
}

export async function switchCompletionState(buy_ingreds_id, flg)  {
  try {
    const response = await axios.put(`${Const.ROOT_URL}/buyList/switchCompletionState`, { buy_ingreds_id, flg });
    const data  = response.data
    console.log(data.message);
  } catch (error) {
    console.error(error.message);
  } finally {
  }
}