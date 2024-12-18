package com.filemanager.customModules


import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Environment
import android.provider.Settings
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class PermissionModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "PermissionModule"
    }


    @ReactMethod
    fun requestExternalStoragePermission(promise: Promise) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject("ACTIVITY_NULL", "Current activity is null.")
            return
        }

        // Check for Android version
        val isAndroid11OrAbove = android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R
        val permission = Manifest.permission.WRITE_EXTERNAL_STORAGE

        // If the Android version is below Android 11, use the legacy permission model
        if (!isAndroid11OrAbove) {
            if (ActivityCompat.checkSelfPermission(activity, permission) == PackageManager.PERMISSION_GRANTED) {
                promise.resolve(true) // Permission already granted
            } else {
                ActivityCompat.requestPermissions(
                    activity,
                    arrayOf(permission),
                    PERMISSION_REQUEST_CODE
                )
                promise.resolve(false) // Permission requested
            }
        } else {
            // For Android 11 and above, use scoped storage or ask the user for broad storage access
            if (Environment.isExternalStorageManager()) {
                // If we already have permission for broad external storage access
                promise.resolve(true)
            } else {
                // Request permission to manage all files in the storage (for Android 11 and above)
                val intent = Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION)
                activity.startActivityForResult(intent, PERMISSION_REQUEST_CODE)
                promise.resolve(false) // Permission requested
            }
        }
    }

    @ReactMethod
    fun openAppSettings(promise: Promise) {
        try {
            val activity = currentActivity
            if (activity == null) {
                promise.reject("ACTIVITY_NULL", "Current activity is null.")
                return
            }

            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
            val uri = Uri.fromParts("package", activity.packageName, null)
            intent.setData(uri)
            activity.startActivity(intent)
            promise.resolve("Opened app settings")
        } catch (e: Exception) {
            promise.reject("SETTINGS_ERROR", e.message)
        }
    }


    @ReactMethod
    fun requestFileAccessSilently(promise: Promise) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject("ACTIVITY_NULL", "Current activity is null.")
            return
        }

        // Check for Android version
        val isAndroid11OrAbove = android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R

        if (isAndroid11OrAbove) {
            // If the app already has access to manage all files
            if (Environment.isExternalStorageManager()) {
                promise.resolve(true) // Permission already granted
            } else {
                // Directly check and request permission if not granted yet
                val intent = Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION)
                activity.startActivityForResult(intent, PERMISSION_REQUEST_CODE)
                promise.resolve(false) // Permission requested silently (but requires user interaction)
            }
        } else {
            // Below Android 11, you can request the standard external storage permission
            val permission = Manifest.permission.WRITE_EXTERNAL_STORAGE
            if (ActivityCompat.checkSelfPermission(activity, permission) == PackageManager.PERMISSION_GRANTED) {
                promise.resolve(true) // Permission already granted
            } else {
                ActivityCompat.requestPermissions(
                    activity,
                    arrayOf(permission),
                    PERMISSION_REQUEST_CODE
                )
                promise.resolve(false) // Permission requested
            }
        }
    }





    @ReactMethod
    fun testModule(): String {
        var msg = "Module Working Fine";
        return msg;
    }

    companion object {
        private const val PERMISSION_REQUEST_CODE = 12345
    }
}