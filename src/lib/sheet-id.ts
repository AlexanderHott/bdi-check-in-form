export function columnNumberToLetter(colNum: number) {
  let letter = "";
  while (colNum > 0) {
    const mod = (colNum - 1) % 26;

    letter = String.fromCharCode("A".charCodeAt(0) + mod) + letter;
    colNum = Math.floor((colNum - 1) / 26);
  }
  return letter;
}

export function buildSheetId(
  sheetName: string,
  row: number,
  fieldCount: number,
) {
  const letters = columnNumberToLetter(fieldCount);
  const rowIndex = row + 1;
  return `${sheetName}!A${String(rowIndex)}:${letters}${String(rowIndex)}`;
}
