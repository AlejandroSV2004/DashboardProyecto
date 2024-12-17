import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import despejado from '../img/despejado.png';
import nublado from '../img/nublado.png';
import lluvioso from '../img/lluvioso.png';
import defaultImage from '../img/default.png';

interface IndicatorWeatherProps {
  clouds: string;          // Valor de clouds (e.g., "broken clouds", "scattered clouds")
  precipitation: string;   // Probabilidad de precipitación como string (e.g., "0.2", "0.5")
}

export default function IndicatorWeather({ clouds, precipitation }: IndicatorWeatherProps) {
  // Función para determinar el estado del clima
  const getWeatherStatus = (): string => {
    const precipitationValue = parseFloat(precipitation); // Casting a número
    if (isNaN(precipitationValue) || !clouds) return 'Seleccione una fecha y hora'; // Estado por defecto
    if (precipitationValue > 0.3) return 'lluvioso';
    if (clouds.toLowerCase() === 'broken clouds') return 'despejado';
    return 'nublado';
  };

  // Función para obtener la imagen correspondiente
  const getWeatherIcon = (status: string): string => {
    switch (status) {
      case 'lluvioso':
        return lluvioso;
      case 'despejado':
        return despejado;
      case 'nublado':
        return nublado;
      default:
        return defaultImage; // Imagen por defecto
    }
  };

  const weatherStatus = getWeatherStatus(); // Determinar estado del clima
  const weatherIcon = getWeatherIcon(weatherStatus); // Obtener imagen correspondiente

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {/* Título */}
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Estado del Clima
      </Typography>

      {/* Renderizar la imagen */}
      <img
        src={weatherIcon}
        alt={weatherStatus}
        style={{ width: 50, height: 50 }}
      />

      {/* Nombre del clima */}
      <Typography component="p" variant="h6" color="text.secondary">
        {weatherStatus.charAt(0).toUpperCase() + weatherStatus.slice(1)} {/* Primera letra mayúscula */}
      </Typography>
    </Paper>
  );
}
