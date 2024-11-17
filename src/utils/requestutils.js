import { apiClient } from './axiosClient';

export async function fetcher(key) {
  try {
    const response = await apiClient.get(key);
    return response.data
  } catch(error) {
    console.log(error)
  }
}
  
export function hasNullOrUndefined(obj) {
    return Object.values(obj).some(value => value === null || value === undefined);
}


export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

