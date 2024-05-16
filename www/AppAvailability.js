function checkUrlScheme(urlScheme, errorCallback) {
    console.log("Checking URL scheme:", urlScheme); // Log the URL scheme being checked
    var trimmedUrlScheme = (urlScheme || "").trim();
    if (!trimmedUrlScheme) {
        console.error("Invalid URL scheme:", urlScheme); // Log an error if the URL scheme is invalid
        errorCallback("Invalid URL scheme (\"" + urlScheme + "\"). Please ensure it's not empty or contains only whitespace.");
        return;
    }
    console.log("Validated URL scheme:", trimmedUrlScheme); // Log the validated URL scheme
    return trimmedUrlScheme;
}

var appAvailability = {

    check: function(urlScheme, successCallback, errorCallback) {
        console.log("Calling check function with URL scheme:", urlScheme); // Log the call to the check function
        urlScheme = checkUrlScheme(urlScheme, errorCallback);
        if (urlScheme) {
            console.log("Executing native plugin with URL scheme:", urlScheme); // Log the execution of the native plugin
            cordova.exec(successCallback, errorCallback, "AppAvailability", "checkAvailability", [urlScheme]);
        } else {
            console.error("URL scheme validation failed."); // Log an error if the URL scheme validation fails
        }
    }
    
};

window.appAvailability = appAvailability;
