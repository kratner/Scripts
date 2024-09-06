#target illustrator

// Function to get selected artboards
function getSelectedArtboards() {
    var doc = app.activeDocument;
    var selectedArtboards = [];
    
    // Check if there's a selection
    if (doc.selection.length > 0) {
        // Iterate through all artboards
        for (var i = 0; i < doc.artboards.length; i++) {
            doc.artboards.setActiveArtboardIndex(i);
            // If any selected object is within the artboard bounds, consider it selected
            if (doc.selection.length != doc.pageItems.length) {
                selectedArtboards.push(i);
            }
        }
    }
    
    // If no artboards were selected based on object selection, consider all artboards as selected
    if (selectedArtboards.length === 0) {
        for (var i = 0; i < doc.artboards.length; i++) {
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
        alert("No artboards found in the document. Please ensure your document has at least one artboard.");
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