import React, { useState } from "react"
import { withStyles } from "@material-ui/core/styles"
import MuiAccordion from "@material-ui/core/Accordion"
import MuiAccordionSummary from "@material-ui/core/AccordionSummary"
import MuiAccordionDetails from "@material-ui/core/AccordionDetails"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"

const Accordion = withStyles({
  root: {
    border: "none",
    boxShadow: "none",
    position: "relative",
    zIndex: 9,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    borderBottom: "none",
    minHeight: 48,
    boxShadow: "inset 0px -1px 0px #E5E9EB",
    backgroundColor: "#fff",
    padding: "0 12px",
    "&$expanded": {
      minHeight: 48,
    },
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: 0,
    display: "block",
  },
}))(MuiAccordionDetails)

export default function Permission({
  permissions,
  onChangePermissions,
  checkedPermissions,
  actionData = "forward",
}) {
  const [expanded, setExpanded] = useState(null)

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  const findChildPermission = (parrentId, childId) => {
    const permissionData = checkedPermissions.find(
      (item) => item.id === parrentId
    )
    if (permissionData && permissionData.actions) {
      return permissionData.actions.find((item) => item.id === childId)
    } else {
      return null
    }
  }

  return (
    <div>
      {permissions.map((item) => (
        <Accordion
          square
          expanded={expanded === item.id}
          onChange={handleChange(item.id)}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <div className="flex items-center">
              <div className="w-5 h-5 mr-3 border rounded-full flex justify-center items-center">
                <KeyboardArrowDownIcon
                  style={{
                    color: "var(--color-primary)",
                    transform: `rotate(${
                      expanded === item.id ? "0deg" : "-90deg"
                    })`,
                  }}
                  fontSize="small"
                />
              </div>

              <span className="text-sm font-normal">{item.name}</span>
            </div>
            <div
              className={`w-5 h-5 rounded border ${
                checkedPermissions.find((data) => data.id === item.id)
                  ? "border-blue-600"
                  : "border-gray-400"
              } flex justify-center items-center`}
              onClick={(e) => {
                e.stopPropagation()
                onChangePermissions(item.id, null, actionData)
              }}
            >
              {checkedPermissions.find((data) => data.id === item.id) && (
                <div className={`w-3 h-3 rounded-sm bg-blue-600`} />
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            {item?.actions.map((val) => (
              <div
                className="flex py-3 items-center justify-between pl-12 pr-3"
                style={{
                  boxShadow: "inset 0px -1px 0px #E5E9EB",
                  pointerEvents: checkedPermissions.find(
                    (data) => data.id === item.id
                  )
                    ? "initial"
                    : "none",
                  opacity: checkedPermissions.find(
                    (data) => data.id === item.id
                  )
                    ? 1
                    : 0.5,
                }}
              >
                <div className="flex items-center text-sm">{val.name}</div>
                <div
                  className={`w-5 h-5 rounded border cursor-pointer ${
                    findChildPermission(item.id, val.id)
                      ? "border-blue-600"
                      : "border-gray-400"
                  } flex justify-center items-center`}
                  onClick={() => onChangePermissions(item.id, val, actionData)}
                >
                  {findChildPermission(item.id, val.id) && (
                    <div className={`w-3 h-3 rounded-sm bg-blue-600`} />
                  )}
                </div>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
