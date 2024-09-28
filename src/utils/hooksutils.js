import useSWR from 'swr'
import * as Const from '../constants/constants.js';
import { fetcher, hasNullOrUndefined } from '../utils/requestutils.js';

/**
 * useSWR を用いたデータフェッチ用フック
 * params に null or undifined が含まれる場合：null
 * params が 0 件の場合：クエリパラメータを省略
 * @param  {string} key    - エンドポイント
 * @param  {object} params - パラメータ
 * @returns { data, error, isLoading } 戻り値の説明を書く
 */
export function useFetchData(key, params) {

  let fetchUrl;

  if (hasNullOrUndefined(params)) {
    fetchUrl = null;
  } else if (Object.keys(params).length === 0) {
    fetchUrl = `${Const.ROOT_URL}/${key}`;
  } else {
    const formattedParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');
    console.log(`fetch ${key} params=${formattedParams}`);
    const queryParams = new URLSearchParams(params).toString();
    fetchUrl = `${Const.ROOT_URL}/${key}/query_params?${queryParams}`;
  }
  return useSWR(fetchUrl, fetcher);
}