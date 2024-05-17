package com.kelter.appavailability;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class AppAvailability extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if ("checkAvailability".equals(action)) {
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
            PackageInfo info = getPackageInfoCompat(packageName);
            boolean isInstalled = (info != null);
            callbackContext.success(isInstalled ? 1 : 0);
        } catch (Exception e) {
            callbackContext.error("Error checking availability: " + e.getMessage());
        }
    }

    private PackageInfo getPackageInfoCompat(String packageName) throws PackageManager.NameNotFoundException {
        PackageManager packageManager = this.cordova.getActivity().getPackageManager();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            return packageManager.getPackageInfo(packageName, PackageManager.PackageInfoFlags.of(0));
        } else {
            return packageManager.getPackageInfo(packageName, 0);
        }
    }
}
