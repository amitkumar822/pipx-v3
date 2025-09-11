const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Performance optimizations
config.resolver.platforms = ["ios", "android", "native", "web"];

// Enable tree shaking for better bundle size
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Optimize asset handling
config.resolver.assetExts.push("lottie");

// Enable hermes for better performance
config.transformer.hermesCommand = "hermes";

module.exports = withNativeWind(config, { input: "./global.css" });
