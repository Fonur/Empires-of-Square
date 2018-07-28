var selections = [];

const multipleSelect = (clicked) => {
  selections.push(clicked);
  return selections;
}

module.exports.multipleSelect = multipleSelect;