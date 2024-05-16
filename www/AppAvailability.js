/**
 * Removes the trailing and leading whitespace on an URL scheme and verifies it's not empty.
 * 
 * @param {String} urlScheme - The URL scheme to check.
 * @param {Function} errorCallback - Callback to call when the urlScheme is empty.
 * 
 * @returns {String|undefined} The urlScheme stripped by leading and trailing whitespace or undefined when it was empty.
 */
function checkUrlScheme(urlScheme, errorCallback) {
    var trimmedUrlScheme = (urlScheme || "").trim();
    if (!trimmedUrlScheme) {
        errorCallback("Empty URL scheme: \"" + urlScheme + "\".");
        return;
    }
    return trimmedUrlScheme;
}

var appAvailability = {

    check: function(urlScheme, successCallback, errorCallback) {
        urlScheme = checkUrlScheme(urlScheme, function() { callback(false); });
        if (urlScheme) {
            cordova.exec(
                function(success) { callback(success); },
                function(error) { callback(error); },
                "AppAvailability",
                "checkAvailability",
                [urlScheme]
            );
        }
    },
    
    checkBool: function(urlScheme, callback) {
        urlScheme = checkUrlScheme(urlScheme, function() { callback(false); });
        if (urlScheme) {
            cordova.exec(
                function(success) { callback(success); },
                function(error) { callback(error); },
                "AppAvailability",
                "checkAvailability",
                [urlScheme]
            );
        }
    }
    
};

module.exports = appAvailability;
