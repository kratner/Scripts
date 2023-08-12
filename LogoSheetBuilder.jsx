#target illustrator

// Specify the layout parameters
var sheetWidth = 600; // Width of the logo sheet in points
var sheetHeight = 800; // Height of the logo sheet in points
var logoSize = 100; // Size of each logo in points
var logoSpacing = 20; // Spacing between logos in points
var numRows = 4; // Number of rows
var numCols = 3; // Number of columns

// Prompt user to select the company logo
var companyLogoFile = File.openDialog("Select the company logo SVG file");
if (companyLogoFile === null) {
  alert("No company logo selected. Script execution aborted.");
  exit();
}

// Prompt user to select the folder containing other logos
var otherLogosFolder = Folder.selectDialog("Select the folder containing other logos");
if (otherLogosFolder === null) {
  alert("No folder selected. Script execution aborted.");
  exit();
}

// Create a new document
var doc = app.documents.add(DocumentColorSpace.RGB, sheetWidth, sheetHeight);

// Place the company logo
var companyLogo = doc.placedItems.add();
companyLogo.file = companyLogoFile;
companyLogo.width = logoSize;
companyLogo.height = logoSize;
companyLogo.left = logoSpacing;
companyLogo.top = logoSpacing;

// Iterate through other logos in the folder
var logoFiles = otherLogosFolder.getFiles("*.svg");

for (var i = 0; i < logoFiles.length; i++) {
  var logo = doc.placedItems.add();
  logo.file = logoFiles[i];
  logo.width = logoSize;
  logo.height = logoSize;

  var row = Math.floor(i / numCols);
  var col = i % numCols;

  logo.left = logoSpacing + col * (logoSize + logoSpacing);
  logo.top = logoSpacing + (row + 1) * (logoSize + logoSpacing);
}

// Save the document
var savePath = "path/to/save/the/logo-sheet.pdf";
var saveOptions = new PDFSaveOptions();
doc.saveAs(new File(savePath), saveOptions);

// Close the document
doc.close(SaveOptions.DONOTSAVECHANGES);
