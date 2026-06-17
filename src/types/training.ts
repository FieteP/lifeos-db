export interface TrainingDay {
  day: string;
  skill: string;
  exercises: string[];
  goal: string;
  buttonText: string;
  buttonAction: 'start' | 'thenics' | 'klettertraining' | 'rest';
}

export const trainingPlan: Record<string, TrainingDay> = {
  monday: {
    day: 'Montag',
    skill: 'Front Lever Aktivierung',
    exercises: [
      'Tuck FL – 3 Sätze × max',
      'Scapula Arch Pull Ups – 3 Sätze × 5',
      'Hollow Body Hold – 2 Sätze × 30 Sekunden'
    ],
    goal: 'Aktivierung des Nervensystems',
    buttonText: 'Training starten',
    buttonAction: 'start'
  },
  tuesday: {
    day: 'Dienstag',
    skill: 'HSPU Thenics',
    exercises: [
      'Handstand Holds – 5 Minuten',
      'Weighted Decline Push Ups – 3 Sätze × max'
    ],
    goal: 'Push Strength',
    buttonText: 'Thenics öffnen',
    buttonAction: 'thenics'
  },
  wednesday: {
    day: 'Mittwoch',
    skill: 'Klettern',
    exercises: [],
    goal: '',
    buttonText: 'Klettertraining öffnen',
    buttonAction: 'klettertraining'
  },
  thursday: {
    day: 'Donnerstag',
    skill: 'Front Lever Thenics',
    exercises: [
      'Pull Ups',
      '3 wide',
      '3 normal',
      '3 close'
    ],
    goal: 'Pull Strength',
    buttonText: 'Thenics öffnen',
    buttonAction: 'thenics'
  },
  friday: {
    day: 'Freitag',
    skill: 'HSPU Thenics',
    exercises: [
      'Dips – 3 × 10',
      'Weighted Decline Push Ups – 3 × max'
    ],
    goal: 'Chest Growth',
    buttonText: 'Thenics öffnen',
    buttonAction: 'thenics'
  },
  saturday: {
    day: 'Samstag',
    skill: 'Front Lever Thenics',
    exercises: [
      'Hollow Body Hold – 2 × 30 Sekunden',
      'Pull Ups',
      '3 wide',
      '3 normal',
      '3 close'
    ],
    goal: '',
    buttonText: 'Thenics öffnen',
    buttonAction: 'thenics'
  },
  sunday: {
    day: 'Sonntag',
    skill: '',
    exercises: [],
    goal: '',
    buttonText: '',
    buttonAction: 'rest'
  }
};

export type DayKey = keyof typeof trainingPlan;
