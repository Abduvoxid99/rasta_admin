export const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        count: 2,
        data: [
          {
            client_name: "Абдумансуров Абдукаххор",
            client_phone: "+998 (90) 123-45-67",
            id: "asdasdasdasdas",
            order_id: "5262261",
            location: "Dr Summit",
            duration: "3 мин",
          },
        ],
      })
    }, 1000)
  })
}
