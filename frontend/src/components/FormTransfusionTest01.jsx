import { useState, useEffect } from 'react';
import { api } from '../services/api';

function FormTransfusionTest01({ onTransfusionCreada }) {

  const [formData, setFormData] = useState({
    folio: '',
    fecha_transfusion: '',
    paciente_id: '',
    hemocomponente_id: '',
    servicio: '',
    rce: false
  });
  const [pacientes, setPacientes] = useState([]);
  const [hemocomponentes, setHemocomponentes] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cargarDatos = async () => {
    try {
      const [pacientesRes, hemocomponentesRes] = await Promise.all([
        api.listarPacientes(),
        api.listarHemocomponentes()
      ]);
      setPacientes(pacientesRes.data);
      setHemocomponentes(hemocomponentesRes.data);
    } catch (err) {
      setError('Error al cargar datos');
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const datosEnviar = {
      ...formData,
      fecha_transfusion: formData.fecha_transfusion.replace('T', ' ') + ':00'
    };

    try {
      await api.crearTransfusion(datosEnviar);
      setSuccess('Transfusión registrada exitosamente');
      setFormData({
        folio: '',
        fecha_transfusion: '',
        paciente_id: '',
        hemocomponente_id: '',
        servicio: '',
        rce: false
      });
      if (onTransfusionCreada) onTransfusionCreada();
      // Cerrar el modal después de éxito
      const modal = document.getElementById('exampleModal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) modalInstance.hide();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear transfusión');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div>
      {/* Button trigger modal */}
      <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Ingresar Transfusión
      </button>

      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Ingreso de Transfusión</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="card-body">
                <h5 className="card-title">Nueva Transfusión</h5>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-2">
                      <label className="form-label" >Folio *</label>
                      <input
                        type="number"
                        className="form-control text-secondary"
                        name="folio"
                        value="12345667"
                        onChange={handleChange}
                        readOnly
                        required
                      />
                    </div>

                    {/* fecha de txn */}
                    <div className="col-md-2">
                      <label className="form-label">Fecha y Hora *</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="fecha_transfusion"
                        value={formData.fecha_transfusion}
                        onChange={handleChange}
                        required
                      />
                    </div>


                    {/* Tipo de procedimieto */}
                    <div className="col-md-2">
                      <label className="form-label">Tipo de procedimieto</label>
                      <select class="form-select" aria-label="Default select example">
                        <option selected>Transfusión</option>
                        <option value="1">PlasmaFeresis</option>
                      </select>
                    </div>


                    {/* Paciente */}
                    <div className="col-md-2">
                      <label className="form-label">Paciente *</label>
                      <select
                        className="form-select"
                        name="paciente_id"
                        value={formData.paciente_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar paciente</option>
                        {pacientes.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} - {p.rut}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rut */}
                    <div className="col-md-2">
                      <label className="form-label">Rut</label>
                      <input
                        type="text"
                        className="form-control"
                        name="rut"
                        value="11.111.111-1"
                        onChange={null}
                        required
                      />
                    </div>

                    {/* Edad */}
                    <div className="col-md-2">
                      <label className="form-label">Edad</label>
                      <input
                        type="number"
                        className="form-control"
                        name="edad"
                        onChange={null}
                        required
                      />
                    </div>

                    {/* Diagnostico */}
                    <div className="col-md-2">
                      <label className="form-label">Diagnostico *</label>
                      <select
                        className="form-select"
                        name="diagnostico"
                        required
                      >
                        <option value="">Seleccionar Diagnostico</option>
                        <option value="1">Diagnostico 1</option>
                        <option value="2">Diagnostico 2</option>
                        <option value="3">Diagnostico 3</option>
                      </select>
                    </div>

                    {/* Prevision */}
                    <div className="col-md-2">
                      <label className="form-label">Prevision *</label>
                      <select
                        className="form-select"
                        name="prevision"
                        required
                      >
                        <option value="">Seleccionar Prevision</option>
                        <option value="1">Fonasa</option>
                        <option value="2">Banmedica</option>
                        <option value="3">Cruz Blanca</option>
                      </select>
                    </div>

                    {/* RCE */}
                    <div className="col-md-2">
                      <div className="form-check mt-4">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="rce"
                          checked={formData.rce}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">Indicacion en RCE</label>
                      </div>
                    </div>

                    {/* fecha de clasificacion */}
                    <div className="col-md-2">
                      <label className="form-label">Fecha de clasificacion</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        name="fecha_transfusion"
                        value={formData.fecha_transfusion}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Grupo paciente */}
                    <div className="col-md-2">
                      <label className="form-label">Grupo de paciente</label>
                      <select
                        className="form-select"
                        name="grupo de paciente"
                        required
                      >
                        <option value="">Seleccionar Grupo</option>
                        <option value="4">O+</option>
                        <option value="8">O(-)</option>
                        <option value="1">A+</option>
                        <option value="5">A(-)</option>
                        <option value="2">B+</option>
                        <option value="6">B(-)</option>
                        <option value="3">AB+</option>
                        <option value="7">AB(-)</option>
                      </select>
                    </div>

                    {/* Coombs Directo */}
                    <div className="col-md-2">
                      <label className="form-label">Coombs Directo</label>
                      <select
                        className="form-select"
                        name="grupo de paciente"
                        required
                      >
                        <option value="">No aplica</option>
                        <option value="1">Negativo</option>
                        <option value="2">Positivo</option>
                      </select>
                    </div>

                    {/* Coombs indirecto */}
                    <div className="col-md-2">
                      <label className="form-label">Coombs Indirecto</label>
                      <select
                        className="form-select"
                        name="grupo de paciente"
                        required
                      >
                        <option value="">Seleccionar resultado</option>
                        <option value="1">Negativo</option>
                        <option value="2">Positivo</option>
                      </select>
                    </div>

                    {/* Servicio */}
                    <div className="col-md-2">
                      <label className="form-label">Servicio</label>
                      <input
                        type="text"
                        className="form-control"
                        name="servicio"
                        value={formData.servicio}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Hemocomponente */}
                    <div className="col-md-2">
                      <label className="form-label">Hemocomponente *</label>
                      <select
                        className="form-select"
                        name="hemocomponente_id"
                        value={formData.hemocomponente_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccionar hemocomponente</option>
                        {hemocomponentes.map(h => (
                          <option key={h.id} value={h.id}>
                            {h.tipo} - {h.codigo}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Condicion */}
                    <div className="col-md-2">
                      <label className="form-label">Condicion</label>
                      <select
                        className="form-select"
                        name="grupo de paciente"
                        required
                      >
                        <option value="">No aplica</option>
                        <option value="1">Filtrados</option>
                        <option value="2">Irradiados</option>
                        <option value="3">Filtrados e Irradiados</option>

                      </select>
                    </div>

                    {/* Condicion */}
                    <div className="col-md-2">
                      <label className="form-label">Condicion</label>
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="checkDefault" />
                        <label class="form-check-label" for="checkDefault">
                          Filtrados
                        </label>
                      </div>
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="checkChecked" />
                        <label class="form-check-label" for="checkChecked">
                          Irradiados
                        </label>
                      </div>
                    </div>

                    {/* Matraz */}
                    <div className="col-md-2">
                      <label className="form-label">Numero de Matraz</label>
                      <input
                        type="number"
                        className="form-control"
                        name="matraz"
                        onChange={null}
                        required
                      />
                    </div>

                    {/* Volumen */}
                    <div className="col-md-2">
                      <label className="form-label">Volumen</label>
                      <input
                        type="number"
                        className="form-control"
                        name="volumen"
                        onChange={null}
                        required
                      />
                    </div>

                    


                  </div>

                  <div className="modal-footer mt-3">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="submit" className="btn btn-primary">
                      Registrar Transfusión
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormTransfusionTest01;