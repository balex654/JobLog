import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.benalexander.Ride-Track',
  appName: 'Ride Track',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    iosScheme: 'https'
  }
};

export default config;
