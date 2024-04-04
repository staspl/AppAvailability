#import "AppAvailability.h"
#import <Cordova/CDV.h>

@implementation AppAvailability

- (void)checkAvailability:(CDVInvokedUrlCommand*)command {
    CDVPluginResult* pluginResult = nil;
    
    NSArray* arguments = command.arguments;
    NSString* scheme = nil;
    
    if ([arguments count] > 0 && [arguments[0] isKindOfClass:[NSString class]]) {
        scheme = arguments[0];
    } else {
        // Invalid or missing argument
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid or missing URL scheme"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    
    if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:scheme]]) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:YES];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
