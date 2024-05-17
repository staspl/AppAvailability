package com.kelter.appavailability;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class AppAvailability extends CordovaPlugin {

    private static final String TAG = "AppAvailability";
    private static final String ACTION_CHECK_AVAILABILITY = "checkAvailability";

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        Log.d(TAG, "execute called with action = " + action);
        if (ACTION_CHECK_AVAILABILITY.equals(action)) {
            try {
                final String packageName = args.getString(0);
                Log.d(TAG, "execute: packageName = " + packageName);
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        Log.d(TAG, "Runnable run: checking availability for " + packageName);
                        checkAvailability(packageName, callbackContext);
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "execute: error processing checkAvailability", e);
                callbackContext.error("Error processing checkAvailability: " + e.getMessage());
            }
            return true;
        }
        Log.d(TAG, "execute: action not recognized");
        return false;
    }

    private void checkAvailability(String packageName, CallbackContext callbackContext) {
        try {
            ApplicationInfo info = getApplicationInfoCompat(packageName);
            boolean isInstalled = (info != null);
            Log.d(TAG, "checkAvailability: isInstalled = " + isInstalled);
            PluginResult result = new PluginResult(PluginResult.Status.OK, isInstalled ? 1 : 0);
            callbackContext.sendPluginResult(result);
        } catch (PackageManager.NameNotFoundException e) {
            Log.d(TAG, "checkAvailability: package not found " + packageName);
            PluginResult result = new PluginResult(PluginResult.Status.OK, 0);
            callbackContext.sendPluginResult(result);
        } catch (Exception e) {
            Log.e(TAG, "checkAvailability: error checking availability", e);
            callbackContext.error("Error checking availability: " + e.getMessage());
        }
    }

    private ApplicationInfo getApplicationInfoCompat(String packageName) throws PackageManager.NameNotFoundException {
        PackageManager packageManager = this.cordova.getActivity().getPackageManager();
        Log.d(TAG, "getApplicationInfoCompat: checking package " + packageName);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return packageManager.getApplicationInfo(packageName, PackageManager.ApplicationInfoFlags.of(0));
        } else {
            return packageManager.getApplicationInfo(packageName, 0);
        }
    }
}
