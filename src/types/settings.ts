export interface ShortcutConfig {
  type: 'internal' | 'app' | 'url';
  value: string;
  label: string;
}

export interface ShortcutConfigs {
  training: ShortcutConfig;
  schule: ShortcutConfig;
  aufgaben: ShortcutConfig;
  kalender: ShortcutConfig;
  sparziele: ShortcutConfig;
  klettertraining: ShortcutConfig;
  schulapps: ShortcutConfig;
  wetter: ShortcutConfig;
}

export const defaultConfigs: ShortcutConfigs = {
  training: { type: 'internal', value: '/training', label: 'Training' },
  schule: { type: 'internal', value: '/school', label: 'Schule' },
  aufgaben: { type: 'app', value: 'ticktick', label: 'TickTick' },
  kalender: { type: 'app', value: 'com.google.android.calendar', label: 'Google Kalender' },
  sparziele: { type: 'app', value: 'spargoals', label: 'Sparziele' },
  klettertraining: { type: 'url', value: 'https://klettertraining.de', label: 'Klettertraining' },
  schulapps: { type: 'internal', value: '/school', label: 'Schulapps' },
  wetter: { type: 'app', value: 'com.google.android.apps.weather', label: 'Google Wetter' }
};
