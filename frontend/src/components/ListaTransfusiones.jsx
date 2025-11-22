import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { api } from '../services/api';

const ListaTransfusiones = ({ refresh }) => {
  const [transfusiones, setTransfusiones] = useState([]);
  const [error, setError] = useState('');

  const cargarTransfusiones = async () => {
    try {
      const response = await api.listarTransfusiones();
      setTransfusiones(response.data);
    } catch (err) {
      setError('Error al cargar transfusiones');
    }
  };

  useEffect(() => {
    cargarTransfusiones();
  }, [refresh]); // Recarga cuando cambia el prop refresh

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Transfusiones Registradas</h2>
        <Button variant="primary" onClick={cargarTransfusiones}>
          Actualizar
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Folio</th>
            <th>Fecha</th>
            <th>Paciente ID</th>
            <th>Servicio</th>
            <th>RCE</th>
          </tr>
        </thead>
        <tbody>
          {transfusiones.map(transfusion => (
            <tr key={transfusion.id}>
              <td>{transfusion.folio}</td>
              <td>{transfusion.fecha_transfusion}</td>
              <td>{transfusion.paciente_id}</td>
              <td>{transfusion.servicio}</td>
              <td>{transfusion.rce ? 'Sí' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListaTransfusiones;