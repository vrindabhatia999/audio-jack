export const getBgColors = (tracksLength) => {
  let arr = [];
  for (let i = 0; i < tracksLength; i++) {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    let proper_clr = '#' + randomColor;
    arr.push(proper_clr);
  }

  return arr;
};
