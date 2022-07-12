import moment from "moment"

export const orderTimer = (created_at, finished_at, nowDate) => {
  const now = finished_at ? moment(new Date(finished_at)) : nowDate
  let date2 = new Date(created_at)
  date2.setHours(date2.getHours() - new Date(date2).getTimezoneOffset() / 60)
  const create = moment(date2)

  if (finished_at) {
    var t1 = new Date(now)
    var t2 = new Date(moment(created_at))
    var dif = t1.getTime() - t2.getTime()

    var Seconds_from_T1_to_T2 = dif / 1000
    var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2)

    const range = Seconds_Between_Dates

    let days = (range - (range % 86400)) / 86400

    let hour = ((range - (range % 3600)) / 3600) % 24
    hour = hour.toString().length === 1 ? "0" + hour : hour

    let min = ((range % 3600) - ((range % 3600) % 60)) / 60
    min = min.toString().length === 1 ? "0" + min : min

    let sec = (range % 3600) % 60
    sec = sec.toString().length === 1 ? "0" + sec : sec

    return `${days ? days + " дней " : ""}${hour}:${min}:${sec}`
  }

  const range = Math.round((now - create) / 1000)

  let hour = (range - (range % 3600)) / 3600
  hour = hour.toString().length === 1 ? "0" + hour : hour

  let min = ((range % 3600) - ((range % 3600) % 60)) / 60
  min = min.toString().length === 1 ? "0" + min : min

  let sec = (range % 3600) % 60
  sec = sec.toString().length === 1 ? "0" + sec : sec

  return `${hour}:${min}:${sec}`
}
