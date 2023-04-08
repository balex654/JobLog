import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.benalexander.Ride-Track',
  appName: 'Ride Track',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    iosScheme: 'https'
  },
  cordova: {
    preferences: {
      DisableDeploy: 'false'
    }
  }
};

export default config;
