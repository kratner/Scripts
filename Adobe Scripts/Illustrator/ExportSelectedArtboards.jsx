// Adobe Illustrator Export Script

// Custom trim function
function customTrim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}

// Function to show dialog and get user input
function showDialog() {
  var doc = app.activeDocument;
  var dialog = new Window("dialog", "Export Artboards");
  dialog.orientation = "column";
  dialog.alignChildren = ["left", "top"];
  dialog.spacing = 10;
  dialog.margins = 16;

  // File name input
  var fileNameGroup = dialog.add("group");
  fileNameGroup.add("statictext", undefined, "File Name:");
  var fileNameInput = fileNameGroup.add("edittext", undefined, "");
  fileNameInput.characters = 20;

  // Save location input
  var locationGroup = dialog.add("group");
  locationGroup.add("statictext", undefined, "Save Location:");
  var locationInput = locationGroup.add("edittext", undefined, "");
  locationInput.characters = 35;
  var browseButton = locationGroup.add("button", undefined, "Browse");

  browseButton.onClick = function () {
    var folder = Folder.selectDialog(
      "Choose a folder to save the exported files"
    );
    if (folder) {
      locationInput.text = folder.fsName;
    }
  };

  // File format selection
  var formatGroup = dialog.add("group");
  formatGroup.add("statictext", undefined, "Format:");
  var formatDropdown = formatGroup.add("dropdownlist", undefined, [
    "PDF",
    "JPG",
    "PNG",
  ]);
  formatDropdown.selection = 0;

  // Artboard selection method
  var selectionMethodGroup = dialog.add("group");
  selectionMethodGroup.add("statictext", undefined, "Select artboards using:");
  var listRadio = selectionMethodGroup.add("radiobutton", undefined, "List");
  var rangeRadio = selectionMethodGroup.add("radiobutton", undefined, "Range");
  listRadio.value = true;

  // Artboard list selection
  var listGroup = dialog.add("group");
  listGroup.orientation = "column";
  listGroup.add("statictext", undefined, "Select artboards:");
  var artboardList = listGroup.add("listbox", [0, 0, 300, 150], [], {
    multiselect: true,
  });

  for (var i = 0; i < doc.artboards.length; i++) {
    artboardList.add("item", i + 1 + ": " + doc.artboards[i].name);
  }

  // Select/Deselect All buttons
  var selectButtonsGroup = dialog.add("group");
  var selectAllButton = selectButtonsGroup.add(
    "button",
    undefined,
    "Select All"
  );
  var deselectAllButton = selectButtonsGroup.add(
    "button",
    undefined,
    "Deselect All"
  );

  selectAllButton.onClick = function () {
    for (var i = 0; i < artboardList.items.length; i++) {
      artboardList.items[i].selected = true;
    }
    validateDialog();
  };

  deselectAllButton.onClick = function () {
    for (var i = 0; i < artboardList.items.length; i++) {
      artboardList.items[i].selected = false;
    }
    validateDialog();
  };

  // Artboard range input
  var rangeGroup = dialog.add("group");
  rangeGroup.add("statictext", undefined, "Artboard range (e.g., 1,3-5):");
  var rangeInput = rangeGroup.add("edittext", undefined, "");
  rangeInput.characters = 20;
  rangeGroup.visible = false;

  // Toggle visibility based on selection method
  listRadio.onClick = function () {
    listGroup.visible = true;
    selectButtonsGroup.visible = true;
    rangeGroup.visible = false;
    validateDialog();
  };
  rangeRadio.onClick = function () {
    listGroup.visible = false;
    selectButtonsGroup.visible = false;
    rangeGroup.visible = true;
    validateDialog();
  };

  // Buttons
  var buttonGroup = dialog.add("group");
  buttonGroup.alignment = "center";
  var okButton = buttonGroup.add("button", undefined, "OK");
  var cancelButton = buttonGroup.add("button", undefined, "Cancel");

  // Status text
  var statusText = dialog.add("statictext", undefined, "");
  statusText.characters = 35;

  // Validation function
  function validateDialog() {
    var artboardsSelected = false;

    if (
      listRadio &&
      listRadio.value &&
      artboardList &&
      artboardList.selection
    ) {
      artboardsSelected = artboardList.selection.length > 0;
    } else if (rangeRadio && rangeRadio.value && rangeInput) {
      artboardsSelected = customTrim(rangeInput.text) !== "";
    }

    if (okButton) {
      okButton.enabled = artboardsSelected;
    }

    if (statusText) {
      statusText.text = artboardsSelected
        ? "Ready to export"
        : "Please select artboards";
    }
  }

  // Add change event listeners
  if (artboardList) {
    artboardList.onChange = validateDialog;
  }
  if (rangeInput) {
    rangeInput.onChanging = validateDialog;
  }

  // Initial validation
  validateDialog();

  // Show dialog
  if (dialog.show() == 1) {
    var selectedArtboards = [];
    if (listRadio.value) {
      for (var i = 0; i < artboardList.selection.length; i++) {
        var index = parseInt(artboardList.selection[i].text.split(":")[0]) - 1;
        selectedArtboards.push(index);
      }
    } else {
      selectedArtboards = parseArtboardRange(
        rangeInput.text,
        doc.artboards.length
      );
    }
    return {
      fileName: customTrim(fileNameInput.text),
      saveLocation: locationInput.text,
      format: formatDropdown.selection.text,
      selectedArtboards: selectedArtboards,
    };
  } else {
    return null;
  }
}

