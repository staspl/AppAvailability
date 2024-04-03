#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
    console.log('Hook script update_ios_plist.js is executing.');

    try {
        const projectRoot = context.opts.projectRoot;
        const projectName = context.opts.projectName;
        console.log('Project Root:', projectRoot);
        console.log('Project Name:', projectName);

        if (!projectRoot || !projectName) {
            throw new Error('Project root or name is not defined.');
        }

        const iosPlatformDir = path.join(projectRoot, 'platforms/ios', projectName);
        console.log('iOS Platform Directory:', iosPlatformDir);

        const appPlistPath = path.join(iosPlatformDir, projectName + '-Info.plist');

        if (!fs.existsSync(appPlistPath)) {
            throw new Error('Info.plist not found.');
        }

        let urlSchemes = context.opts.cli_variables.CORDOVA_IOS_URL_SCHEMES;
        if (!urlSchemes) {
            throw new Error('CORDOVA_IOS_URL_SCHEMES variable not provided.');
        }

        let plistData = fs.readFileSync(appPlistPath, 'utf8');
        let lines = plistData.split('\n');

        let index = lines.findIndex(line => line.includes('<key>LSApplicationQueriesSchemes</key>'));

        if (index === -1) {
            throw new Error('LSApplicationQueriesSchemes key not found in Info.plist.');
        }

        let startIndex = lines.findIndex((line, i) => i > index && line.includes('<array>'));
        let endIndex = lines.findIndex((line, i) => i > startIndex && line.includes('</array>'));

        if (startIndex === -1 || endIndex === -1) {
            throw new Error('Invalid Info.plist format.');
        }

        let existingSchemes = [];
        for (let i = startIndex + 1; i < endIndex; i++) {
            if (lines[i].includes('<string>')) {
                existingSchemes.push(lines[i].trim().replace('<string>', '').replace('</string>', ''));
            }
        }

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
