#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { ConfigParser } = require('cordova-common');

module.exports = function (context) {
    console.log('Hook script update_ios_plist.js is executing.');

    const configXmlPath = path.resolve(context.opts.projectRoot, 'config.xml');
    const appConfig = new ConfigParser(configXmlPath);
    const projectName = appConfig.name();
    console.log('Project Name:', projectName);

    try {
        const iosPlatformDir = path.join(context.opts.projectRoot, 'platforms/ios', projectName);

        if (!fs.existsSync(iosPlatformDir)) {
            throw new Error('iOS platform directory not found.');
        }

        const appPlistPath = path.join(iosPlatformDir, projectName + '-Info.plist');

        if (!fs.existsSync(appPlistPath)) {
            throw new Error('Info.plist not found.');
        }

        let urlSchemes = context.opts.cli_variables.CORDOVA_IOS_URL_SCHEMES;
        if (!urlSchemes) {
            console.log('CORDOVA_IOS_URL_SCHEMES variable not provided.');
            return; // Exit early if urlSchemes is empty
        }

        let plistData = fs.readFileSync(appPlistPath, 'utf8');
        let lines = plistData.split('\n');

        let index = lines.findIndex(line => line.includes('<key>LSApplicationQueriesSchemes</key>'));

        if (index === -1) {
            // If LSApplicationQueriesSchemes key not found, add it before adding URL schemes
            let arrayEndIndex = lines.findIndex((line, i) => i > index && line.includes('</array>'));
            if (arrayEndIndex === -1) {
                throw new Error('Invalid Info.plist format.');
            }
            lines.splice(arrayEndIndex, 0, '    <key>LSApplicationQueriesSchemes</key>', '    <array>');
            index = arrayEndIndex; // Reset index to the newly added LSApplicationQueriesSchemes key position
        }

        // Find the end index of the array
        let endIndex = lines.findIndex((line, i) => i > index && line.includes('</array>'));
        if (endIndex === -1) {
            throw new Error('Invalid Info.plist format.');
        }

        // Extract existing schemes
        let existingSchemes = [];
        for (let i = index + 1; i < endIndex; i++) {
            if (lines[i].includes('<string>')) {
                existingSchemes.push(lines[i].trim().replace('<string>', '').replace('</string>', ''));
            }
        }

        // Add new URL schemes
        let newSchemes = urlSchemes.split(',').map(scheme => scheme.trim()).filter(scheme => !existingSchemes.includes(scheme));
        if (newSchemes.length === 0) {
            console.log('No new URL Schemes to add.');
            return;
        }
        lines.splice(endIndex, 0, ...newSchemes.map(scheme => `    <string>${scheme}</string>`));

        let updatedPlistData = lines.join('\n');

        fs.writeFileSync(appPlistPath, updatedPlistData, 'utf8');

        console.log('Info.plist updated successfully.');
    } catch (error) {
        console.error('An error occurred:', error.message);
        process.exitCode = 1;
    }
};
