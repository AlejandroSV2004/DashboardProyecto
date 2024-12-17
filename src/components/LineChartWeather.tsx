import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

const extractDate = (input: string): string => {
  return input.split(' ')[0];
};

const formatoHora = (dateTime: string): string => {
  return new Date(dateTime).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

interface LineChartWeatherProps {
  selectedDate: string;
}

export default function LineChartWeather({ selectedDate }: LineChartWeatherProps) {
  const [gust, setGust] = useState<number[]>([]);
  const [speed, setSpeed] = useState<number[]>([]);
  const [tag, setTag] = useState<string[]>([]);

  const apiURL =
    'https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=49a55d3a262760dea88cf2ac7628e71e';

  useEffect(() => {
    if (!selectedDate) return;

    fetch(apiURL)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');
        const timeElements = Array.from(xmlDoc.getElementsByTagName('time'));

        const filteredElements = timeElements.filter((time) => {
          const timeFrom = time.getAttribute('from') || '';
          return timeFrom.startsWith(extractDate(selectedDate.toString())); // Filtra por fecha seleccionada
        });

        const extractedGust: number[] = [];
        const extractedSpeed: number[] = [];
        const extractedTags: string[] = [];

        for (const time of filteredElements) {
          const timeTag = formatoHora(time.getAttribute('from') || '');
          const windGust = parseFloat(time.querySelector('windGust')?.getAttribute('gust') || '0');
          const windSpeed = parseFloat(time.querySelector('windSpeed')?.getAttribute('mps') || '0');

          extractedGust.push(windGust);
          extractedSpeed.push(windSpeed);
          extractedTags.push(timeTag);
        }

        setGust(extractedGust);
        setSpeed(extractedSpeed);
        setTag(extractedTags);
      })
      .catch((error) => console.error('Error:', error));
  }, [selectedDate]);

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography variant="h6" component="div" align="center">
        Viento
      </Typography>

      {/* Mostrar mensaje si no hay datos */}
      {speed.length === 0 && gust.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Selecciona una fecha para revisar sus datos
        </Typography>
      ) : (
        <LineChart
          width={400}
          height={250}
          series={[
            { data: speed, label: 'Velocidad' },
            { data: gust, label: 'Ráfaga' },
          ]}
          xAxis={[{ scaleType: 'point', data: tag, label: extractDate(selectedDate.toString()) }]}
          yAxis={[{ label: 'm/s' }]}
        />
      )}
    </Paper>
  );
}
