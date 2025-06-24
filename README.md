# What's this all about?
Project.io is a project management mobile app built for devices with Android OS (iOS is currently not supported). Main reason of this app is to allow user to add and manage one or more projects on the go - I often found myself with the urge to add something (new idea, functionality, really whatever) on the daily commute, but had the problem of being to lazy to use some external app (and go through the tiring work of logging in, etc) or putting everything in my notes (which I forgot about in the time or it was becoming more and more messed). So I decided to create something that's personalized to my own needs.

## What frameworks/libraries does it use?

- [Typescript](https://www.typescriptlang.org/)
- [React Native](https://reactnative.dev/) (but with [Expo](https://expo.dev/) as the main unit)
- [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native) for icons
- [React Native Reusables](https://github.com/mrzachnugent/react-native-reusables/) as the components library
- [Nativewind](https://www.nativewind.dev/) (to have Tailwind CSS like counterpart)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) for local database

## How to spin this up?
Expo apps can be run on physical or emulated device using few methods, but I've only used one approach:

To run app in development mode assuming I have the device connected via USB to my laptop (I had to install Android Debug Bridge first) I run the command:
```
pnpm dev:run:android
```

This automatically installs the project and runs it. App should automatically start on the Android device.

In the case of problems please refer to [Expo docs](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=physical&mode=development-build&buildEnv=local#set-up-an-android-device-with-a-development-build) for further details.

## Cool points 😏

- simple design
- local database (so app works even offline)
- no need to login or create any account or whatever

## What's the state of this app?
Currently Project.io is in the middle of development, but even after finishing the main part I might add/change/fix things that I find necessary (as I said earlier, this project is peronalized to my needs).