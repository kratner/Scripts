#target illustrator

// Function to get selected artboards
function getSelectedArtboards() {
    var doc = app.activeDocument;
    var selectedArtboards = [];
    
    for (var i = 0; i < doc.artboards.length; i++) {
        if (doc.artboards[i].selected) {
            selectedArtboards.push(i);
        }
    }
    
    return selectedArtboards;
}

// Function to sanitize filename
function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// Function to handle duplicate filenames
function getUniqueFilename(folder, baseName) {
    var ext = '.svg';
    var file = new File(folder + '/' + baseName + ext);
    var counter = 1;
    while (file.exists) {
        file = new File(folder + '/' + baseName + '_' + counter + ext);
        counter++;
    }
    return file;
}

// Main export function
function exportSelectedArtboardsToSVG() {
    if (app.documents.length === 0) {
        alert("No document open. Please open a document and try again.");
        return;
    }

    var doc = app.activeDocument;
    var selectedArtboards = getSelectedArtboards();

    if (selectedArtboards.length === 0) {
        alert("No artboards selected. Please select at least one artboard using the Artboard tool (Shift+O) and try again.");
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
    for (var i = 0; i < selectedArtboards.length; i++) {
        var artboardIndex = selectedArtboards[i];
        var artboard = doc.artboards[artboardIndex];
        
        // Set the artboard as active
        doc.artboards.setActiveArtboardIndex(artboardIndex);
        
        // Prepare filename
        var baseName = sanitizeFilename(artboard.name);
        var file = getUniqueFilename(exportFolder, baseName);
        
        // Set up artboard-specific export options
        exportOptions.artboardRange = (artboardIndex + 1).toString();
        
        // Export the artboard
        doc.exportFile(file, ExportType.SVG, exportOptions);
        exportedCount++;
    }

    alert("Export complete! " + exportedCount + " artboard(s) exported as SVG.");
}

// Run the script
try {
    exportSelectedArtboardsToSVG();
} catch (e) {
    alert("An error occurred: " + e.message);
}