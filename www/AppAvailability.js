const cordova = require('cordova');

/**
 * AppAvailability plugin for Cordova
 * 
 * @class
 */
class AppAvailability {
    /**
     * Check the availability of an app by its URL scheme.
     *
     * @param {String}   urlScheme - The URL scheme of the app to check.
     * @param {Function} onSuccess - Callback function to be called on success.
     * @param {Function} onFail    - Callback function to be called on failure.
     */
    check(urlScheme, onSuccess, onFail) {
        if (typeof urlScheme !== "string") {
            return onFail(new Error("urlScheme must be a string"));
        }
        
        if (!urlScheme.trim()) {
            return onFail(new Error("urlScheme cannot be empty"));
        }

        cordova.exec(onSuccess, onFail, "AppAvailability", "checkAvailability", [urlScheme]);
    }
}

// Register the plugin
module.exports = new AppAvailability();
