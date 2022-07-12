import { useState } from "react"
import CloseIcon from "@material-ui/icons/Close"

export default function Tag({
  children,
  icon: Icon,
  className = "",
  color = "blue",
  loading = false,
  disabled,
  shape = "filled",
  removable = false,
  size = "medium",
  textStyle,
  childrenClass = "",
  clearFc,
  ...rest
}) {
  const [isClicked, setIsClicked] = useState(false)
  const textColors = (key) => `text-${key}-600`
  const getSize = (key) => {
    switch (key) {
      case "small":
        return {
          size: "px-1",
          fontSize: "text-xs",
          radius: "rounded",
        }
      case "medium":
        return {
          size: "px-3",
          fontSize: "text-md",
          radius: "rounded-md",
        }
      case "large":
        return {
          size: "px-3 py-1",
          fontSize: "text-md",
          radius: "rounded-md",
        }

      default:
        break
    }
  }

  const getShape = (key) => {
    switch (key) {
      case "filled":
        return {
          color: `${"bg-" + color + "-100"} iconColor-filled ${textColors(
            color
          )}`,
          background: "",
        }
      case "outlined":
        return {
          color: `bg-transparent ${textColors(color)} border ${
            "border-" + color + "-600"
          }`,
        }
      case "subtle":
        return {
          color: `${"bg-" + color + "-100"} ${textColors(color)}`,
        }

      default:
        return { color: "iconColor-filled" }
    }
  }

  return (
    !isClicked && (
      <div
        className={`
          flex
          focus:outline-none
          transition
          justify-center
          text-white
          ${children ? "" : "w-9 h-9"}
          focus:ring focus:border-blue-300 
          ${getSize(size).size}
          ${getSize(size).radius}
          ${disabled ? "bg-gray-200 cursor-not-allowed" : getShape(shape).color}
          ${className}
        `}
        {...rest}
      >
        <div
          className={`flex  items-center w-full ${
            children ? "space-x-1" : ""
          } font-medium`}
        >
          {Icon && <Icon style={{ fontSize: "18px" }} />}

          <div
            className={`${
              getSize(size).fontSize
            } ${childrenClass} w-full text-center`}
            style={textStyle}
          >
            {children}
          </div>
          {removable && (
            <CloseIcon
              style={{ fontSize: "14px" }}
              className="cursor-pointer clear-animation"
              onClick={() => clearFc() || setIsClicked((prev) => !prev)}
            />
          )}
        </div>
      </div>
    )
  )
}
