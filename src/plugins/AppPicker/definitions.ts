import { Plugin } from '@capacitor/core';

export interface InstalledApp {
  packageName: string;
  appName: string;
  icon?: string; // Base64 encoded icon (optional)
}

export interface AppPickerPlugin extends Plugin {
  getInstalledApps(): Promise<{ apps: InstalledApp[] }>;
  openApp(options: { packageName: string }): Promise<void>;
}
