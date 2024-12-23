

// export const ROOT_URL = "http://localhost:8000/api"
// export const ROOT_URL = "https://kondatemaker.mydns.jp/api"
export const ROOT_URL = "/api"

export const DICT_IDX = {CD: "0", NM: "1"}

export const MSG_MISSING_REQUEST = "リクエスト処理に失敗しました。ネットワーク接続を確認してください。"
export const MESSAGE = {
  MISSING_REQUEST: "リクエスト処理に失敗しました。ネットワーク接続を確認してください。",
  PASSWORD_NOT_EQUALS: "パスワードが一致しません。\n入力内容を確認してください。",
  TIMEOUT: "処理がタイムアウトしました。"
}

export const UNIT_CONV_TYPE_100_COMP = "1"

export const PREV_SCREEN_TYPE = {
  BUY: "1",
  RECIPE_INGRED: "2"
}

export const MESSAGE_TYPE = {
  INFO: "1",
  WARN: "2",
  ERROR: "3",
}



export const WEEK_SUNDAY = 1
export const WEEK_MONDAY = 2
export const WEEK_TUESDAY = 3
export const WEEK_WEDNESDAY = 4
export const WEEK_THURSDAY = 5
export const WEEK_FIRDAY = 6
export const WEEK_SATURDAY = 7

export const DAYWISE_ITEMS = {
    [WEEK_SUNDAY]: {
      bgColor: "bg-red-100",
      weekday: "日"
    },
    [WEEK_MONDAY]: {
      bgColor: "bg-yellow-100",
      weekday: "月"
    },
    [WEEK_TUESDAY]: {
      bgColor: "bg-fuchsia-100",
      weekday: "火"
    },
    [WEEK_WEDNESDAY]: {
      bgColor: "bg-green-100",
      weekday: "水"
    },
    [WEEK_THURSDAY]: {
      bgColor: "bg-amber-100",
      weekday: "木"
    },
    [WEEK_FIRDAY]: {
      bgColor: "bg-cyan-100",
      weekday: "金"
    },
    [WEEK_SATURDAY]: {
      bgColor: "bg-indigo-100",
      weekday: "土"
    }
  }
