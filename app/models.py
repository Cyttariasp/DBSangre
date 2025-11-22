from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import os

Base = declarative_base()

class Paciente(Base):
    __tablename__ = 'pacientes'
    
    id = Column(Integer, primary_key=True)
    rut = Column(String(12), unique=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    fecha_nacimiento = Column(DateTime)
    grupo_sanguineo = Column(String(5))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    transfusiones = relationship("Transfusion", back_populates="paciente")
    examenes = relationship("Examen", back_populates="paciente")

class Donante(Base):
    __tablename__ = 'donantes'
    
    id = Column(Integer, primary_key=True)
    rut = Column(String(12), unique=True, nullable=False)
    nombre = Column(String(100), nullable=False)
    grupo_sanguineo = Column(String(5))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    donaciones = relationship("Donacion", back_populates="donante")

class Donacion(Base):
    __tablename__ = 'donaciones'
    
    id = Column(Integer, primary_key=True)
    numero_donacion = Column(String(50), unique=True, nullable=False)
    fecha_extraccion = Column(DateTime, nullable=False)
    donante_id = Column(Integer, ForeignKey('donantes.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    donante = relationship("Donante", back_populates="donaciones")
    hemocomponentes = relationship("Hemocomponente", back_populates="donacion")

class Hemocomponente(Base):
    __tablename__ = 'hemocomponentes'
    
    id = Column(Integer, primary_key=True)
    donacion_id = Column(Integer, ForeignKey('donaciones.id'), nullable=False)
    tipo_componente = Column(String(50), nullable=False)
    codigo_unico = Column(String(50), unique=True, nullable=False)
    volumen_ml = Column(Integer, nullable=False)
    fecha_vencimiento = Column(DateTime, nullable=False)
    grupo_sanguineo = Column(String(5))
    disponible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    donacion = relationship("Donacion", back_populates="hemocomponentes")
    transfusiones = relationship("Transfusion", back_populates="hemocomponente")

class Examen(Base):
    __tablename__ = 'examenes'
    
    id = Column(Integer, primary_key=True)
    paciente_id = Column(Integer, ForeignKey('pacientes.id'), nullable=False)
    fecha_muestra = Column(DateTime, nullable=False)
    hto = Column(Integer)  # Hematocrito
    hb = Column(Integer)   # Hemoglobina
    plaq = Column(Integer) # Plaquetas
    ttpk = Column(Integer) # TTPK
    tp = Column(Integer)   # TP
    created_at = Column(DateTime, default=datetime.utcnow)
    
    paciente = relationship("Paciente", back_populates="examenes")
    transfusiones = relationship("Transfusion", back_populates="examen_pre_transfusion")

class Transfusion(Base):
    __tablename__ = 'transfusiones'
    
    id = Column(Integer, primary_key=True)
    folio = Column(Integer, unique=True, nullable=False)
    fecha_transfusion = Column(DateTime, nullable=False)
    paciente_id = Column(Integer, ForeignKey('pacientes.id'), nullable=False)
    hemocomponente_id = Column(Integer, ForeignKey('hemocomponentes.id'), nullable=False)
    servicio = Column(String(100))
    rce = Column(Boolean, default=False)
    examen_pre_transfusion_id = Column(Integer, ForeignKey('examenes.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    paciente = relationship("Paciente", back_populates="transfusiones")
    hemocomponente = relationship("Hemocomponente", back_populates="transfusiones")
    examen_pre_transfusion = relationship("Examen", back_populates="transfusiones")