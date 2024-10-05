

// export const ROOT_URL = "http://localhost:8000/api"
// export const ROOT_URL = "https://kondatemaker.mydns.jp/api"
export const ROOT_URL = "/api"

export const WEEK_SUNDAY = 1
export const WEEK_MONDAY = 2
export const WEEK_TUESDAY = 3
export const WEEK_WEDNESDAY = 4
export const WEEK_THURSDAY = 5
export const WEEK_FIRDAY = 6
export const WEEK_SATURDAY = 7

export const DAYWISE_ITEMS = {
    [WEEK_SUNDAY]: {
      bgColor: "bg-red-200",
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
      bgColor: "bg-indigo-200",
      weekday: "土"
    }
  }
