package com.kelter.appavailability;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.pm.PackageManager;
import android.content.pm.PackageInfo;
import android.util.Log;

public class AppAvailability extends CordovaPlugin {

    private static final String TAG = "AppAvailability";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("checkAvailability")) {
            String packageName = args.getString(0);
            cordova.getThreadPool().execute(() -> checkAvailability(packageName, callbackContext));
            return true;
        }
        return false;
    }

    private void checkAvailability(String packageName, CallbackContext callbackContext) {
        Log.d(TAG, "Checking availability for package: " + packageName);
        PackageInfo packageInfo = getAppPackageInfo(packageName);
        if (packageInfo != null) {
            try {
                JSONObject json = convertPackageInfoToJson(packageInfo);
                callbackContext.success(json);
            } catch (JSONException e) {
                Log.e(TAG, "Error converting package info to JSON", e);
                callbackContext.error("Error converting package info to JSON");
            }
        } else {
            Log.d(TAG, "App not found for package: " + packageName);
            callbackContext.error("App not found");
        }
    }

    private PackageInfo getAppPackageInfo(String packageName) {
        Context context = cordova.getActivity().getApplicationContext();
        PackageManager packageManager = context.getPackageManager();

        try {
            return packageManager.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
        } catch (PackageManager.NameNotFoundException e) {
            Log.d(TAG, "Package not found: " + packageName, e);
            return null;
        }
    }

    private JSONObject convertPackageInfoToJson(PackageInfo packageInfo) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("version", packageInfo.versionName);
        json.put("appId", packageInfo.packageName);
        return json;
    }
}
