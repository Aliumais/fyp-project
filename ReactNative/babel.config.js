module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Reanimated plugin if needed
    [
      '@babel/plugin-transform-private-methods', 
      {
        loose: true, // Set loose mode
      }
    ],
    [
      '@babel/plugin-transform-class-properties', 
      {
        loose: true, // Set loose mode for class properties
      }
    ],
    [
      '@babel/plugin-transform-private-property-in-object', 
      {
        loose: true, // Set loose mode for private properties
      }
    ]
  ]
};
