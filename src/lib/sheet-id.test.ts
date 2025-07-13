import { describe, expect, test } from "vitest";

import { buildSheetId, columnNumberToLetter } from "./sheet-id";

describe.each([
  {
    colNum: 1,
    colStr: "A",
  },
  {
    colNum: 2,
    colStr: "B",
  },
  {
    colNum: 27,
    colStr: "AA",
  },
  {
    colNum: 28,
    colStr: "AB",
  },
  {
    colNum: 702,
    colStr: "ZZ",
  },
  {
    colNum: 703,
    colStr: "AAA",
  },
])("columnNumberToLetter", ({ colNum, colStr }) => {
  test(`${String(colNum)} is ${colStr}`, () => {
    expect(columnNumberToLetter(colNum)).toBe(colStr);
  });
});

describe.each([
  {
    sheetName: "test",
    row: 0,
    fieldCount: 1,
    sheetId: "test!A1:A1",
  },
  {
    sheetName: "test",
    row: 0,
    fieldCount: 2,
    sheetId: "test!A1:B1",
  },
  {
    sheetName: "test",
    row: 0,
    fieldCount: 27,
    sheetId: "test!A1:AA1",
  },
  {
    sheetName: "test",
    row: 42,
    fieldCount: 2,
    sheetId: "test!A43:B43",
  },
])("buildSheetId", ({ sheetName, row, fieldCount, sheetId }) => {
  test(`${sheetName},${String(row)},${String(fieldCount)} is ${sheetId}:`, () => {
    expect(buildSheetId(sheetName, row, fieldCount)).toBe(sheetId);
  });
});
