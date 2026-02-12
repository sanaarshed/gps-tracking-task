# React Native Assessment — GPS Navigation & Live Location Tracking

## Objective
Evaluate the candidate’s ability to work with real-time GPS data, manage mobile permissions, and render location updates efficiently in a React Native application. The focus is on correctness, stability, and practical mobile engineering judgment rather than visual design.

## Task
Implement a live GPS tracking screen in a React Native application that displays the user’s movement on a map in real time. The solution must demonstrate:

- Proper handling of location permissions
- Continuous GPS updates
- Controlled and efficient rendering of route data

## Functional Requirements

1. **Map Rendering**
   - Use `react-native-maps`.
   - Display the user’s current location and a polyline representing the path travelled since tracking began.

2. **Location Tracking**
   - Request runtime location permission on app start or screen mount.
   - Start GPS tracking when tracking is enabled.
   - Receive location updates at an interval of ~3–5 seconds.
   - Append valid coordinates to a route history (do not overwrite history).

3. **Accuracy and Performance**
   - Ignore location updates if the user has moved less than 10 meters (filter jitter).
   - Avoid unnecessary re-renders of the map (keep minimal state required for rendering).
   - Clean up all GPS listeners when tracking stops or the screen unmounts.

4. **User Controls**
   - Provide Start Tracking, Stop Tracking, and Reset Route controls.

5. **Edge Case Handling**
   - Permission denied: show a clear message and instructions to open settings.
   - Location services disabled: show an error state and option to open device settings.
   - App moves to background: stop tracking safely to avoid crashes or leaks.

## Constraints

- No backend integration required.
- Do not use directions/routing APIs (e.g., Google Directions API).
- Prioritise code clarity and correctness over UI styling.

## Suggested Libraries

- `react-native-maps`
- One of:
  - `@react-native-community/geolocation`
  - `expo-location` (if using Expo)

## Evaluation Criteria

### Required
- Correct permission handling (Android / iOS) and runtime request flow.
- Proper use of continuous location updates (`watchPosition` or equivalent).
- Accurate route tracking using coordinate arrays (append-only history).
- Clean setup and teardown of GPS listeners (no leaks).
- Stable behaviour over time (no crashes or runaway updates).

### Code Quality
- Logical separation of concerns.
- Safe handling of side effects (useEffect, cleanup).
- Readable and maintainable structure with clear naming.

### Common Failure Points

- Triggering GPS logic inside render cycles.
- Not clearing location watchers on stop/unmount.
- Replacing route history instead of appending.
- Failing to handle permission denial.
- Updating state from insignificant GPS jitter.

## Bonus Considerations (Optional)

- Smooth camera follow using map animation.
- Distance calculation using the Haversine formula.
- Pause and resume tracking.
- Short explanation of background behaviour handling.

## Expected Outcome

A successful submission demonstrates:

- Practical understanding of mobile GPS behaviour and noisy data.
- Responsible resource management (listeners, battery-conscious updates).
- Familiarity with real-world constraints such as permission flows and unreliable location readings.

## Quick Run / Debug Tips

- Start Metro and run on Android device/emulator:
```bash
npx react-native start
npx react-native run-android
```
- For an untethered debug APK (bundle JS into the APK):
```bash
npx react-native bundle --platform android --dev false --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res/
cd android
./gradlew assembleDebug
./gradlew installDebug
```
- View logs while connected:
```bash
npx react-native log-android
# or
adb logcat *:S ReactNative:V ReactNativeJS:V
```

## Notes

- Prefer measuring distances on the device using the Haversine formula to filter jitter.
- Use a small distance threshold (10 m) to avoid adding noisy points.
- Keep UI minimal and make correctness, cleanup and resource use explicit in code and comments.

*** End of assessment README ***
This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
