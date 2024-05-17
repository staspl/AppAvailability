#import "AppAvailability.h"
#import <Cordova/CDV.h>

@implementation AppAvailability

/**
 * Check the availability of an app by its URL scheme.
 *
 * @param command The CDVInvokedUrlCommand object containing the URL scheme to check.
 */
- (void)checkAvailability:(CDVInvokedUrlCommand*)command {
    CDVPluginResult* pluginResult = nil;
    NSString* scheme = [command.arguments objectAtIndex:0];
    
    if (scheme != nil && [scheme length] > 0) {
        NSString *urlString = [scheme hasPrefix:@"://"] ? scheme : [NSString stringWithFormat:@"%@://", scheme];
        NSURL *url = [NSURL URLWithString:urlString];
        if ([[UIApplication sharedApplication] canOpenURL:url]) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
        }
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid URL scheme."];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
