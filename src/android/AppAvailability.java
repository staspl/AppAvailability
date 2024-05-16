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
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if ("checkAvailability".equals(action)) {
            try {
                final String uri = args.getString(0);
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        checkAvailability(uri, callbackContext);
                    }
                });
            } catch (Exception e) {
                callbackContext.error("Error processing checkAvailability: " + e.getMessage());
            }
            return true;
        }
        return false;
    }

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

    private JSONObject convertPackageInfoToJson(PackageInfo info) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("version", info.versionName);
        json.put("appId", info.packageName);
        return json;
    }
}
