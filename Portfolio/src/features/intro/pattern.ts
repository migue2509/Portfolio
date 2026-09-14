export const COLUMNS = 50;
export const ROWS = 7;

const letters = [
  ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  ['1', '1', '1', '1', '1', '0', '1'],
  ['1', '1', '1', '1', '1', '0', '1'],
];
const messageWidth = letters.reduce((width, letter) => width + letter[0].length, 0)
  + (letters.length - 1) * 2;
const offset = Math.floor((COLUMNS - messageWidth) / 2);

export const cells = Array.from({ length: COLUMNS * ROWS }, (_, index) => {
  const row = Math.floor(index / COLUMNS);
  const column = index % COLUMNS;
  let cursor = offset;
  let lit = false;
  for (const letter of letters) {
    if (letter[row][column - cursor] === '1') lit = true;
    cursor += letter[0].length + 2;
  }
  return { lit, column, row, tone: (column + row) % 3 };
});
