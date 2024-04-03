#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    console.log('Hook script update_android_manifest.js is executing.');

    const androidPlatformDir = path.join(context.opts.projectRoot, 'platforms/android');
    const manifestPath = path.join(androidPlatformDir, 'app/src/main/AndroidManifest.xml');

    if (!fs.existsSync(manifestPath)) {
        console.error('AndroidManifest.xml not found.');
        return;
    }

    let queriesValue = context.opts.cli_variables.CORDOVA_ANDROID_QUERIES;
    if (!queriesValue) {
        console.error('CORDOVA_ANDROID_QUERIES variable not provided.');
        return;
    }

    fs.readFile(manifestPath, 'utf-8', (err, data) => {
        if (err) throw err;

        let updatedManifest = data;
        let queriesIndex = data.indexOf('<queries>'); // Check if <queries> exists

        let packages = ''; // Accumulate package elements

        queriesValue.split(',').forEach(packageName => {
            packages += `<package android:name="${packageName}"/>`;
        });

        if (queriesIndex !== -1) {
            // If <queries> exists, append new packages inside it
            let endIndex = data.indexOf('</queries>', queriesIndex);
            updatedManifest = data.slice(0, endIndex) + packages + data.slice(endIndex);
        } else {
            // If <queries> doesn't exist, add it with all packages
            updatedManifest = data.replace('</manifest>', `<queries>${packages}</queries></manifest>`);
        }

        fs.writeFile(manifestPath, updatedManifest, (err) => {
            if (err) throw err;
        });
    });
};
