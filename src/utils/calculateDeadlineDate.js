import moment from "moment"

const calculateDeadlineDate = (deadline, updatedDate) => {
  window.moment = moment
  updatedDate = moment(updatedDate)
  deadline = checkWeekend(deadline, updatedDate)
  return updatedDate.add(deadline, 'days')
}


const checkWeekend = (deadline, updatedDate) => {
  const weekDay = updatedDate.day()

  if (weekDay === 6) return deadline + 1

  return Math.floor((weekDay + deadline) / 6) * 2 + deadline
}

export default calculateDeadlineDate
