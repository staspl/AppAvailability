# AppAvailability for iOS and Android

AppAvailability is a plugin for Apache Cordova that allows you to check if an app is installed on the user's device. It supports both iOS and Android platforms, utilizing URI schemes for iOS and package names for Android.

## Important: iOS 9+ URL Scheme Whitelist
Apple changed the `canOpenURL` method on iOS 9. Apps which are checking for URL Schemes have to declare these Schemes as it is submitted to Apple. The article [Quick Take on iOS 9 URL Scheme Changes](http://awkwardhare.com/post/121196006730/quick-take-on-ios-9-url-scheme-changes) explains the changes in detail.

## Important: Android 11+ Google rejecting Android applications due to the QUERY_ALL_PACKAGES used
Google introduced a restriction on the QUERY_ALL_PACKAGES permission for apps on the Android operating system. This permission allowed apps to access a broad range of data on a user's device, potentially including sensitive information. However, its unrestricted usage posed privacy and security risks.

To mitigate these risks, Google implemented restrictions on the use of QUERY_ALL_PACKAGES starting with Android 11. Apps targeting this version and higher must adhere to stricter guidelines when requesting this permission. The Google Help [Use of the broad package (App) visibility (QUERY_ALL_PACKAGES) permission](https://support.google.com/googleplay/android-developer/answer/10158779?hl=en) explains the changes in detail.


### Whitelisting URL Schemes (iOS) and Package Visibility Needs (Android queries)
Beginning with version 1.0.3 (and OS11_1.0.3) of the plugin, you can now easily add URL Schemes to the -Info.plist file and Android Package Queries to the AndoirdManifest.xml file by using Cordova plugin --variable when integrating the plugin into your application.

```
cordova plugin add https://github.com/kelter-antunes/AppAvailability.git --variable CORDOVA_ANDROID_QUERIES="com.facebook.android,com.twitter.android" --variable CORDOVA_IOS_URL_SCHEMES="facebook,twitter"
```
For Android:
```
--variable CORDOVA_ANDROID_QUERIES="com.facebook.android,com.twitter.android"
```
Will change the AndroidManifest.xml file to:
```XML
<queries>
	<package android:name="com.facebook.android"/>
	<package android:name="com.twitter.android"/>
</queries>
```

For iOS:
```
--variable CORDOVA_IOS_URL_SCHEMES="facebook,twitter"
```

Will change the -Info.plist file to:
```XML
<key>LSApplicationQueriesSchemes</key>
<array>
	<string>facebook</string>
	<string>twitter</string>
</array>
```

Both variables accept a list of Packages/URL Schemas separated by commas.

## 1. Description

This plugin enables you to verify if an app is installed on the user's device. It needs a URI Scheme (like twitter://) on iOS or a Package Name (like com.twitter.android) on Android.

### Supported Platforms

* iOS
* Android

## 2. Installation

Simply run this command to add the latest version of AppAvailability from [npm](https://www.npmjs.com/package/cordova-plugin-kelter-appavailability) to your project:
```
$ cordova plugin add cordova-plugin-kelter-appavailability --save
```

Alternatively, you can install AppAvailability from [GitHub](https://github.com/kelter-antunes/AppAvailability):
```
$ cordova plugin add https://github.com/kelter-antunes/AppAvailability.git --save
```


## 3. Usage

### iOS

```javascript
window.appAvailability.check(
    'twitter://', // URI Scheme
    function(isAvailable) { // Success callback
        if (isAvailable) {
            console.log('Twitter is available');
        } else {
            console.log('Twitter is not available');
        }
    },
    function(error) { // Failure callback
        console.error("Error checking app availability:", error);
    }
);
```

### Android

```javascript
window.appAvailability.check(
    'com.twitter.android', // Package Name
    function(isAvailable) { // Success callback
        if (isAvailable) {
            console.log('Twitter is available');
        } else {
            console.log('Twitter is not available');
        }
    },
    function(error) { // Failure callback
        console.error("Error checking app availability:", error);
    }
);
```


## 4. Some URI Schemes / Package Names

Twitter:
* iOS: `twitter://`
* Android: `com.twitter.android`

Facebook:
* iOS: `fb://`
* Android: `com.facebook.katana`

WhatsApp:
* iOS: `whatsapp://` (only since v. 2.10.1, [more information](http://www.whatsapp.com/faq/en/iphone/23559013))
* Android: `com.whatsapp`

## 5. License

[The MIT License (MIT)](http://www.opensource.org/licenses/mit-license.html)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
