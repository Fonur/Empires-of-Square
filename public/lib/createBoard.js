const createBoard = () => {
  for (var i = 0; i < 16; i++) {
    var tr = document.createElement('tr');
    arena.insertAdjacentElement('beforeend', tr);
    for (var j = 0; j < 16; j++) {
      var td = document.createElement('td');
      td.setAttribute("id", `${i}${j}`);
      tr.insertAdjacentElement('beforeend', td);
    }
  }
}
