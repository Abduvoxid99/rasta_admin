import React, { useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"
import { useHistory, useParams } from "react-router-dom"
import { Input } from "alisa-ui"

//components and functions
import Form from "../../components/Form/Index"
import Breadcrumb from "../../components/Breadcrumb"
import Header from "../../components/Header"
import Card from "../../components/Card"
import Button from "../../components/Button"
import Select from "../../components/Select"
import {
  getPermissions,
  getUserRolesOne,
  getUserRolesOnePermissions,
  savePermissions,
  saveUserRoles,
  updateUserRoles,
} from "../../services/userRoles"
import CancelIcon from "@material-ui/icons/Cancel"
import SaveIcon from "@material-ui/icons/Save"
import CustomSkeleton from "../../components/Skeleton"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import Permission from "./Permission"

export default function CreateOperator() {
  const history = useHistory()
  const { id } = useParams()
  const { t } = useTranslation()
  const [saveLoading, setSaveLoading] = useState(false)
  const [loader, setLoader] = useState(true)
  const [permissions, setPermissions] = useState([])
  const [checkedPermissions, setCheckedPermissions] = useState([])
  const [checkedPermissions2, setCheckedPermissions2] = useState([])
  const [checkedPermissions3, setCheckedPermissions3] = useState([])
  const [changed, setChanged] = useState(false)
  const [all, setAll] = useState(false)
  const [all2, setAll2] = useState(false)
  const systemUsers = [
    {
      label: "Пользователи админ панели",
      value: "87efc3a9-9d95-47a3-ad9d-53ee93446fea",
    },
    {
      label: "Пользователи филиала",
      value: "195899b2-bd4d-4c51-a09e-c66b9a6bd22a",
    },
  ]

  const getItem = () => {
    if (!id) return setLoader(false)
    setLoader(true)
    getUserRolesOne(id)
      .then((res) => {
        formik.setValues({
          name: res.name,
          user_type: systemUsers.find(
            (item) => item.value === res.user_type_id
          ),
        })
      })
      .finally(() => setLoader(false))
  }

  useEffect(() => {
    getItem()
    getPermissions({ limit: 1000 }).then((res) => {
      setPermissions([...res.permissions])
      if (id) {
        getUserRolesOnePermissions(id).then((result) => {
          setCheckedPermissions([...result.permissions])
        })
      }
    })
  }, [])

  useEffect(() => {
    if (permissions.length > 0 && id && !changed) {
      setChanged((prev) => !prev)
      replacePermisssion("forward")
    }
  }, [checkedPermissions])

  const initialValues = useMemo(
    () => ({
      name: "",
      user_type: null,
    }),
    []
  )

  const onChangePermissions = (parentId, childItem, actionData) => {
    if (actionData === "forward") {
      setAll(false)
    } else {
      setAll2(false)
    }
    const permissionData =
      actionData === "forward"
        ? checkedPermissions.find((item) => item.id === parentId)
        : checkedPermissions3.find((item) => item.id === parentId)
    if (permissionData && !childItem) {
      if (actionData === "forward") {
        setCheckedPermissions((prev) =>
          prev.filter((val) => val.id !== parentId)
        )
      } else {
        setCheckedPermissions3((prev) =>
          prev.filter((val) => val.id !== parentId)
        )
      }
    } else if (permissionData && childItem.id) {
      const childData = permissionData.actions.find(
        (val) => val.id === childItem.id
      )
      if (childData) {
        const newChildData = permissionData.actions.filter(
          (val) => val.id !== childItem.id
        )
        permissionData.actions = newChildData
      } else {
        permissionData.actions.push(childItem)
      }
      const newPermissions = []
      const values =
        actionData === "forward" ? checkedPermissions : checkedPermissions3
      values.forEach((value) => {
        if (value.id === permissionData.id) {
          if (permissionData.actions.length > 0)
            newPermissions.push(permissionData)
        } else {
          newPermissions.push(value)
        }
      })

      if (actionData === "forward") {
        setCheckedPermissions([...newPermissions])
      } else {
        setCheckedPermissions3([...newPermissions])
      }
    } else {
      const perData =
        actionData === "forward"
          ? permissions.find((val) => val.id === parentId)
          : checkedPermissions2.find((val) => val.id === parentId)
      if (actionData === "forward") {
        setCheckedPermissions((prev) => [
          ...prev,
          {
            ...perData,
          },
        ])
      } else {
        setCheckedPermissions3((prev) => [
          ...prev,
          {
            ...perData,
          },
        ])
      }
    }
  }

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"))
    return yup.object().shape({
      name: defaultSchema,
    })
  }, [])

  const saveChanges = (data) => {
    setSaveLoading(true)
    const selectedAction = id ? updateUserRoles(id, data) : saveUserRoles(data)
    selectedAction
      .then((res) => {
        savePermissions(res.id || id, {
          permissions: checkedPermissions2.map((item) => ({
            id: item.id,
            action_ids: item.actions.map((val) => val.id),
          })),
        }).then(() => {
          window.location.href = "/"
        })
      })
      .finally(() => setSaveLoading(false))
  }

  const onSubmit = (values) => {
    const data = {
      ...values,
      user_type_id: values.user_type.value,
    }
    data.shipper_id = "36b00947-ad7a-40eb-b7ca-1c0ea267f2ac"
    delete data.user_type
    saveChanges(data)
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  })

  const replacePermisssion = (action, permissionData) => {
    const checkedPer =
      action === "forward" ? [...checkedPermissions2] : [...permissions]
    const newPermissions = []
    let permission = null
    let values =
      action === "forward" ? [...permissions] : [...checkedPermissions2]

    values.forEach((item) => {
      permission =
        action === "forward"
          ? checkedPermissions.find((val) => val.id === item.id)
          : checkedPermissions3.find((val) => val.id === item.id)
      if (permission) {
        if (checkedPer.find((val) => val.id === permission.id)) {
          checkedPer.forEach((el) => {
            if (el.id === permission.id) {
              el.actions = [...el.actions, ...permission.actions]
              if (permission.actions && permission.actions.length === 4) {
                checkedPer.push({
                  ...item,
                })
              } else {
                let uniqueResultArrayObjOne = item.actions.filter(function (
                  objOne
                ) {
                  return !permission.actions.some(function (objTwo) {
                    return objOne.id == objTwo.id
                  })
                })
                if (uniqueResultArrayObjOne.length > 0) {
                  newPermissions.push({
                    ...item,
                    actions: uniqueResultArrayObjOne,
                  })
                }
              }
            }
          })
        } else {
          if (permission.actions && permission.actions.length === 4) {
            checkedPer.push({
              ...item,
            })
          } else {
            let uniqueResultArrayObjOne = item.actions.filter(function (
              objOne
            ) {
              return !permission.actions.some(function (objTwo) {
                return objOne.id == objTwo.id
              })
            })
            checkedPer.push({
              ...item,
              actions: permission.actions,
            })
            if (uniqueResultArrayObjOne.length !== 0) {
              newPermissions.push({
                ...item,
                actions: uniqueResultArrayObjOne,
              })
            }
          }
        }
      } else {
        newPermissions.push(item)
      }
      permission = null
    })
    if (action === "forward") {
      console.log("newPermissions", newPermissions)
      setCheckedPermissions2([...checkedPer])
      setPermissions([...newPermissions])
      setCheckedPermissions([])
      setAll(false)
    } else {
      setCheckedPermissions2([...newPermissions])
      setPermissions([...checkedPer])
      setCheckedPermissions3([])
      setAll2(false)
    }
  }

  if (loader) return <CustomSkeleton />

  const routes = [
    {
      title: t("role"),
      link: true,
      route: `/home/settings/role/list`,
    },
    {
      title: id ? formik.values?.name : t("create"),
    },
  ]

  const { values, handleChange, setFieldValue, handleSubmit } = formik

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          endAdornment={[
            <Button
              icon={CancelIcon}
              size="large"
              shape="outlined"
              color="red"
              borderColor="bordercolor"
              onClick={(e) => history.go(-1)}
            >
              {t("cancel")}
            </Button>,
            <Button
              icon={SaveIcon}
              size="large"
              type="submit"
              loading={saveLoading}
            >
              {t(id ? "save" : "create")}
            </Button>,
          ]}
        />

        <div className="p-4">
          <div className="w-full grid grid-cols-12 gap-4">
            <Card title={t("Общее")} className="col-span-12">
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <Form.Item label={t("name")} formik={formik} name="name">
                    <Input
                      size="large"
                      id="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    label={t("Тип пользователя")}
                    formik={formik}
                    name="user_roles"
                  >
                    <Select
                      height={40}
                      id="user_type"
                      placeholder="Тип пользователя"
                      options={systemUsers}
                      value={values.user_type}
                      onChange={(val) => setFieldValue("user_type", val)}
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>

            <Card
              title={t("permission")}
              className="col-span-12 rounded-md overflow-hidden"
              bodyStyle={{
                padding: 0,
              }}
            >
              <div className="flex w-full justify-between">
                <div className="border-r" style={{ width: "48%" }}>
                  <div className="p-3 border-b flex justify-between items-center">
                    Все доступы
                    <div
                      className={`w-5 h-5 rounded border ${
                        all ? "border-blue-600" : "border-gray-400"
                      } flex justify-center items-center cursor-pointer`}
                      onClick={(e) => {
                        if (permissions.length > 0) {
                          if (all) {
                            setCheckedPermissions([])
                          } else {
                            setCheckedPermissions([...permissions])
                          }
                          setAll((prev) => !prev)
                        }
                      }}
                    >
                      {all && (
                        <div className={`w-3 h-3 rounded-sm bg-blue-600`} />
                      )}
                    </div>
                  </div>
                  <Permission
                    permissions={permissions}
                    onChangePermissions={onChangePermissions}
                    checkedPermissions={checkedPermissions}
                  />
                </div>
                <div
                  className="flex items-center justify-center border-b"
                  style={{ width: "4%" }}
                >
                  <div>
                    <div
                      className={`w-8  ${
                        !checkedPermissions.length > 0
                          ? "text-blue-600 pointer-events-none"
                          : "text-white bg-blue-600"
                      } cursor-pointer h-8 flex items-center justify-center border border-bordercolor rounded-md mb-3`}
                      onClick={() => replacePermisssion("forward")}
                      id="button-forward"
                    >
                      <ArrowForwardIcon fontSize="small" />
                    </div>
                    <div
                      className={`w-8   ${
                        !checkedPermissions3.length > 0
                          ? "text-blue-600 pointer-events-none"
                          : "text-white bg-blue-600"
                      } cursor-pointer h-8 flex items-center justify-center border border-bordercolor rounded-md`}
                      onClick={() => replacePermisssion("back")}
                    >
                      <ArrowBackIcon fontSize="small" />
                    </div>
                  </div>
                </div>
                <div className="border-l" style={{ width: "48%" }}>
                  <div className="p-3 border-b flex justify-between items-center">
                    Пользовательский доступ
                    <div
                      className={`w-5 h-5 rounded border ${
                        all ? "border-blue-600" : "border-gray-400"
                      } flex justify-center items-center cursor-pointer`}
                      onClick={(e) => {
                        if (checkedPermissions2.length > 0) {
                          if (all2) {
                            setCheckedPermissions3([])
                          } else {
                            setCheckedPermissions3([...checkedPermissions2])
                          }
                          setAll2((prev) => !prev)
                        }
                      }}
                    >
                      {all2 && (
                        <div className={`w-3 h-3 rounded-sm bg-blue-600`} />
                      )}
                    </div>
                  </div>
                  <Permission
                    permissions={checkedPermissions2}
                    onChangePermissions={onChangePermissions}
                    checkedPermissions={checkedPermissions3}
                    actionData="back"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
