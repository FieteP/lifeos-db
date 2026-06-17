import { useState, useEffect } from 'react';

const STORAGE_KEY = 'life-os-training-completed';

export function useTrainingStatus() {
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setCompleted(JSON.parse(saved));
    }
  }, []);

  const toggleCompleted = () => {
    const newStatus = !completed;
    setCompleted(newStatus);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
  };

  const resetCompleted = () => {
    setCompleted(false);
    localStorage.setItem(STORAGE_KEY, 'false');
  };

  return { completed, toggleCompleted, resetCompleted };
}
