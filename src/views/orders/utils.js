export const defineCount = (id, arr = []) => {
  if (!id || !arr) return []
  if (id.length > 400) {
    return !id.length > 400
  }
  const ids = id.split(",")
  if (ids.length > 1) {
    let count = 0
    arr.forEach((elm) => {
      if (ids.includes(elm.status_id)) {
        count += +elm.count
      }
    })
    return count
  } else {
    return arr.find((elm) => id === elm.status_id)?.count ?? 0
  }
}

export const reorder = (list, startIndex, endIndex) => {
  // if (!list) return []

  // if (!endIndex && list) return list

  const result = list
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}
