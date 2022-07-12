import { defineCount, reorder } from "../utils"
import { statusId, statusList } from "./orderTestMockData"

describe("check order functionality", () => {
  it("check function defineCount", () => {
    expect(defineCount(statusId, statusList)).toBe(false)
    expect(defineCount(statusId.split(",")[1], statusList)).toBe("1")
    expect(defineCount().length).toBe(0)
    expect(
      defineCount(
        `${statusId.split(",")[0]},${statusId.split(",")[1]}`,
        statusList
      )
    ).toBe(4)
  })

  it("check function reorder", () => {
    expect(reorder(["test1", "test2", "test3", "test4"], 1, 2)).toEqual([
      "test1",
      "test3",
      "test2",
      "test4",
    ])
    expect(reorder(["test1", "test2", "test3", "test4"], 1, null)).toEqual([
      "test1",
      "test2",
      "test3",
      "test4",
    ])
    expect(reorder(null, 1, 2).length).toEqual(0)
    expect(reorder().length).toEqual(0)
  })
})
