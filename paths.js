import path from 'path';
import { getDefaultConfig } from 'expo/metro-config';

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
      if (name.startsWith('@src')) {
        return path.resolve(__dirname, 'src', name.substring(4));
      }
      if (name.startsWith('@hooks')) {
        return path.resolve(__dirname, 'src/hooks', name.substring(6));
      }
      if (name.startsWith('@svgs')) {
        return path.resolve(__dirname, 'svgs', name.substring(5));
      }
      return path.join(process.cwd(), `node_modules/${name}`);
    },
  }
);

export default config;