package com.kelter.appavailability;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Build;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class AppAvailability extends CordovaPlugin {

    private static final String ACTION_CHECK_AVAILABILITY = "checkAvailability";

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (ACTION_CHECK_AVAILABILITY.equals(action)) {
            try {
                final String packageName = args.getString(0);
                cordova.getThreadPool().execute(new Runnable() {
                    @Override
                    public void run() {
                        checkAvailability(packageName, callbackContext);
                    }
                });
            } catch (Exception e) {
                callbackContext.error("Error processing checkAvailability: " + e.getMessage());
            }
            return true;
        }
        return false;
    }

    private void checkAvailability(String packageName, CallbackContext callbackContext) {
        try {
            ApplicationInfo info = getApplicationInfoCompat(packageName);
            boolean isInstalled = (info != null);
            PluginResult result = new PluginResult(PluginResult.Status.OK, isInstalled ? 1 : 0);
            callbackContext.sendPluginResult(result);
        } catch (PackageManager.NameNotFoundException e) {
            PluginResult result = new PluginResult(PluginResult.Status.OK, 0);
            callbackContext.sendPluginResult(result);
        } catch (Exception e) {
            callbackContext.error("Error checking availability: " + e.getMessage());
        }
    }

    private ApplicationInfo getApplicationInfoCompat(String packageName) throws PackageManager.NameNotFoundException {
        PackageManager packageManager = this.cordova.getActivity().getPackageManager();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return packageManager.getApplicationInfo(packageName, PackageManager.ApplicationInfoFlags.of(0));
        } else {
            return packageManager.getApplicationInfo(packageName, 0);
        }
    }
}
