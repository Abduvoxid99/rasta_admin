import React from "react"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import TableRow from "@material-ui/core/TableRow"
import TextFilter from "../../components/Filters/TextFilter"

const grid = 4
const getListStyle = () => ({
  padding: grid,
  overflow: "none",
})

const getItemStyle = (_, draggableStyle) => ({
  userSelect: "none",
  paddingBottom: grid * 2,
  margin: `0 ${grid}px 0 0`,
  display: "inline-block",
  ...draggableStyle,
})

class EnhancedTableHead extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property)
  }

  render() {
    const { columnData, handleResizeColumn, handleReorderColumnData } =
      this.props

    return (
      <DragDropContext onDragEnd={handleReorderColumnData}>
        <TableHead>
          <TableRow
            component={Droppable}
            droppableId="droppable"
            direction="horizontal"
            style={{ padding: 0 }}
          >
            {(provided, snapshot) => (
              <tr
                key={snapshot.toString()}
                ref={provided.innerRef}
                style={{
                  ...getListStyle(snapshot.isDraggingOver),
                  padding: 0,
                }}
                {...provided.droppableProps}
                className="MuiTableRow-root MuiTableRow-head"
              >
                {/* {console.log(snapshot)} */}
                {columnData.map((item, index) =>
                  item.key === "actions" ? (
                    <TableCell key={item.id + "-cell"}>
                      <TextFilter {...item} />
                    </TableCell>
                  ) : (
                    <TableCell
                      key={item.id + "-cell"}
                      style={{
                        overflow: "none",
                        width: `${item.width}px`,
                        paddingLeft: 0,
                        paddingRight: 0,
                        position: "relative",
                      }}
                    >
                      <Draggable
                        key={item.id + "-draggable"}
                        draggableId={item.id + "-draggableId"}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, {
                              ...provided.draggableProps.style,
                              display: "inline-block",
                              padding: 0,
                              margin: 0,
                              width: `${item.width}px`,
                              cursor: "move",
                            })}
                          >
                            <TextFilter {...item} />
                          </div>
                        )}
                      </Draggable>
                      {/* {!snapshot.isDragging && (
                        <ReactDraggable
                          axis="x"
                          defaultClassName="ReactDragHandle"
                          defaultClassNameDragging="ReactDragHandleActive"
                          onStop={(_, data) => {
                            console.log(data)
                            const newWidth = item.width + data.x
                            return handleResizeColumn(item.id, newWidth)
                          }}
                          position={{
                            x: 0,
                            y: 0,
                          }}
                          zIndex={999}
                        >
                          <div
                            style={{
                              top: 0,
                              right: -1,
                              cursor: "col-resize",
                              height: "45px",
                              width: "2px",
                              position: "absolute",
                              zIndex: 9999,
                            }}
                          />
                        </ReactDraggable>
                      )} */}
                    </TableCell>
                  )
                )}
              </tr>
            )}
          </TableRow>
        </TableHead>
      </DragDropContext>
    )
  }
}

export default EnhancedTableHead
