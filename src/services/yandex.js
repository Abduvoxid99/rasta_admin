import axios from "axios"

export const getAddressListYandex = (params) =>
  axios({
    method: "get",
    url: "https://search-maps.yandex.ru/v1/",
    params: {
      ...params,
      type: "biz",
      lang: "ru_RU",
      apikey: "d778c11d-b8d1-4b37-b4f0-13d2e7eaf0ce",
      results: 5,
    },
  })
