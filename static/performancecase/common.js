//选择一条记录
function getSelectedRow() {
  var grid = $("#jqGrid");
  var rowKey = grid.getGridParam("selrow");
  if (!rowKey) {
    alert("请选择一条记录");
    return;
  }

  var selectedIDs = grid.getGridParam("selarrrow");
  if (selectedIDs.length > 1) {
    alert("只能选择一条记录");
    return;
  }

  return selectedIDs[0];
}

//选择多条记录
function getSelectedRows() {
  var grid = $("#jqGrid");
  var rowKey = grid.getGridParam("selrow");
  if (!rowKey) {
    alert("请选择一条记录");
    return;
  }

  return grid.getGridParam("selarrrow");
}
