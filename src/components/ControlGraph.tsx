import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface ControlWeatherProps {
    onDateChange: (date: string) => void; // Prop para enviar el valor seleccionado
  }
  const formatFechaHora = (fecha: string): string => {
    if (!fecha) return ''; // Si la fecha está vacía, retornar cadena vacía
    
    const date = new Date(fecha);
  
    // Extraer componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses base 0
    const day = String(date.getDate()).padStart(2, '0');
  
    // Retornar el formato deseado
    return `${year}-${month}-${day}`;
  };
  
export default function ControlWeather({ onDateChange }: ControlWeatherProps) {
    const apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=49a55d3a262760dea88cf2ac7628e71e';
    const [dates, setDates] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>('');

    useEffect(() => {
        fetch(apiURL)
            .then((response) => {
                if (!response.ok) throw new Error('Error al obtener los datos');
                return response.text();
            })
            .then((data) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, 'application/xml');
                const timeElements = xmlDoc.getElementsByTagName('time');

                // Extraer todos los atributos "from" en un arreglo
                const extractedDates: string[] = [];
                for (let i = 0; i < timeElements.length; i++) {
                    const dateFrom = timeElements[i].getAttribute('from') || '';
                    const formattedDate = formatFechaHora(dateFrom);
                    if (!extractedDates.includes(formattedDate)) {
                        extractedDates.push(formattedDate);
                    }
                }
                setDates(extractedDates);
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    const handleChange = (event: SelectChangeEvent) => {
        const selectedDate: string = event.target.value.valueOf(); // Convertir a string primitivo
        setSelected(selectedDate);
        onDateChange(selectedDate); // Enviar el valor a App.tsx
      };
      

    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography mb={2} component="h3" variant="h6" color="primary">
                Revisión de viento por fecha
            </Typography>

            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="date-select-label">Fecha</InputLabel>
                    <Select
                        labelId="date-select-label"
                        id="date-select"
                        value={selected}
                        label="Fechas"
                        onChange={handleChange}
                    >
                        {dates.map((date, index) => (
                            <MenuItem key={index} value={date}>
                                {date}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

        </Paper>
    );
}