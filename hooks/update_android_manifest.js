#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    console.log('Hook script update_android_manifest.js is executing.');

    var myVariable = JSON.stringify(context);
    console.log("My variable value is: " + myVariable);

    const cordovaCommon = context.requireCordovaModule('cordova-common');
    const androidPlatformDir = path.join(context.opts.projectRoot, 'platforms/android');
    const manifestPath = path.join(androidPlatformDir, 'app/src/main/AndroidManifest.xml');

    if (!fs.existsSync(manifestPath)) {
        console.error('AndroidManifest.xml not found.');
        return;
    }

    let queriesValue = context.opts.plugin.pluginInfo.getPreferences().CORDOVA_ANDROID_QUERIES;
    if (!queriesValue) {
        console.error('CORDOVA_ANDROID_QUERIES variable not provided.');
        return;
    }

    fs.readFile(manifestPath, 'utf-8', (err, data) => {
        if (err) throw err;

        let updatedManifest = data.replace('</manifest>', '');

        queriesValue.split(',').forEach(packageName => {
            updatedManifest += `<queries><package android:name="${packageName}"/></queries>`;
        });

        updatedManifest += '</manifest>';

        fs.writeFile(manifestPath, updatedManifest, (err) => {
            if (err) throw err;
        });
    });
};
