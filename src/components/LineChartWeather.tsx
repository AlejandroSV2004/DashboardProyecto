import Paper from '@mui/material/Paper';
 import { LineChart } from '@mui/x-charts/LineChart';
 import Typography from '@mui/material/Typography';
 import { useEffect, useState } from 'react';
 import Grid from '@mui/material/Grid2';
 import ControlGraph from './ControlGraph';

 
 const formatoHora = (dateTime: string): string => {
    // Convierte el parámetro a un objeto Date y extrae la hora en formato HH:MM:SS
    const timeString = new Date(dateTime).toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    return timeString; // Devuelve la cadena formateada
  };
  export default function LineChartWeather() {
    const [selectedDate, setSelectedDate] = useState<string>(''); // Fecha seleccionada
    const [gust, setGust] = useState<number[]>([]);
    const [speed, setSpeed] = useState<number[]>([]);
    const [tag, setTag] = useState<string[]>([]);
  
    const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=49a55d3a262760dea88cf2ac7628e71e';
  
    const handleDateChange = (date: string) => {
      setSelectedDate(date); // Actualizar la fecha seleccionada
    };
  
    useEffect(() => {
      if (!selectedDate) return; // Evitar ejecutar si no hay fecha seleccionada
  
      fetch(apiURL)
        .then((response) => {
          if (!response.ok) throw new Error('Error al obtener los datos');
          return response.text();
        })
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'application/xml');
          const timeElements = Array.from(xmlDoc.getElementsByTagName('time'));
  
          // Filtrar los elementos correspondientes a la fecha seleccionada
          const filteredElements = timeElements.filter((time) => {
            const timeFrom = time.getAttribute('from') || '';
            return timeFrom.startsWith(selectedDate); // Comparar fecha
          });
  
          // Extraer datos filtrados
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
  
          setTag(extractedTags);
          setGust(extractedGust);
          setSpeed(extractedSpeed);
        })
        .catch((error) => console.error('Error:', error));
    }, [selectedDate]); 
     return (
         <Paper
         sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centra el título horizontalmente
            gap: 2, // Espaciado entre elementos
        }}
         >
            <Typography variant="h6" component="div" align="center">
                Viento
            </Typography>
            <Grid size={{ xs: 12}}>
            <ControlGraph onDateChange={handleDateChange} />
          </Grid>

             {/* Componente para un gráfico de líneas */}
             <LineChart
                 width={400}
                 height={250}
                 series={[
                     { data: speed, label: 'Velocidad' },
                     { data: gust, label: 'Ráfaga' },
                 ]}
                 xAxis={[{ scaleType: 'point', data: tag , label: 'Hora de hoy'}]}
                 yAxis={[{ label: 'm/s' }]}
             />
             
         </Paper>
     );
 }