// Function to parse artboard range string
function parseArtboardRange(rangeString, maxArtboards) {
  var artboards = [];
  var ranges = rangeString.split(",");
  for (var i = 0; i < ranges.length; i++) {
    var range = ranges[i].split("-");
    if (range.length == 1) {
      var artboardIndex = parseInt(range[0]) - 1;
      if (artboardIndex >= 0 && artboardIndex < maxArtboards) {
        artboards.push(artboardIndex);
      }
    } else if (range.length == 2) {
      var start = parseInt(range[0]) - 1;
      var end = parseInt(range[1]) - 1;
      for (var j = start; j <= end; j++) {
        if (j >= 0 && j < maxArtboards) {
          artboards.push(j);
        }
      }
    }
  }
  return artboards;
}

// Function to export artboards
function exportArtboards(fileName, saveLocation, format, selectedArtboards) {
  var doc = app.activeDocument;

  if (selectedArtboards.length === 0) {
    alert("No artboards selected. Please select at least one artboard.");
    return;
  }

  // Create export options based on format
  var exportOptions;
  switch (format) {
    case "PDF":
      exportOptions = new PDFSaveOptions();
      exportOptions.preserveEditability = false;
      break;
    case "JPG":
      exportOptions = new ExportOptionsJPEG();
      exportOptions.qualitySetting = 80;
      break;
    case "PNG":
      exportOptions = new ExportOptionsPNG24();
      exportOptions.transparency = true;
      break;
  }

  // Export artboards
  if (format === "PDF") {
    // For PDF, export all selected artboards as a single multi-page PDF
    var pdfFile = new File(saveLocation + "/" + fileName + ".pdf");
    var artboardRange = "";
    for (var i = 0; i < selectedArtboards.length; i++) {
      artboardRange += selectedArtboards[i] + 1;
      if (i < selectedArtboards.length - 1) {
        artboardRange += ",";
      }
    }
    exportOptions.artboardRange = artboardRange;
    app.activeDocument.saveAs(pdfFile, exportOptions);
  } else {
    // For JPG and PNG, export individual files
    for (var i = 0; i < selectedArtboards.length; i++) {
      var artboardIndex = selectedArtboards[i];
      var artboard = doc.artboards[artboardIndex];
      var artboardName = artboard.name.replace(/[^\w\s-]/gi, "");

      // Set the artboard as active before exporting
      doc.artboards.setActiveArtboardIndex(artboardIndex);

      var outputFileName = fileName + "_" + artboardName;

      var file = new File(
        saveLocation + "/" + outputFileName + "." + format.toLowerCase()
      );
      doc.exportFile(
        file,
        format === "JPG" ? ExportType.JPEG : ExportType.PNG24,
        exportOptions
      );
    }
  }

  alert("Export completed successfully!");
}

// Main execution
try {
  var userInput = showDialog();
  if (userInput) {
    exportArtboards(
      userInput.fileName,
      userInput.saveLocation,
      userInput.format,
      userInput.selectedArtboards
    );
  }
} catch (e) {
  alert("An error occurred: " + e.message);
}
