package com.filemanager.customModules


import android.os.Environment
import com.facebook.react.bridge.*
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ExternalStorageModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ExternalStorageModule"
    }

    @ReactMethod
    fun listFiles(promise: Promise) {
        try {
            val storageDir = Environment.getExternalStorageDirectory()
            val files = storageDir.listFiles()
            if (files != null) {
                val fileList = Arguments.createArray() // Create an array to hold the file/folder objects
                for (file in files) {
                    val folderMap = Arguments.createMap() // Create a WritableMap for each folder
                    folderMap.putString("folderName", file.name) // Add the folder name to the map
                    folderMap.putString("path", file.absolutePath) // Add the folder path to the map
                    folderMap.putString("type", if (file.isDirectory) "folder" else "file") // Add the type (file/folder)
                    fileList.pushMap(folderMap) // Add the map to the array
                }
                promise.resolve(fileList) // Resolve the array of folder objects
            } else {
                promise.reject(
                    "STORAGE_ERROR",
                    "Unable to access external storage or no files found."
                )
            }
        } catch (e: Exception) {
            promise.reject("STORAGE_ERROR", e.message)
        }
    }

    @ReactMethod
    fun listFilesInPath(path: String, promise: Promise) {
        try {
            val directory = File(path)
            if (directory.exists() && directory.isDirectory) {
                val files = directory.listFiles()
                if (files != null) {
                    val fileList = Arguments.createArray() // Create an array to hold file/folder objects
                    for (file in files) {
                        val itemMap = Arguments.createMap() // Create a WritableMap for each item
                        itemMap.putString("name", file.name) // Add the file/folder name
                        itemMap.putString("path", file.absolutePath) // Add the file/folder path
                        itemMap.putString("type", if (file.isDirectory) "folder" else "file") // Add the type (file/folder)
                        itemMap.putBoolean("isHidden", file.isHidden) // Indicate if the file/folder is hidden
                        fileList.pushMap(itemMap) // Add the map to the array
                    }
                    promise.resolve(fileList) // Resolve the array of file/folder objects
                } else {
                    promise.resolve(Arguments.createArray()) // Return an empty array for an empty directory
                }
            } else {
                promise.reject("INVALID_PATH", "The specified path does not exist or is not a directory.")
            }
        } catch (e: Exception) {
            promise.reject("STORAGE_ERROR", e.message)
        }
    }

    @ReactMethod
    fun deleteItemAtPath(path: String, promise: Promise) {
        try {
            val file = File(path)

            if (!file.exists()) {
                promise.reject("DELETE_ERROR", "The specified path does not exist.")
                return
            }

            val isDeleted = if (file.isDirectory) {
                deleteDirectory(file)
            } else {
                file.delete()
            }

            if (isDeleted) {
                promise.resolve("Item deleted successfully")
            } else {
                promise.reject("DELETE_ERROR", "Failed to delete the item.")
            }
        } catch (e: Exception) {
            promise.reject("DELETE_ERROR", e.message)
        }
    }

    private fun deleteDirectory(directory: File): Boolean {
        val files = directory.listFiles()
        if (files != null) {
            for (file in files) {
                if (file.isDirectory) {
                    if (!deleteDirectory(file)) {
                        return false
                    }
                } else {
                    if (!file.delete()) {
                        return false
                    }
                }
            }
        }
        return directory.delete()
    }



    @ReactMethod
    fun createNewFolder(path: String, folderName: String, promise: Promise) {
        try {
            val directory = File(path, folderName)

            if (directory.exists()) {
                promise.reject("FOLDER_EXISTS", "A folder with this name already exists.")
                return
            }
            if (directory.mkdirs()) {
                promise.resolve("Folder created successfully at: ${directory.absolutePath}")
            } else {
                promise.reject("CREATE_ERROR", "Failed to create the folder.")
            }
        } catch (e: Exception) {
            promise.reject("CREATE_ERROR", e.message)
        }
    }




    @ReactMethod
    fun getItemDetails(path: String, promise: Promise) {
        try {
            val file = File(path)
            if (!file.exists()) {
                promise.reject("INVALID_PATH", "The specified path does not exist.")
                return
            }

            val details = Arguments.createMap()
            details.putString("name", file.name)
            details.putString("path", file.absolutePath)
            details.putString("type", if (file.isDirectory) "folder" else "file")
            details.putBoolean("isHidden", file.isHidden)
            details.putDouble("size", file.length().toDouble())
            details.putString(
                "lastModified",
                SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date(file.lastModified()))
            )

            // Add number of items inside if it is a directory
            if (file.isDirectory) {
                val itemCount = file.list()?.size ?: 0
                details.putInt("itemCount", itemCount)
            }

            promise.resolve(details)
        } catch (e: Exception) {
            promise.reject("DETAILS_ERROR", e.message)
        }
    }



    @ReactMethod
    fun searchFilesAndFolders(query: String, promise: Promise) {
        try {
            val rootDirectory = Environment.getExternalStorageDirectory()
            val matchingItems = WritableNativeArray() // Create an empty WritableArray to store results
            searchRecursively(rootDirectory, query, matchingItems)
            promise.resolve(matchingItems) // Return the array of objects
        } catch (e: Exception) {
            promise.reject("SEARCH_ERROR", e.message)
        }
    }

    private fun searchRecursively(directory: File, query: String, matchingItems: WritableArray) {
        val files = directory.listFiles()
        if (files != null) {
            for (file in files) {
                // Check if the name contains the query string (case-insensitive)
                if (file.name.contains(query, ignoreCase = true)) {
                    val itemMap = WritableNativeMap() // Create a map for the current file/folder
                    itemMap.putString("name", file.name) // File or folder name
                    itemMap.putString("path", file.absolutePath) // Absolute path
                    itemMap.putString("type", if (file.isDirectory) "folder" else "file") // Type: file or folder
                    itemMap.putBoolean("isHidden", file.isHidden) // Hidden status
                    itemMap.putDouble("size", file.length().toDouble()) // File size in bytes
                    matchingItems.pushMap(itemMap) // Add the map to the results array
                }

                // If the current item is a directory, continue searching inside it
                if (file.isDirectory) {
                    searchRecursively(file, query, matchingItems)
                }
            }
        }
    }


    // Function to copy files and folders to a new destination
    @ReactMethod
    fun copyFilesToDirectory(sourcePath: String, destinationPath: String, promise: Promise) {
        try {
            val sourceDir = File(sourcePath)
            val destinationDir = File(destinationPath)

            if (!sourceDir.exists()) {
                promise.reject("SOURCE_ERROR", "Source directory does not exist.")
                return
            }

            if (!destinationDir.exists()) {
                val created = destinationDir.mkdirs()  // Create destination folder if it doesn't exist
                if (!created) {
                    promise.reject("DESTINATION_ERROR", "Failed to create destination directory.")
                    return
                }
            }

            copyFilesRecursively(sourceDir, destinationDir)
            promise.resolve("Files copied successfully.")
        } catch (e: Exception) {
            promise.reject("COPY_ERROR", e.message)
        }
    }

    // Recursive function to copy files and folders
    private fun copyFilesRecursively(source: File, destination: File) {
        if (source.isDirectory) {
            if (!destination.exists()) {
                destination.mkdirs() // Create directory if it doesn't exist
            }

            val files = source.listFiles()
            files?.forEach { file ->
                val newDest = File(destination, file.name)
                copyFilesRecursively(file, newDest)  // Recursively copy files/folders
            }
        } else {
            source.copyTo(destination, overwrite = true)  // Copy file with overwrite option
        }
    }


}
