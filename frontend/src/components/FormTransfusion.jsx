import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const FormTransfusion = ({ onTransfusionCreada }) => {
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
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Nueva Transfusión</h5>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Folio *</label>
                            <input
                                type="number"
                                className="form-control"
                                name="folio"
                                value={formData.folio}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
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

                        <div className="col-md-6">
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

                        <div className="col-md-6">
                            <label className="form-label">Servicio *</label>
                            <input
                                type="text"
                                className="form-control"
                                name="servicio"
                                value={formData.servicio}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <div className="form-check mt-4">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="rce"
                                    checked={formData.rce}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label">Reacción Adversa (RCE)</label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">
                        Registrar Transfusión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormTransfusion;