const path = require("path");

module.exports = (context) => {
  const { ConfigParser } = context.requireCordovaModule("cordova-common");
  const appConfig = new ConfigParser(path.resolve(context.opts.projectRoot, "config.xml"));
  console.log(appConfig.name());
}
