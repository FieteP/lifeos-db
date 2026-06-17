import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Check } from 'lucide-react';
import { Button, Typography } from '@mui/material';
import { trainingPlan, type DayKey } from '../types/training';
import { useTrainingStatus } from '../hooks/useTrainingStatus';

const TrainingDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { completed, toggleCompleted } = useTrainingStatus();

  const today = new Date();
  const dayKey = format(today, 'EEEE').toLowerCase() as DayKey;
  const dayData = trainingPlan[dayKey] || trainingPlan.sunday;

  const handleAction = () => {
    if (dayData.buttonAction === 'start') {
      // Simulate opening training app or mark as done
      toggleCompleted();
    } else if (dayData.buttonAction === 'thenics') {
      window.open('https://thenics.app', '_blank');
    } else if (dayData.buttonAction === 'klettertraining') {
      window.open('https://klettertraining.de', '_blank');
    }
  };

  const isRestDay = dayData.buttonAction === 'rest';

  return (
    <div className="detail-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            marginRight: '12px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={22} />
        </button>
        <div>
          <div className="detail-title">Training</div>
          <div className="detail-subtitle">{dayData.day}</div>
        </div>
      </div>

      {isRestDay ? (
        // Rest Day
        <div className="rest-card">
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            REST DAY
          </Typography>
          <div className="rest-text">Take recovery seriously.</div>
        </div>
      ) : (
        <>
          {/* Skill Section */}
          <div className="detail-section">
            <div className="section-title">Skill</div>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {dayData.skill}
            </Typography>
          </div>

          {/* Exercises */}
          {dayData.exercises.length > 0 && (
            <div className="detail-section">
              <div className="section-title">Zusatz</div>
              <div className="exercise-list">
                {dayData.exercises.map((exercise, index) => (
                  <div key={index} className="exercise-item">
                    {exercise}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goal */}
          {dayData.goal && (
            <div className="detail-section">
              <div className="section-title">Ziel</div>
              <div className="goal-text">{dayData.goal}</div>
            </div>
          )}

          {/* Action Button */}
          <button 
            className="action-button" 
            onClick={handleAction}
          >
            {dayData.buttonText}
          </button>

          {/* Mark as completed */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <Button
              variant="outlined"
              onClick={toggleCompleted}
              startIcon={completed ? <Check size={18} /> : null}
              sx={{
                color: completed ? '#4ade80' : 'var(--text-secondary)',
                borderColor: 'rgba(255,255,255,0.15)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.03)'
                }
              }}
            >
              {completed ? 'Training erledigt ✓' : 'Als erledigt markieren'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TrainingDetailPage;
