#target illustrator

var docRef = app.activeDocument;

var kr_rename_dlg = new Window("dialog", "Bulk Rename Artboards");

kr_rename_dlg.orientation = "column";

var headingGrp = kr_rename_dlg.add("group", undefined, "");
headingGrp.orientation = "column";

// Create a text frame
var textFrame = headingGrp.add("statictext", undefined, "", { multiline: true });
textFrame.size = [280, 20]; // Adjust the size of the text frame

// Set the contents (text) of the text frame
textFrame.text = "Please enter your search and replace criteria.";

// SEARCH GRP
var searchGrp = kr_rename_dlg.add("group", undefined, "");
searchGrp.orientation = "row";

var searchSt = searchGrp.add("statictext", undefined, "Search:");
searchSt.size = [60, 20];


var searchEt = searchGrp.add("edittext", undefined, "", {
  multiline: false,
});
searchEt.size = [200, 20];

// REPLACE GRP
var replaceGrp = kr_rename_dlg.add("group", undefined, "");
replaceGrp.orientation = "row";

var replaceSt = replaceGrp.add("statictext", undefined, "Replace:");
replaceSt.size = [60, 20];

var replaceEt = replaceGrp.add("edittext", undefined, "", {
  multiline: false,
});
replaceEt.size = [200, 20];

kr_rename_dlg.btnPnl = kr_rename_dlg.add("group", undefined, "");
kr_rename_dlg.btnPnl.orientation = "row";

kr_rename_dlg.btnPnl.cancelBtn = kr_rename_dlg.btnPnl.add(
  "button",
  undefined,
  "Cancel",
  { name: "cancel" }
);
kr_rename_dlg.btnPnl.cancelBtn.onClick = function () {
  kr_rename_dlg.close();
};

kr_rename_dlg.btnPnl.okBtn = kr_rename_dlg.btnPnl.add(
  "button",
  undefined,
  "Rename",
  { name: "ok" }
);
kr_rename_dlg.btnPnl.okBtn.onClick = function () {
  var searchPattern = new RegExp(searchEt.text, "g");
  var replaceText = replaceEt.text;

  for (var i = 0; i < docRef.artboards.length; i++) {
    var artboard = docRef.artboards[i];
    var artboardName = artboard.name;
    var newName = artboardName.replace(searchPattern, replaceText);
    artboard.name = newName;
  }

  kr_rename_dlg.close();
};

kr_rename_dlg.show();
