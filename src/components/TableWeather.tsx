import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from "../interface/Item";
import { useEffect, useState } from 'react';
const formatoHora = (dateTime: String): String => {
  // Convierte el objeto String a una cadena normal y extrae la hora
  const timeString = new Date(dateTime.toString()).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return new String(timeString); // Devuelve un nuevo objeto String
};

function kelvinToCelsius(kelvin: String): number {
  const kelvinNumber = parseFloat(kelvin.toString());

  if (isNaN(kelvinNumber)) {
    throw new Error("El valor proporcionado no es un número válido.");
  }

  return parseFloat((kelvinNumber - 273.15).toFixed(2));
}

interface MyProp {
  itemsIn: Item[];
}

export default function BasicTable(props: MyProp) {
  // Crear estado local para almacenar el arreglo del tipo Item
  const [rows, setRows] = useState<Item[]>([]);

  // useEffect para sincronizar el estado local con el prop itemsIn
  useEffect(() => {
    setRows(props.itemsIn); // Actualiza el estado local con el valor del prop
  }, [props.itemsIn]); // Solo se ejecuta cuando cambia props.itemsIn
  return (
    <TableContainer component={Paper}>
      <Table aria-label="weather table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Hora de inicio</TableCell>
            <TableCell align="center">Hora de fin</TableCell>
            <TableCell align="center">Precipitación</TableCell>
            <TableCell align="center">Humedad</TableCell>
            <TableCell align="center">Temperatura (°C)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {rows.map((row, idx) => (
    <TableRow
      key={idx}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row" align="center">
        {row.dateStart ? formatoHora(row.dateStart) : '-'}
      </TableCell>
      <TableCell align="center">
        {row.dateEnd ? formatoHora(row.dateEnd) : '-'}
      </TableCell>
      <TableCell align="center">{row.precipitation || '-'}</TableCell>
      <TableCell align="center">{row.humidity || '-'}</TableCell>
      <TableCell align="center">
        {row.temperature ? kelvinToCelsius(row.temperature) : '-'}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

      </Table>
    </TableContainer>
  );
}