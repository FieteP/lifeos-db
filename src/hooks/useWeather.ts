import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  loading: boolean;
  error: string | null;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        
        if (!response.ok) throw new Error('Wetterdaten konnten nicht geladen werden');
        
        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        
        setWeather({
          temperature: temp,
          loading: false,
          error: null
        });
      } catch (err) {
        setWeather({
          temperature: 0,
          loading: false,
          error: 'Wetter nicht verfügbar'
        });
      }
    };

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback to a default location (Neubrandenburg) if permission denied
          fetchWeather(53.56, 13.26);
        },
        { timeout: 10000 }
      );
    } else {
      // Fallback
      fetchWeather(52.52, 13.405);
    }
  }, []);

  return weather;
}
