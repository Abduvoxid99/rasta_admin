import { CircularProgress } from "@material-ui/core"

const TableLoader = ({ isVisible = true, style }) => {
  if (!isVisible) return null

  return (
    <div className="flex justify-center align-center py-10" style={style}>
      <CircularProgress />
    </div>
  )
}

export default TableLoader
