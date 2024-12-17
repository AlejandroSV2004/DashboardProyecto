import './App.css';

// Grid 2
import Grid from '@mui/material/Grid2';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import Item from './interface/Item';
import { useEffect, useState } from 'react';
import ImageControl from './components/ImageControl'
import TemperatureIndicator from './components/TemperatureIndicator';
interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}



const formatFechaHora = (fecha: string): string => {
  if (!fecha) return 'Seleccione una fecha y hora'; // Si la fecha está vacía, retornar cadena vacía
  
  const date = new Date(fecha);

  // Extraer componentes de la fecha
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses base 0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Retornar el formato deseado
  return `${year}-${month}-${day} Hora: ${hours}:${minutes}`;
};


function App() {
  function kelvinToCelsius(kelvin: string): string {
    const kelvinNumber = parseFloat(kelvin);
  
    if (isNaN(kelvinNumber)) {
      console.error("El valor proporcionado no es un número válido.");
      return "0.00"; // Devuelve un valor por defecto en caso de error
    }
  
    return (kelvinNumber - 273.15).toFixed(2); // Devuelve la temperatura en formato string con 2 decimales
  }
  
  // Estados
  const [selectedDate, setSelectedDate] = useState<String>(''); // Fecha seleccionada
  const [items, setItems] = useState<Item[]>([]); // Todos los datos
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); // Datos filtrados
  const [feel,setFeel]=useState<string[][]>([]);
  const [filteredFeel, setFilteredFeel]=useState<string[]>([])
  const [indicators] = useState<Indicator[]>([]);

  // Manejador para la fecha seleccionada
  const handleDateChange = (date: String) => {
    setSelectedDate(date);
    console.log('Fecha seleccionada en ControlWeather:', date.valueOf());
  };

  // Obtener los datos del API
  useEffect(() => {
    const apiURL =
      'https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=49a55d3a262760dea88cf2ac7628e71e';

    fetch(apiURL)
      .then((response) => {
        if (!response.ok) throw new Error('Error al obtener los datos');
        return response.text();
      })
      .then((data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');
        const timeElements = xmlDoc.getElementsByTagName('time');
        const feels: string[][] = [];
        const dataToItems: Item[] = [];
        for (let i = 0; i < timeElements.length; i++) {
          const time = timeElements[i];
          const dateStart = time.getAttribute('from') || '';
          const dateEnd = time.getAttribute('to') || '';
          const precipitation =
            time.querySelector('precipitation')?.getAttribute('probability') || '0';
          const humidity = time.querySelector('humidity')?.getAttribute('value') || '0';
          const temperature = time.querySelector('temperature')?.getAttribute('value') || '0';
          const feelsLike = time.querySelector('feels_like')?.getAttribute('value') || '0';
          const clouds = time.querySelector('clouds')?.getAttribute('value') || '';
          dataToItems.push({ dateStart, dateEnd, precipitation, humidity, temperature });
          feels.push([dateStart,feelsLike,clouds,precipitation])
        }
        setFeel(feels);
        setItems(dataToItems); // Guardar todos los elementos
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  // Filtrar los datos cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      const filtered = items.filter((item) => formatFechaHora(item.dateStart as string) === selectedDate.valueOf());
      const filteredFeels = feel.filter((item) => formatFechaHora(item[0]) === selectedDate.valueOf());
      setFilteredItems(filtered);
      if (filteredFeels.length > 0) {
        setFilteredFeel(filteredFeels[0]);
      } else {
        setFilteredFeel(['', '','','']); // Valores por defecto
      } 

    }
  }, [selectedDate, items]);

  // Renderizar los indicadores
  const renderIndicators = () => {
    return indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: 12, md: 3 }}>
        <IndicatorWeather
          title={indicator['title']}
          subtitle={indicator['subtitle']}
          value={indicator['value']}
        />
      </Grid>
    ));
  };

  return (
    <Grid container spacing={5}>
      {/* Título Principal */}
      <Grid size={{ xs: 12 }}>
        <h1 style={{ textAlign: 'center' }}>El tiempo en Guayaquil</h1>
             </Grid>
      <Grid size={{ xs: 12 }}>
        <h3>
          Fecha seleccionada: {selectedDate ? selectedDate.toString() : 'Ninguna fecha seleccionada'}
        </h3>
      </Grid>
      {/* Selector de Fecha */}
      <Grid size={{ xs: 12, md: 4 }}>
            <ControlWeather onDateChange={handleDateChange} />
          </Grid>
      
      <Grid size={{ xs: 12, md: 4 }}>
      <ImageControl clouds={filteredFeel[2]} precipitation={filteredFeel[3]} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
      <TemperatureIndicator temperatureKelvin={filteredFeel[1]}/>
      </Grid>
  
      {/* Fecha Seleccionada */}
      
  
      {/* Indicadores */}
      {renderIndicators()}
  
      {/* Tabla */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
      <IndicatorWeather title={'Sensación térmica'} subtitle={formatFechaHora(filteredFeel[0])} value={`${kelvinToCelsius(filteredFeel[1])} °C`} /> 
      </Grid>
  
          {/* Tabla de Datos */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TableWeather
              itemsIn={
                filteredItems.length > 0
                  ? filteredItems
                  : [
                      {
                        dateStart: '',
                        dateEnd: '',
                        precipitation: '',
                        humidity: '',
                        temperature: '',
                      },
                    ]
              }
            />
          </Grid>
        </Grid>
      </Grid>
  
      {/* Gráfico */}
      <Grid size={{ xs: 12, md: 4 }}>
        <LineChartWeather selectedDate={selectedDate.toString()}/>
      </Grid>
    </Grid>
  );
  
  
}

export default App;
