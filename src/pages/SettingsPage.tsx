import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Smartphone } from 'lucide-react';
import { 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { ShortcutConfigs, defaultConfigs } from '../types/settings';
import { AppPicker, InstalledApp } from '../plugins/AppPicker';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<ShortcutConfigs>(defaultConfigs);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditKey, setCurrentEditKey] = useState<keyof ShortcutConfigs | null>(null);
  const [editType, setEditType] = useState<'internal' | 'app' | 'url'>('app');
  const [editValue, setEditValue] = useState('');
  const [editLabel, setEditLabel] = useState('');
  
  // Native App Picker
  const [appPickerOpen, setAppPickerOpen] = useState(false);
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [filteredApps, setFilteredApps] = useState<InstalledApp[]>([]);
  const [appSearch, setAppSearch] = useState('');
  const [loadingApps, setLoadingApps] = useState(false);
  const [isNativeAvailable, setIsNativeAvailable] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('life-os-shortcut-configs');
    if (saved) {
      setConfigs(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  const saveConfigs = (newConfigs: ShortcutConfigs) => {
    setConfigs(newConfigs);
    localStorage.setItem('life-os-shortcut-configs', JSON.stringify(newConfigs));
  };

  const openEditDialog = (key: keyof ShortcutConfigs) => {
    const current = configs[key];
    setCurrentEditKey(key);
    setEditType(current.type);
    setEditValue(current.value);
    setEditLabel(current.label);
    setEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (!currentEditKey) return;

    const newConfigs = {
      ...configs,
      [currentEditKey]: {
        type: editType,
        value: editValue.trim(),
        label: editLabel.trim() || editValue.trim()
      }
    };

    saveConfigs(newConfigs);
    setEditDialogOpen(false);
    setCurrentEditKey(null);
  };

  const resetToDefaults = () => {
    saveConfigs(defaultConfigs);
  };

  // Open native app picker
  const openNativeAppPicker = async () => {
    setLoadingApps(true);
    setAppSearch('');
    
    try {
      const result = await AppPicker.getInstalledApps();
      const apps = result.apps || [];
      
      setInstalledApps(apps);
      setFilteredApps(apps);
      setIsNativeAvailable(apps.length > 0);
      setAppPickerOpen(true);
    } catch (error) {
      console.error('Failed to get installed apps:', error);
      setIsNativeAvailable(false);
      setInstalledApps([]);
      setFilteredApps([]);
      setAppPickerOpen(true);
    }
    
    setLoadingApps(false);
  };

  // Filter apps when searching
  useEffect(() => {
    if (!appSearch) {
      setFilteredApps(installedApps);
    } else {
      const filtered = installedApps.filter(app =>
        app.appName.toLowerCase().includes(appSearch.toLowerCase()) ||
        app.packageName.toLowerCase().includes(appSearch.toLowerCase())
      );
      setFilteredApps(filtered);
    }
  }, [appSearch, installedApps]);

  // Select app from native picker
  const selectNativeApp = (app: InstalledApp) => {
    if (!currentEditKey) return;

    const newConfigs = {
      ...configs,
      [currentEditKey]: {
        type: 'app' as const,
        value: app.packageName,
        label: app.appName
      }
    };

    saveConfigs(newConfigs);
    setAppPickerOpen(false);
    setEditDialogOpen(false);
    setCurrentEditKey(null);
    setAppSearch('');
  };

  const shortcuts = [
    { key: 'training' as const, title: 'Training' },
    { key: 'schule' as const, title: 'Schule' },
    { key: 'aufgaben' as const, title: 'Aufgaben' },
    { key: 'kalender' as const, title: 'Kalender' },
    { key: 'sparziele' as const, title: 'Sparziele' },
    { key: 'klettertraining' as const, title: 'Klettertraining' },
    { key: 'schulapps' as const, title: 'Schulapps' },
    { key: 'wetter' as const, title: 'Wetter' }
  ];

  const getTypeLabel = (type: string) => {
    if (type === 'internal') return 'Intern';
    if (type === 'app') return 'App';
    return 'Website';
  };

  return (
    <div className="app-container">
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px',
          cursor: 'pointer',
          fontSize: '15px'
        }}
      >
        <ArrowLeft size={20} /> Zurück
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Einstellungen
        </Typography>
        <Button 
          onClick={resetToDefaults}
          size="small"
          sx={{ color: 'var(--text-secondary)' }}
        >
          Zurücksetzen
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {shortcuts.map(({ key, title }) => {
          const config = configs[key];
          return (
            <div 
              key={key}
              className="school-option"
              style={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div className="school-option-text">{title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {getTypeLabel(config.type)}: {config.label}
                </div>
              </div>
              <button
                onClick={() => openEditDialog(key)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <Edit2 size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        PaperProps={{ className: 'dialog-paper' }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Shortcut bearbeiten</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel>Typ</InputLabel>
            <Select
              value={editType}
              label="Typ"
              onChange={(e) => setEditType(e.target.value as 'internal' | 'app' | 'url')}
            >
              <MenuItem value="internal">Intern (Life OS Seite)</MenuItem>
              <MenuItem value="app">App (vom Gerät auswählen)</MenuItem>
              <MenuItem value="url">Website (URL)</MenuItem>
            </Select>
          </FormControl>

          {editType === 'app' && (
            <Button 
              fullWidth 
              variant="contained" 
              startIcon={<Smartphone size={18} />}
              onClick={openNativeAppPicker}
              sx={{ 
                mb: 2, 
                backgroundColor: 'var(--accent)',
                '&:hover': { backgroundColor: '#4a6ad9' }
              }}
            >
              App vom Gerät auswählen
            </Button>
          )}

          <TextField
            fullWidth
            label={editType === 'app' ? 'App Paketname' : editType === 'url' ? 'Website URL' : 'Interner Pfad'}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={
              editType === 'app' 
                ? 'com.google.android.calendar' 
                : editType === 'url' 
                  ? 'https://example.com' 
                  : '/training'
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Anzeigename"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: 'var(--text-secondary)' }}>
            Abbrechen
          </Button>
          <Button 
            variant="contained" 
            onClick={saveEdit}
            disabled={!editValue.trim()}
            sx={{ backgroundColor: 'var(--accent)' }}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* Native App Picker Dialog */}
      <Dialog 
        open={appPickerOpen} 
        onClose={() => {
          setAppPickerOpen(false);
          setAppSearch('');
        }}
        PaperProps={{ className: 'dialog-paper' }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isNativeAvailable ? 'App vom Gerät auswählen' : 'Native App-Auswahl nicht verfügbar'}
        </DialogTitle>
        <DialogContent>
          {!isNativeAvailable && (
            <Typography sx={{ color: 'var(--text-secondary)', mb: 2 }}>
              Die App-Auswahl vom Gerät ist nur in der Android-Version verfügbar. 
              Bitte gib den Paketnamen manuell ein.
            </Typography>
          )}

          {loadingApps ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <CircularProgress sx={{ color: 'var(--accent)' }} />
            </div>
          ) : isNativeAvailable ? (
            <>
              <TextField
                fullWidth
                placeholder="App suchen..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                sx={{ mb: 2 }}
              />

              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {filteredApps.length > 0 ? (
                  filteredApps.map((app, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton onClick={() => selectNativeApp(app)}>
                        <ListItemText 
                          primary={app.appName} 
                          secondary={app.packageName}
                          primaryTypographyProps={{ color: 'white' }}
                          secondaryTypographyProps={{ color: '#A8A8A8', fontSize: '12px' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Keine Apps gefunden" sx={{ color: '#A8A8A8' }} />
                  </ListItem>
                )}
              </List>
            </>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setAppPickerOpen(false);
            setAppSearch('');
          }}>
            Abbrechen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
