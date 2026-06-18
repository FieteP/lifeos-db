import { registerPlugin } from '@capacitor/core';
import { AppPickerPlugin } from './definitions';
import { AppPickerWeb } from './web';

const AppPicker = registerPlugin<AppPickerPlugin>('AppPicker', {
  web: () => new AppPickerWeb(),
});

export * from './definitions';
export { AppPicker };
