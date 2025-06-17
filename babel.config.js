module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blocklist: null,
      allowlist: ['OPENROUTE_API_KEY'],
      safe: false,
      allowUndefined: false
    }]
  ]
};
