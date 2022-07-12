/* eslint-disable no-unused-vars */
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import Card from "../../components/Card"
import { makeStyles } from "@material-ui/core/styles"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import DragIndicatorIcon from "@material-ui/icons/DragIndicator"
import CallIcon from "@material-ui/icons/Call"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: 12,

    boxShadow: "none",
    "&:before": {
      display: "none",
    },
    "&.Mui-expanded": {
      background:
        "linear-gradient(0deg, rgba(110, 139, 183, 0.18), rgba(110, 139, 183, 0.18)), #FFFFFF",
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  summary: {
    height: "40px!important",
    minHeight: "40px!important",
    borderRadius: "6px 6px 0px 0px",
    padding: "8px 12px",
  },
  details: {
    padding: 0,
  },
}))

const RightContent = () => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <div>
      <Card headerClass="py-3.5" title="Блок курьеров">
        <div className="grid grid-cols-3 mb-3">
          <div className="flex items-center flex-col">
            <div className="text-xl font-bold">35</div>
            <div className="text-sm mt-2">Завершенные</div>
          </div>
          <div className="flex items-center flex-col">
            <div className="text-xl font-bold">35</div>
            <div className="text-sm mt-2">Всего</div>
          </div>
          <div className="flex items-center flex-col">
            <div className="text-xl font-bold">35</div>
            <div className="text-sm mt-2">В пути</div>
          </div>
        </div>
        <div>
          <Accordion className={classes.root}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "#6E8BB7" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={classes.summary}
            >
              <Typography className={classes.heading}>Сайрам</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <div
                style={{ background: "#f8fafc" }}
                className="py-2 px-3 w-full flex items-center justify-between"
              >
                <div className="text-secondary flex items-center">
                  <DragIndicatorIcon
                    className="cursor-pointer"
                    style={{ color: "#B0BABF;" }}
                  />
                  <span className="ml-2">1. Бекзод</span>
                </div>
                <div className="flex items-center">
                  <span className="text-secondary mr-3">5</span>
                  <span className="text-red-500 mr-3">3</span>
                  <span className="cursor-pointer">
                    <CallIcon style={{ color: "#0D9676" }} />
                  </span>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion className={classes.root}>
            <AccordionSummary
              className={classes.summary}
              expandIcon={<ExpandMoreIcon style={{ color: "#6E8BB7" }} />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>Сайрам 2</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <div
                style={{ background: "#f8fafc" }}
                className="py-2 px-3 w-full flex items-center justify-between"
              >
                <div className="text-secondary flex items-center">
                  <DragIndicatorIcon
                    className="cursor-pointer"
                    style={{ color: "#B0BABF;" }}
                  />
                  <span className="ml-2">1. Бекзод</span>
                </div>
                <div className="flex items-center">
                  <span className="text-secondary mr-3">5</span>
                  <span className="text-red-500 mr-3">3</span>
                  <span className="cursor-pointer">
                    <CallIcon style={{ color: "#0D9676" }} />
                  </span>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </Card>
    </div>
  )
}

export default RightContent
