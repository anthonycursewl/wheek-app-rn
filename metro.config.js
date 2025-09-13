const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable fast refresh and hot reloading
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return middleware;
  },
};

// Add custom resolver configuration to handle potential issues
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure proper asset extensions
config.resolver.assetExts.push(
  // Add any custom asset extensions if needed
  'db', 'mp3', 'ttf', 'obj', 'png', 'jpg'
);

// Ensure proper source extensions
config.resolver.sourceExts.push('cjs');

// Enable watchman for file watching (helps with hot reload)
config.watchFolders = [];

module.exports = config;
