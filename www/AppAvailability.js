var exec = require('cordova/exec');

var appAvailability = {
    check: function(urlScheme, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "AppAvailability", "checkAvailability", [urlScheme]);
    }
};

module.exports = appAvailability;
