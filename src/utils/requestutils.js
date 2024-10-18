import axios from 'axios';

export async function fetcher(key) {
    const response = await axios.get(key);
    return response.data
  }
  
export function hasNullOrUndefined(obj) {
    return Object.values(obj).some(value => value === null || value === undefined);
}


export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));