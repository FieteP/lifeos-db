import { WebPlugin } from '@capacitor/core';
import { AppPickerPlugin, InstalledApp } from './definitions';

export class AppPickerWeb extends WebPlugin implements AppPickerPlugin {
  async getInstalledApps(): Promise<{ apps: InstalledApp[] }> {
    // Web fallback - return empty list with message
    console.warn('AppPicker: Native app list not available in web browser.');
    return { apps: [] };
  }

  async openApp(_options: { packageName: string }): Promise<void> {
    throw this.unavailable('Not available on web.');
  }
}
