# React Native FileManager App

## Overview
The React Native FileManager app is a cross-platform application for managing files and directories on mobile devices. It leverages native modules to handle file system operations, providing robust performance and seamless integration with the underlying platform.

## Features
- **Browse Files and Directories**: Navigate through the file system with an intuitive interface.
- **File Operations**: Create, delete, rename, and move files or directories.
- **File Preview**: Open and preview supported file types.
- **Search**: Quickly search for files and folders.
- **Cross-Platform Support**: Works on both Android and iOS devices.
- **Native Module Integration**: Uses native code for file operations to ensure optimal performance.

## Screenshots
Here are some screenshots of the app showcasing its features and user interface:

- **Home Screen**:
  ![Home Screen](./screenshots/home_screen.png)

- **File Browser**:
  ![File Browser](./screenshots/file_browser.png)

- **Search Feature**:
  ![Search Feature](./screenshots/search_feature.png)

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (>= 16.x)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- Android Studio and Xcode (for running on Android and iOS)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/dharmendra841434/FilesMitra.git
   cd FilesMitra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link the native module:
   For React Native version < 0.60, run:
   ```bash
   react-native link react-native-filemanager
   ```
   For React Native version >= 0.60, auto-linking should handle this step.

4. Run the app:
   - **Android**:
     ```bash
     npx react-native run-android
     ```
   - **iOS**:
     ```bash
     npx pod-install
     npx react-native run-ios
     ```

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments
Special thanks to the React Native community and contributors for their valuable resources and support.

