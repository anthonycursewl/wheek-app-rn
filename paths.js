const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add the following to handle the @assets alias
config.resolver.extraNodeModules = new Proxy(
  {},
  {
    get: (target, name) => {
      if (name === '@assets') {
        return path.resolve(__dirname, 'assets');
      }
      if (name === '@components') {
        return path.resolve(__dirname, 'components');
      }
      if (name === '@flux') {
        return path.resolve(__dirname, 'flux');
      }
      if (name.startsWith('@/')) {
        return path.resolve(__dirname, 'src', name.substring(2));
      }
      return path.join(process.cwd(), `node_modules/${name}`);
    },
  }
);

module.exports = config;
