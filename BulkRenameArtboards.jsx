#target illustrator

var docRef = app.activeDocument;

var nyt_rename_dlg = new Window("dialog", "Bulk Rename Artboards");

nyt_rename_dlg.orientation = "column";

// SEARCH GRP
var searchGrp = nyt_rename_dlg.add("group", undefined, "");
searchGrp.orientation = "row";

var searchSt = searchGrp.add("statictext", undefined, "Search:");
searchSt.size = [60, 20];

var searchEt = searchGrp.add("edittext", undefined, "", {
  multiline: false,
});
searchEt.size = [200, 20];

// REPLACE GRP
var replaceGrp = nyt_rename_dlg.add("group", undefined, "");
replaceGrp.orientation = "row";

var replaceSt = replaceGrp.add("statictext", undefined, "Replace:");
replaceSt.size = [60, 20];

var replaceEt = replaceGrp.add("edittext", undefined, "", {
  multiline: false,
});
replaceEt.size = [200, 20];

nyt_rename_dlg.btnPnl = nyt_rename_dlg.add("group", undefined, "");
nyt_rename_dlg.btnPnl.orientation = "row";

nyt_rename_dlg.btnPnl.cancelBtn = nyt_rename_dlg.btnPnl.add(
  "button",
  undefined,
  "Cancel",
  { name: "cancel" }
);
nyt_rename_dlg.btnPnl.cancelBtn.onClick = function () {
  nyt_rename_dlg.close();
};

nyt_rename_dlg.btnPnl.okBtn = nyt_rename_dlg.btnPnl.add(
  "button",
  undefined,
  "Rename",
  { name: "ok" }
);
nyt_rename_dlg.btnPnl.okBtn.onClick = function () {
  var searchPattern = new RegExp(searchEt.text, "g");
  var replaceText = replaceEt.text;

  for (var i = 0; i < docRef.artboards.length; i++) {
    var artboard = docRef.artboards[i];
    var artboardName = artboard.name;
    var newName = artboardName.replace(searchPattern, replaceText);
    artboard.name = newName;
  }

  nyt_rename_dlg.close();
};

nyt_rename_dlg.show();
