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
            String uri = args.getString(0);
            checkAvailability(uri, callbackContext);
            return true;
        }
        return false;
    }

    /**
     * Get the PackageInfo of the app with the specified URI.
     * 
     * @param uri the URI scheme of the app
     * @return PackageInfo of the app if found, null otherwise
     */
    private PackageInfo getAppPackageInfo(String uri) {
        Context context = this.cordova.getActivity().getApplicationContext();
        PackageManager pm = context.getPackageManager();
        try {
            return pm.getPackageInfo(uri, PackageManager.GET_ACTIVITIES);
        } catch (NameNotFoundException e) {
            return null;
        }
    }

    /**
     * Check the availability of the app with the specified URI.
     * 
     * @param uri the URI scheme of the app
     * @param callbackContext the callback context to send the result
     */
    private void checkAvailability(String uri, CallbackContext callbackContext) {
        PackageInfo info = getAppPackageInfo(uri);
        if (info != null) {
            try {
                callbackContext.success(convertPackageInfoToJson(info));
            } catch (JSONException e) {
                callbackContext.error("Failed to convert package info to JSON.");
            }
        } else {
            callbackContext.error("App not found.");
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
