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
    
    NSURL *appURL = [NSURL URLWithString:scheme];
    NSBundle *bundle = [NSBundle bundleWithURL:appURL];
    
    if (bundle) {
        NSString *version = [bundle objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
        NSString *bundleIdentifier = [bundle bundleIdentifier];
        
        NSDictionary *appInfo = @{@"version": version, @"appId": bundleIdentifier};
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:appInfo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"App not found"];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
