#target illustrator

// Function to sanitize filename
function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// Function to handle duplicate filenames
function getUniqueFilename(folder, baseName, artboardIndex) {
    var ext = '.svg';
    var file = new File(folder + '/' + baseName + ext);
    var counter = 1;
    while (file.exists) {
        file = new File(folder + '/' + baseName + '_' + counter + ext);
        counter++;
    }
    // If the filename is just a single character, append the artboard index
    if (baseName.length === 1) {
        return new File(folder + '/' + baseName + '_' + (artboardIndex + 1) + ext);
    }
    return file;
}

// Function to parse artboard range
function parseArtboardRange(rangeStr, maxArtboards) {
    var artboardIndices = [];
    var ranges = rangeStr.split(',');
    for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i].split('-');
        if (range.length == 1) {
            var index = parseInt(range[0]) - 1;
            if (index >= 0 && index < maxArtboards) {
                artboardIndices.push(index);
            }
        } else if (range.length == 2) {
            var start = parseInt(range[0]) - 1;
            var end = parseInt(range[1]) - 1;
            for (var j = start; j <= end && j < maxArtboards; j++) {
                if (j >= 0) {
                    artboardIndices.push(j);
                }
            }
        }
    }
    return artboardIndices;
}

// Main export function
function exportArtboardRangeToSVG() {
    if (app.documents.length === 0) {
        alert("No document open. Please open a document and try again.");
        return;
    }

    var doc = app.activeDocument;
    var totalArtboards = doc.artboards.length;
    var activeArtboardIndex = doc.artboards.getActiveArtboardIndex();

    // Store the original document path
    var originalDocPath = doc.fullName;

    // Prompt user for artboard range
    var defaultRange = (activeArtboardIndex + 1) + "-" + totalArtboards;
    var rangeStr = prompt("Enter artboard range to export (e.g., 1-3,5,7-9):\nTotal artboards: " + totalArtboards + "\nCurrent active artboard: " + (activeArtboardIndex + 1), defaultRange);
    
    if (rangeStr === null) {
        return; // User cancelled the input
    }

    var artboardsToExport = parseArtboardRange(rangeStr, totalArtboards);

    if (artboardsToExport.length === 0) {
        alert("No valid artboards specified. Please enter a valid range and try again.");
        return;
    }

    // Prompt user for export location
    var exportFolder = Folder.selectDialog("Choose a folder to export SVG files");
    if (exportFolder === null) {
        return; // User cancelled the folder selection
    }

    // Set up the export options
    var exportOptions = new ExportOptionsSVG();
    exportOptions.embedAllFonts = false;
    exportOptions.cssProperties = SVGCSSPropertyLocation.STYLEATTRIBUTES;
    exportOptions.fontSubsetting = SVGFontSubsetting.GLYPHSUSED;
    exportOptions.documentEncoding = SVGDocumentEncoding.UTF8;
    exportOptions.embedRasterImages = false;

    // Export each selected artboard
    var exportedCount = 0;
    for (var i = 0; i < artboardsToExport.length; i++) {
        var artboardIndex = artboardsToExport[i];
        var artboard = doc.artboards[artboardIndex];
        
        // Set the artboard as active
        doc.artboards.setActiveArtboardIndex(artboardIndex);
        
        // Prepare filename
        var baseName = sanitizeFilename(artboard.name);
        var file = getUniqueFilename(exportFolder, baseName, artboardIndex);
        
        // Set up artboard-specific export options
        exportOptions.artboardRange = (artboardIndex + 1).toString();
        
        // Export the artboard
        doc.exportFile(file, ExportType.SVG, exportOptions);
        exportedCount++;
    }

    // Restore the original document
    app.open(new File(originalDocPath));

    alert("Export complete! " + exportedCount + " artboard(s) exported as SVG.");
}

// Run the script
try {
    exportArtboardRangeToSVG();
} catch (e) {
    alert("An error occurred: " + e.message);
}