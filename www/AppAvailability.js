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
        console.log(`AppAvailability.check called with packageName: ${packageName}`);
        if (typeof packageName !== "string") {
            console.error("packageName must be a string");
            return onFail(new Error("packageName must be a string"));
        }
        
        if (!packageName.trim()) {
            console.error("packageName cannot be empty");
            return onFail(new Error("packageName cannot be empty"));
        }

        cordova.exec(
            result => {
                console.log(`AppAvailability.check success callback called with result: ${result}`);
                onSuccess(result === 1);
            },
            error => {
                console.error(`AppAvailability.check error callback called with error: ${error}`);
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
