#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { ConfigParser } = require('cordova-common');
const plist = require('plist');

function httpGet(url) {
    return new Promise((resolve, reject) => {
        const http = require(url.split(":")[0]);

        http.get(url, (resp) => {
            let chunks = [];

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                chunks.push(chunk);
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(Buffer.concat(chunks).toString('utf-8'));
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
}

module.exports = function (context) {
    (async () => {
        console.log('Hook script update_ios_plist.js is executing.');

        let urlSchemes = context.opts.cli_variables.Read_IOS_Schemas_By_Url;
        if (!urlSchemes) {
            console.log('CORDOVA_IOS_URL_SCHEMES variable not provided.');
            return; // Exit early if urlSchemes is empty
        }

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
            let plistObject = plist.parse(plistData);

            // Add LSApplicationQueriesSchemes key
            if (!plistObject.hasOwnProperty('LSApplicationQueriesSchemes')) {
                plistObject['LSApplicationQueriesSchemes'] = [];
            }

            var apps;
            // Add new URL schemes
            let newSchemes = urlSchemes.split(',').map(scheme => scheme.trim());
            for (const i in newSchemes) {
                const scheme = newSchemes[i];
                if (scheme.startsWith("http")) {
                    console.log("READAPPS: read from: " + scheme);
                    apps = await httpGet(scheme);
                    console.log("READAPPS: fetched: " + apps);
                    if (apps) {
                        let schemes = apps.split(',').map(remoteScheme => remoteScheme.trim());
                        schemes.forEach(remoteScheme => {
                            if (!plistObject['LSApplicationQueriesSchemes'].includes(remoteScheme)) {
                                plistObject['LSApplicationQueriesSchemes'].push(remoteScheme);
                            }
                        });
                    } else {
                        console.error('An error occurred: failed read apps');
                        process.exitCode = 1;
                    }
                } else {
                    if (!plistObject['LSApplicationQueriesSchemes'].includes(scheme)) {
                        plistObject['LSApplicationQueriesSchemes'].push(scheme);
                    }
                }
            }

            fs.writeFileSync(appPlistPath, plist.build(plistObject), 'utf8');

            console.log('Info.plist updated successfully.');
        } catch (error) {
            console.error('An error occurred:', error.message);
            process.exitCode = 1;
        }
    });
};
