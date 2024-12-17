import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface TemperatureIndicatorProps {
  temperatureKelvin?: string; // Temperatura en grados Kelvin como string
}

export default function TemperatureIndicator({
  temperatureKelvin,
}: TemperatureIndicatorProps) {
  // Función para determinar el estado de la temperatura
  const getTemperatureMessage = (): { status: string; advice: string } => {
    if (!temperatureKelvin) return { status: '-', advice: 'Selecciona una fecha y hora' };

    const tempKelvin = parseFloat(temperatureKelvin); // Convertir a número
    if (isNaN(tempKelvin)) return { status: '-', advice: 'Selecciona una fecha y hora' };

    // Equivalencias de Celsius en Kelvin
    const celsius19 = 19 + 273.15; // 292.15 Kelvin
    const celsius26 = 26 + 273.15; // 299.15 Kelvin
    const celsius12 = 12 + 273.15; // 285.15 Kelvin

    // Condiciones con sus respectivos consejos
    if (tempKelvin > celsius26) return { status: '¡Qué calor!', advice: 'Hidrátate bien' };
    if (tempKelvin >= celsius19 && tempKelvin <= celsius26)
      return { status: 'Día agradable', advice: 'Disfruta' };
    if (tempKelvin > celsius12 && tempKelvin < celsius19)
      return { status: 'Está fresco', advice: 'Temperatura templada' };
    if (tempKelvin <= celsius12) return { status: '¡Qué frío!', advice: 'Abrígate bien' };

    return { status: '-', advice: 'Selecciona una fecha y hora' };
  };

  const { status, advice } = getTemperatureMessage();

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
        Estado de la Temperatura
      </Typography>

      {/* Estado del clima */}
      <Typography component="p" variant="h4">
        {status}
      </Typography>

      {/* Consejo */}
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {advice}
      </Typography>
    </Paper>
  );
}
