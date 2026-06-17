import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Typography } from '@mui/material';
import itsLearningLogo from '../assets/itsLearning Logo.jpg';
import vpMobilLogo from '../assets/logo_vpmobil24.jpg';

const SchoolPage: React.FC = () => {
  const navigate = useNavigate();

  const schoolApps = [
    { 
      name: 'itsLearning', 
      logo: itsLearningLogo,
      link: 'itslearning://' 
    },
    { 
      name: 'Vertretungsplan (VP Mobil 24)', 
      logo: vpMobilLogo,
      link: 'https://www.vpmobil24.de' 
    },
    { 
      name: 'FuxNoten', 
      logo: null, // No logo yet, use text or icon
      link: 'https://fuxnoten.de' 
    }
  ];

  const handleAppClick = (app: { name: string; link: string }) => {
    window.open(app.link, '_blank');
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
          marginBottom: '24px',
          cursor: 'pointer',
          fontSize: '15px'
        }}
      >
        <ArrowLeft size={20} /> Zurück
      </button>

      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
        Schulapps
      </Typography>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {schoolApps.map((app, index) => (
          <div 
            key={index} 
            className="school-option"
            onClick={() => handleAppClick(app)}
          >
            {app.logo ? (
              <img 
                src={app.logo} 
                alt={app.name} 
                style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 8,
                  objectFit: 'contain'
                }} 
              />
            ) : (
              <div style={{ 
                width: 40, 
                height: 40, 
                backgroundColor: '#3b82f6',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600
              }}>
                FN
              </div>
            )}
            <div className="school-option-text">{app.name}</div>
          </div>
        ))}
      </div>

      {/* Hint removed as requested */}
    </div>
  );
};

export default SchoolPage;
