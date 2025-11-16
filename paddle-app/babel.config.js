module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Plugin pour résoudre les chemins absolus (avec @/)
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@api': './src/api',
          '@store': './src/store',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@theme': './src/theme',
          '@types': './src/types',
          '@assets': './src/assets',
        },
      },
    ],
    // Reanimated doit être le dernier plugin
    'react-native-reanimated/plugin',
    // Variables d'environnement
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
  ],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
};
