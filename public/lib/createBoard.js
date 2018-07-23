const createBoard = () => {
  for (var i = 0; i < 18; i++) {
    var tr = document.createElement('tr');
    arena.insertAdjacentElement('beforeend', tr);
    for (var j = 0; j < 18; j++) {
      var td = document.createElement('td');
      td.setAttribute("id", `${i}${j}`);
      td.setAttribute("style", "background: rgb(230, 198, 111);");
      tr.insertAdjacentElement('beforeend', td);
    }
  }
}