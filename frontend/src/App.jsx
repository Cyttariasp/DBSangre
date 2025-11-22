import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'
import { Container, Row, Col } from 'react-bootstrap';
import ListaTransfusiones from './components/ListaTransfusiones';
import FormTransfusion from './components/FormTransfusion';
import FormTransfusionTest01 from './components/FormTransfusionTest01';

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleTransfusionCreada = () => {
    setRefresh(!refresh); // Forzar recarga de la lista
  };

  return (
    <Container fluid>
      <h1 className="my-4">Sistema Banco de Sangre - GCL 1.7</h1>
      <FormTransfusionTest01 />
      <Row>
        <ListaTransfusiones refresh={refresh} />
      </Row>
    </Container>
  );
}

export default App;