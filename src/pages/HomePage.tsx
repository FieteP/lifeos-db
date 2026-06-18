import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Dumbbell, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  Target, 
  Mountain, 
  School, 
  CloudSun,
  Settings 
} from 'lucide-react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography 
} from '@mui/material';
import { useTrainingStatus } from '../hooks/useTrainingStatus';
import { useWeather } from '../hooks/useWeather';
import { ShortcutConfigs, defaultConfigs, ShortcutConfig } from '../types/settings';
import { AppLauncher } from '@capacitor/app-launcher';

interface CardData {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  configKey: keyof ShortcutConfigs;
}

const iconMap: Record<keyof ShortcutConfigs, React.ReactNode> = {
  training: <Dumbbell size={28} />,
  schule: <BookOpen size={28} />,
  aufgaben: <CheckSquare size={28} />,
  kalender: <Calendar size={28} />,
  sparziele: <Target size={28} />,
  klettertraining: <Mountain size={28} />,
  schulapps: <School size={28} />,
  wetter: <CloudSun size={28} />,
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { completed } = useTrainingStatus();
  const weather = useWeather();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [configs, setConfigs] = useState<ShortcutConfigs>(defaultConfigs);

  useEffect(() => {
    const saved = localStorage.getItem('life-os-shortcut-configs');
    if (saved) {
      setConfigs(JSON.parse(saved));
    }
  }, []);

  const today = new Date();
  const dayName = format(today, 'EEEE', { locale: de });
  const dateString = format(today, 'dd. MMMM', { locale: de });

  const weatherLabel = weather.loading 
    ? '...' 
    : weather.error 
      ? 'Wetter' 
      : `${weather.temperature}°`;

  const infoItems = [
    { icon: <Dumbbell size={18} />, label: 'FL Focus' },
    { icon: <BookOpen size={18} />, label: 'Schule' },
    { icon: <CloudSun size={18} />, label: weatherLabel }
  ];

  const handleShortcut = async (config: ShortcutConfig) => {
    if (config.type === 'internal') {
      navigate(config.value);
    } else if (config.type === 'url') {
      window.open(config.value, '_blank');
    } else if (config.type === 'app') {
      try {
        // Use Capacitor AppLauncher to open the app
        const result = await AppLauncher.openUrl({ 
          url: `package:${config.value}` 
        });
        
        if (!result.completed) {
          // App not found
          setDialogMessage(`Die App "${config.label}" wurde nicht gefunden.`);
          setDialogOpen(true);
        }
      } catch (error) {
        // Fallback to deep link
        const deepLink = `intent://${config.value}#Intent;scheme=package;end`;
        const a = document.createElement('a');
        a.href = deepLink;
        a.click();

        setTimeout(() => {
          setDialogMessage(`Die App "${config.label}" konnte nicht geöffnet werden.`);
          setDialogOpen(true);
        }, 1200);
      }
    }
  };

  const cards: CardData[] = [
    { icon: iconMap.training, title: 'Training', configKey: 'training' },
    { icon: iconMap.schule, title: 'Schule', configKey: 'schule' },
    { icon: iconMap.aufgaben, title: 'Aufgaben', configKey: 'aufgaben' },
    { icon: iconMap.kalender, title: 'Kalender', configKey: 'kalender' },
    { icon: iconMap.sparziele, title: 'Sparziele', configKey: 'sparziele' },
    { icon: iconMap.klettertraining, title: 'Klettertraining', configKey: 'klettertraining' },
    { icon: iconMap.schulapps, title: 'Schulapps', configKey: 'schulapps' },
    { icon: iconMap.wetter, title: 'Wetter', configKey: 'wetter' },
  ];

  const closeDialog = () => setDialogOpen(false);

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="date-day">{dayName}</div>
          <div className="date-full">{dateString}</div>
        </div>
        
        <button 
          onClick={() => navigate('/settings')}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', padding: '8px', cursor: 'pointer' }}
        >
          <Settings size={22} />
        </button>
      </div>

      {/* Info Card - not clickable */}
      <div className="info-card">
        {infoItems.map((item, index) => (
          <div key={index} className="info-item">
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid-container">
        {cards.map((card, index) => {
          const config = configs[card.configKey];
          return (
            <div 
              key={index} 
              className="card" 
              onClick={() => handleShortcut(config)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-icon">{card.icon}</div>
              <div className="card-title">{config.label}</div>
              {card.configKey === 'training' && completed && (
                <div className="card-subtitle">Erledigt</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={closeDialog}
        PaperProps={{ className: 'dialog-paper', style: { minWidth: '320px' } }}
      >
        <DialogTitle className="dialog-title">App nicht gefunden</DialogTitle>
        <DialogContent>
          <Typography className="dialog-content">{dialogMessage}</Typography>
          <Typography sx={{ mt: 1.5, color: 'var(--text-secondary)' }}>
            Möchtest du sie aus dem Play Store herunterladen?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={closeDialog} sx={{ color: 'var(--text-secondary)' }}>Abbrechen</Button>
          <Button 
            variant="contained" 
            onClick={closeDialog}
            sx={{ backgroundColor: 'var(--accent)' }}
          >
            Zum Store
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;
