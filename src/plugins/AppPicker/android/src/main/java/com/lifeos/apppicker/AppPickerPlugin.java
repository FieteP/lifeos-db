package com.lifeos.apppicker;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

@CapacitorPlugin(name = "AppPicker")
public class AppPickerPlugin extends Plugin {

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        PackageManager pm = getContext().getPackageManager();
        List<ApplicationInfo> apps = pm.getInstalledApplications(PackageManager.GET_META_DATA);

        List<JSObject> appList = new ArrayList<>();

        for (ApplicationInfo appInfo : apps) {
            // Skip system apps that are not launchable
            Intent launchIntent = pm.getLaunchIntentForPackage(appInfo.packageName);
            if (launchIntent == null) continue;

            JSObject app = new JSObject();
            app.put("packageName", appInfo.packageName);
            app.put("appName", pm.getApplicationLabel(appInfo).toString());

            // Try to get icon as base64
            try {
                Drawable icon = pm.getApplicationIcon(appInfo.packageName);
                if (icon != null) {
                    Bitmap bitmap = drawableToBitmap(icon);
                    String base64Icon = bitmapToBase64(bitmap);
                    app.put("icon", base64Icon);
                }
            } catch (Exception e) {
                // Icon not available, skip
            }

            appList.add(app);
        }

        JSObject ret = new JSObject();
        ret.put("apps", appList);
        call.resolve(ret);
    }

    @PluginMethod
    public void openApp(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null || packageName.isEmpty()) {
            call.reject("Package name is required");
            return;
        }

        try {
            Intent launchIntent = getContext().getPackageManager().getLaunchIntentForPackage(packageName);
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(launchIntent);
                call.resolve();
            } else {
                call.reject("App not found or not launchable");
            }
        } catch (Exception e) {
            call.reject("Failed to open app: " + e.getMessage());
        }
    }

    private Bitmap drawableToBitmap(Drawable drawable) {
        if (drawable instanceof BitmapDrawable) {
            return ((BitmapDrawable) drawable).getBitmap();
        }

        Bitmap bitmap = Bitmap.createBitmap(
                drawable.getIntrinsicWidth(),
                drawable.getIntrinsicHeight(),
                Bitmap.Config.ARGB_8888
        );
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
        drawable.draw(canvas);
        return bitmap;
    }

    private String bitmapToBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 80, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        return "data:image/png;base64," + Base64.encodeToString(byteArray, Base64.DEFAULT);
    }
}
