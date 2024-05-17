const cordova = require('cordova');

/**
 * AppAvailability plugin for Cordova
 * 
 * @class
 */
class AppAvailability {
    /**
     * Check the availability of an app by its package name.
     *
     * @param {String}   packageName - The package name of the app to check.
     * @param {Function} onSuccess   - Callback function to be called on success.
     * @param {Function} onFail      - Callback function to be called on failure.
     */
    check(packageName, onSuccess, onFail) {
        if (typeof packageName !== "string") {
            return onFail(new Error("packageName must be a string"));
        }
        
        if (!packageName.trim()) {
            return onFail(new Error("packageName cannot be empty"));
        }

        cordova.exec(
            result => {
                onSuccess(result === 1);
            },
            error => {
                onFail(error);
            },
            "AppAvailability",
            "checkAvailability",
            [packageName]
        );
    }
}

// Register the plugin
module.exports = new AppAvailability();
