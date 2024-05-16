package com.kelter.appavailability;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;

public class AppAvailability extends CordovaPlugin {
    
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("checkAvailability".equals(action)) {
            try {
                String uri = args.getString(0);
                checkAvailability(uri, callbackContext);
            } catch (Exception e) {
                callbackContext.error("Error processing checkAvailability: " + e.getMessage());
            }
            return true;
        }
        return false;
    }

    /**
     * Get the PackageInfo of the app with the specified URI.
     * 
     * @param uri the URI scheme of the app
     * @return PackageInfo of the app if found, null otherwise
     * @throws Exception if an error occurs while fetching package info
     */
    private PackageInfo getAppPackageInfo(String uri) throws Exception {
        Context context = this.cordova.getActivity().getApplicationContext();
        PackageManager pm = context.getPackageManager();
        try {
            return pm.getPackageInfo(uri, PackageManager.GET_ACTIVITIES);
        } catch (NameNotFoundException e) {
            throw new Exception("Package not found: " + uri, e);
        } catch (Exception e) {
            throw new Exception("Error getting package info for: " + uri, e);
        }
    }

    /**
     * Check the availability of the app with the specified URI.
     * 
     * @param uri the URI scheme of the app
     * @param callbackContext the callback context to send the result
     */
    private void checkAvailability(String uri, CallbackContext callbackContext) {
        try {
            PackageInfo info = getAppPackageInfo(uri);
            if (info != null) {
                callbackContext.success(convertPackageInfoToJson(info));
            } else {
                callbackContext.error("App not found for URI: " + uri);
            }
        } catch (Exception e) {
            callbackContext.error("Error checking availability: " + e.getMessage());
        }
    }

    /**
     * Convert PackageInfo to a JSONObject.
     * 
     * @param info the PackageInfo to convert
     * @return JSONObject representing the PackageInfo
     * @throws JSONException if JSON conversion fails
     */
    private JSONObject convertPackageInfoToJson(PackageInfo info) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("version", info.versionName);
        json.put("appId", info.packageName);
        return json;
    }
}
