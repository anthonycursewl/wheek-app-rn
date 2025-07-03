module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@assets': './assets',
            '@components': './components',
            '@flux': './flux'
          },
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json',
            '.png',
            '.jpg',
            '.jpeg',
            '.gif',
            '.svg'
          ]
        }
      ]
    ]
  };
};
