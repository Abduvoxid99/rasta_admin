import moment from "moment"
import { useTranslation } from "react-i18next"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import Card from "../../../components/Card"
import RangePicker from "../../../components/DatePicker/RangePicker"
import BarChartLegend from "../../../components/Legend/Legend"
import { gradients } from "../../../constants/gradients"
import TooltipBarChart from "../../../components/Tooltip/Tooltip"

// const data = [
//   {
//     name: "1",
//     selfPickup: 1398,
//     delivery: 2210,
//     canceled: 4000,
//     total: 4000,
//   },
//   // {
//   //   name: "Toshkent sh",
//   //   active: 1232,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
//   // {
//   //   name: "Buxoro",
//   //   active: 2344,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
//   // {
//   //   name: "Navoiy",
//   //   active: 8243,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
//   // {
//   //   name: "Samarqand",
//   //   active: 7234,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
//   // {
//   //   name: "Jizzax",
//   //   active: 9234,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
//   // {
//   //   name: "Sirdaryo",
//   //   active: 3123,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
//   // {
//   //   name: "Xorazm",
//   //   active: 1233,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
//   // {
//   //   name: "Namangan",
//   //   active: 1234,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
//   // {
//   //   name: "Farg`ona",
//   //   active: 4234,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
//   // {
//   //   name: "Andijon",
//   //   active: 4232,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
//   // {
//   //   name: "Qashqadaryo",
//   //   active: 4123,
//   //   rejected: 2210,
//   //   auction: 4000,
//   // },
// ]

const keys = [
  {
    datakey: "selfPickup",
    name: "Самовывоз",
  },

  {
    datakey: "canceled",
    name: "Отмененный",
  },
  {
    datakey: "delivery",
    name: "Доставка",
  },
  {
    datakey: "total",
    name: "Итого",
  },
]

const StatisticsBarChart = ({ data, setStatisticFilter, statisticFilter }) => {
  const { t } = useTranslation()
  // const [loader, setLoader] = useState(false)
  // const [selectedCities, setSelectedCities] = useState([])
  // const [selectedDates, setSelectedDates] = useState([null, null])
  console.log("data===>", data)
  const filterColumns = (key) => {
    setStatisticFilter((prev) => ({
      ...prev,
      filterColumns: prev.filterColumns.includes(key)
        ? prev.filterColumns.filter((item) => item !== key)
        : [...prev.filterColumns, key],
    }))
  }

  return (
    <Card
      className=""
      title="Заказы ежедневно"
      extra={
        <div className="flex gap-4 w-full items-center">
          <BarChartLegend
            keys={keys}
            filterColumns={filterColumns}
            filteredColumns={statisticFilter.filterColumns}
          />
          <RangePicker
            hideTimePicker
            placeholder={t("order.period")}
            defaultValue={[
              moment(statisticFilter.start_date),
              moment(statisticFilter.end_date),
            ]}
            onChange={(e) => {
              e[0] === null
                ? setStatisticFilter((old) => ({
                    ...old,
                    start_date: moment().add(-1, "d").format("YYYY-MM-DD"),
                    end_date: moment().add(1, "d").format("YYYY-MM-DD"),
                  }))
                : setStatisticFilter((old) => ({
                    ...old,
                    start_date: moment(e[0]).format("YYYY-MM-DD"),
                    end_date: moment(e[1]).format("YYYY-MM-DD"),
                  }))
            }}
          />
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={410}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -30,
            bottom: 35,
          }}
        >
          <defs>
            {gradients
              .filter((item) =>
                statisticFilter.filterColumns.includes(item.name)
              )
              .map((el) => (
                <linearGradient id={el.name} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={el.from} />
                  <stop offset="100%" stopColor={el.to} />
                </linearGradient>
              ))}
          </defs>
          <CartesianGrid
            stroke="rgba(0, 0, 0, 0.4)"
            vertical={false}
            horizontal={false}
          />
          <XAxis
            dataKey="name"
            style={{ fontWeight: "600", fontSize: "14px", lineHeight: "0" }}
            dy={5}
            textAnchor="start"
            interval={0}
            tick={{ angle: 45 }}
          />
          <YAxis
            tickCount={15}
            textAnchor="end"
            style={{ fontWeight: "600", fontSize: "12px", lineHeight: "24px" }}
          />
          <Tooltip
            content={
              <TooltipBarChart
                keys={keys}
                filteredColumns={statisticFilter.filterColumns}
              />
            }
          />
          {keys.map((data, index) => (
            <Bar
              barSize={15}
              dataKey={data.datakey}
              fill={`url(#${
                gradients.find((item) => item.name === data.datakey).name
              })`}
              barCategoryGap="20%"
              name={data.name}
              key={index}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <TooltipBarChart />
    </Card>
  )
}

export default StatisticsBarChart
