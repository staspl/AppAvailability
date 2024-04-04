#ifndef AppAvailability_h
#define AppAvailability_h

#import <Cordova/CDV.h>

/**
 * AppAvailability Cordova plugin for checking if an app is available.
 */
@interface AppAvailability : CDVPlugin

/**
 * Checks the availability of the specified app.
 *
 * @param command The command sent from JavaScript.
 *                Expects a string argument representing the URL scheme of the app to check.
 */
- (void)checkAvailability:(CDVInvokedUrlCommand*)command;

@end

#endif /* AppAvailability_h */
