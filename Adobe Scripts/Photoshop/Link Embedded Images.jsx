#target photoshop

// script.name = LinkEmbeddedImages.jsx; 
// script.description = Iterate over embedded images and prompt for source folders.;
// script.required = requires CS4 or later
// script.parent = KeithRatner // 4/28/2024;  v1.0-4/28/2024
// script.elegant = false;

// Notes: Anthropic / ClaudeAI
// 		Use with caution, save everything before running, script is memory intensive...

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/Link Embedded Images/Menu=Link Embedded Images...</name>
<eventid>6F17BFA7-EFC8-40EA-B850-7B95ED8EA713</eventid>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/

// Function to get the folder path from the user
function getFolder() {
    var folder = Folder.selectDialog("Select the folder to search for external images:");
    return folder;
}

// Function to find an external image file with a matching filename
function findExternalImage(folder, filename) {
    var files = folder.getFiles(filename + ".*");
    if (files.length > 0) {
        return files[0];
    }
    return null;
}

// Function to get all smart objects in the active document
function getSmartObjects() {
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var desc = executeActionGet(ref);
    var smartObjects = [];

    if (desc.hasKey(stringIDToTypeID("smartObject"))) {
        var smartObjectList = desc.getList(stringIDToTypeID("smartObject"));
        for (var i = 0; i < smartObjectList.count; i++) {
            var smartObjectDesc = smartObjectList.getObjectValue(i);
            var smartObject = {}
;
            smartObject.linked = smartObjectDesc.getBoolean(stringIDToTypeID("link"));
            smartObject.name = smartObjectDesc.getString(charIDToTypeID("Nm  "));
            smartObjects.push(smartObject);
        }
    }

    return smartObjects;
}

// Main function
function main() {
    var smartObjects = getSmartObjects();
    var embeddedImages = [];

    // Iterate over all smart objects and collect embedded images
    for (var i = 0; i < smartObjects.length; i++) {
        var smartObject = smartObjects[i];
        if (!smartObject.linked) {
            embeddedImages.push(smartObject);
        }
    }

    if (embeddedImages.length == 0) {
        alert("No embedded images found in the document.");
        return;
    }

    // Prompt for the folder location to search for external images
    var folder = getFolder();
    if (folder == null) {
        return;
    }

    // Iterate over each embedded image and replace with linked image
    for (var i = 0; i < embeddedImages.length; i++) {
        var smartObject = embeddedImages[i];
        var filename = smartObject.name;

        // Find an external image file with a matching filename
        var externalFile = findExternalImage(folder, filename);
        if (externalFile != null) {
            // Replace the embedded image with the linked image
            var idplacedLayerReplaceContents = stringIDToTypeID("placedLayerReplaceContents");
            var desc = new ActionDescriptor();
            desc.putPath(charIDToTypeID("null"), new File(externalFile));
            executeAction(idplacedLayerReplaceContents, desc, DialogModes.NO);
        } else {
            alert("No matching external image found for: " + filename);
        }
    }

    alert("Embedded images replaced with linked images successfully.");
}

// Run the main function
main();