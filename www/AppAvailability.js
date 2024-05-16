/**
 * Removes the trailing and leading whitespace on a URL scheme and verifies it's not empty.
 * 
 * @param {String} urlScheme the URL scheme to check.
 * @param {Function} errorCallback to call when the urlScheme is empty.
 * 
 * @returns {String} urlScheme stripped by leading and trailing whitespace or undefined when it was empty.
 */
function checkUrlScheme(urlScheme, errorCallback) {
    var trimmedUrlScheme = (urlScheme || "").trim();
    if (!trimmedUrlScheme) {
        errorCallback("Invalid URL scheme (\"" + urlScheme + "\"). Please ensure it's not empty or contains only whitespace.");
        return;
    }
    return trimmedUrlScheme;
}

var appAvailability = {

    /**
     * Checks the availability of an app based on its URL scheme.
     * 
     * @param {String} urlScheme The URL scheme of the app to check.
     * @param {Function} successCallback A callback function to call upon successful retrieval of app information.
     * @param {Function} errorCallback A callback function to call upon failure or when no app is found.
     */
    check: function(urlScheme, successCallback, errorCallback) {
        urlScheme = checkUrlScheme(urlScheme, errorCallback);
        // Only call the native plugin if we have a valid urlScheme
        if (urlScheme) {
            cordova.exec(successCallback, errorCallback, "AppAvailability", "checkAvailability", [urlScheme]);
        }
    }
    
};

// Expose the appAvailability object globally so it can be accessed from other scripts
window.appAvailability = appAvailability;
