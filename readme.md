### Introduction

This repository contains the react-native component of an app that was mean to
unlock a door using bluetooth BTE sensors of a mobile phone, paired with a BTE
beacon, and raspberry pi.

This app has been detached to expo-kit to since expo does not support BLE
controllers.

### To Run

* run `yarn install`
* run `yarn start`
* open a second terminal window and run `open ios/ibeacons.xcworkspace` and then
  build and run
* for android, open the `android` folder in Android Studio and then build and
  run
