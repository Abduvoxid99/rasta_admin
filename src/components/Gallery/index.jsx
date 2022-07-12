import "./style.scss"
import { useState, useRef, useMemo } from "react"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import ImageViewer from "react-simple-image-viewer"
import axios from "../../utils/axios"
import { CircularProgress } from "@material-ui/core"
import CancelIcon from "@material-ui/icons/Cancel"
import { useDispatch } from "react-redux"
import { showAlert } from "../../redux/reducers/alertReducer"

const Gallery = ({
  gallery = [],
  setGallery,
  notEditable,
  multiple = true,
  width = 140,
  height = 90,
  aspectRatio,
  rounded = false,
  accept = "",
  resolution,
  format,
  disabled = false,
  errorFormatText,
}) => {
  const inputRef = useRef(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const dispatch = useDispatch()
  const isShow = useMemo(
    () => (multiple ? true : !gallery.length),
    [gallery, multiple]
  )
  const imageLinks = useMemo(() => {
    return gallery?.map((image) => `${process.env.MINIO_BASE_URL}${image}`)
  }, [gallery])

  const [loading, setLoading] = useState(false)

  const addNewImage = (image) => {
    setGallery([...gallery, image])
  }

  const imageClickHandler = (index) => {
    setSelectedImageIndex(index)
    setPreviewVisible(true)
  }

  const inputChangeHandler = (e) => {
    const file = e.target.files[0]
    if (format && !file.type.includes(format)) {
      return dispatch(showAlert(errorFormatText))
    }
    setLoading(true)
    const data = new FormData()
    data.append("file", file)
    axios
      .post("/upload", data, {
        headers: {
          "Content-Type": "mulpipart/form-data",
        },
      })
      .then((res) => {
        addNewImage(res.filename)
      })
      .finally(() => setLoading(false))
  }

  const deleteImage = (id) => {
    setGallery(gallery.filter((galleryImageId) => galleryImageId !== id))
  }

  const closeButtonHandler = (e, link) => {
    e.stopPropagation()
    deleteImage(link.replace(`${process.env.MINIO_BASE_URL}`, ""))
  }

  return (
    <div
      className={`Gallery ${
        disabled ? "opacity-80 cursor-not-allowed" : "cursor-pointer"
      } `}
    >
      {imageLinks?.map((link, index) => (
        <div
          className="block"
          key={link}
          style={
            aspectRatio
              ? { width, aspectRatio, borderRadius: rounded ? "50%" : 8 }
              : { width, height, borderRadius: rounded ? "50%" : 8 }
          }
          onClick={() => imageClickHandler(index)}
        >
          {!notEditable && (
            <button
              className="close-btn"
              onClick={(e) => closeButtonHandler(e, link)}
            >
              <CancelIcon />
            </button>
          )}
          <img src={link} alt="" />
        </div>
      ))}

      {!notEditable && isShow && (
        <div
          className="add-block block"
          style={
            aspectRatio
              ? { width, aspectRatio, borderRadius: rounded ? "50%" : 8 }
              : { width, height, borderRadius: rounded ? "50%" : 8 }
          }
          onClick={() => inputRef.current.click()}
        >
          <div className="add-icon">
            {!loading ? (
              <>
                <AddCircleOutlineIcon style={{ fontSize: "35px" }} />
                {resolution && (
                  <span className="text-md mt-1 font-medium">{resolution}</span>
                )}
                <p className="text-sm font-medium">Max size: 1 MB</p>
              </>
            ) : (
              <CircularProgress />
            )}
          </div>

          <input
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={inputChangeHandler}
            accept={accept}
          />
        </div>
      )}

      {previewVisible && (
        <ImageViewer
          style={{ zIndex: 100000, width, height }}
          src={imageLinks}
          currentIndex={selectedImageIndex}
          disableScroll={true}
          onClose={() => setPreviewVisible(false)}
          zIndex={2}
        />
      )}
    </div>
  )
}

export default Gallery
