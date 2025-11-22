import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const api = {
  // Pacientes
  crearPaciente: (data) => axios.post(`${API_BASE_URL}/pacientes`, data),
  listarPacientes: () => axios.get(`${API_BASE_URL}/pacientes`),
  
  // Transfusiones
  crearTransfusion: (data) => axios.post(`${API_BASE_URL}/transfusiones`, data),
  listarTransfusiones: () => axios.get(`${API_BASE_URL}/transfusiones`),
  
  // Donantes
  crearDonante: (data) => axios.post(`${API_BASE_URL}/donantes`, data),
  listarDonantes: () => axios.get(`${API_BASE_URL}/donantes`),
  
  // Hemocomponentes
  crearHemocomponente: (data) => axios.post(`${API_BASE_URL}/hemocomponentes`, data),
  listarHemocomponentes: () => axios.get(`${API_BASE_URL}/hemocomponentes`),
  
  // Exámenes
  crearExamen: (data) => axios.post(`${API_BASE_URL}/examenes`, data),
  listarExamenes: () => axios.get(`${API_BASE_URL}/examenes`)
};