from flask import request, jsonify, session
from app.models import Paciente, Donante, Donacion, Hemocomponente, Examen, Transfusion
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime

def configure_routes(app):
    @app.route('/api/pacientes', methods=['POST'])
    def crear_paciente():
        session = app.config['SESSION_MAKER']()
        try:
            data = request.get_json()
            paciente = Paciente(
                rut=data['rut'],
                nombre=data['nombre'],
                fecha_nacimiento=datetime.strptime(data['fecha_nacimiento'], '%Y-%m-%d'),
                grupo_sanguineo=data['grupo_sanguineo']
            )
            session.add(paciente)
            session.commit()
            return jsonify({'id': paciente.id, 'message': 'Paciente creado'}), 201
        
        except IntegrityError as e:
            session.rollback()
            if 'UNIQUE constraint failed: pacientes.rut' in str(e):
                return jsonify({'error': 'El RUT ya está registrado'}), 400
            else:
                return jsonify({'error': 'Error de integridad de datos'}), 400
        
        except ValueError as e:
            session.rollback()
            return jsonify({'error': 'Formato de fecha incorrecto. Use YYYY-MM-DD'}), 400
        
        except Exception as e:
            session.rollback()
            return jsonify({'error': 'Error interno del servidor'}), 500
        
        finally:
            session.close()

    @app.route('/api/pacientes', methods=['GET'])
    def listar_pacientes():
        session = app.config['SESSION_MAKER']()
        try:
            pacientes = session.query(Paciente).all()
            return jsonify([{
                'id': p.id,
                'rut': p.rut,
                'nombre': p.nombre,
                'grupo_sanguineo': p.grupo_sanguineo
            } for p in pacientes])
        finally:
            session.close()

    @app.route('/api/transfusiones', methods=['POST'])
    def crear_transfusion():
        session = app.config['SESSION_MAKER']()
        try:
            data = request.get_json()
            transfusion = Transfusion(
                folio=data['folio'],
                fecha_transfusion=datetime.strptime(data['fecha_transfusion'], '%Y-%m-%d %H:%M:%S'),
                paciente_id=data['paciente_id'],
                hemocomponente_id=data['hemocomponente_id'],
                servicio=data['servicio'],
                rce=data.get('rce', False),
                examen_pre_transfusion_id=data.get('examen_pre_transfusion_id')
            )
            session.add(transfusion)
            session.commit()
            return jsonify({'id': transfusion.id, 'message': 'Transfusión registrada'}), 201
        
        except IntegrityError as e:
            session.rollback()
            if 'UNIQUE constraint failed: transfusiones.folio' in str(e):
                return jsonify({'error': 'El folio ya existe. Use un folio único.'}), 400
            elif 'FOREIGN KEY constraint failed' in str(e):
                return jsonify({'error': 'Paciente o hemocomponente no existe'}), 400
            else:
                return jsonify({'error': 'Error de integridad de datos'}), 400
        
        except ValueError as e:
            session.rollback()
            return jsonify({'error': 'Formato de fecha incorrecto. Use YYYY-MM-DD HH:MM:SS'}), 400
        
        except Exception as e:
            session.rollback()
            return jsonify({'error': 'Error interno del servidor'}), 500
        
        finally:
            session.close()

    @app.route('/api/transfusiones', methods=['GET'])
    def listar_transfusiones():
        session = app.config['SESSION_MAKER']()
        try:
            transfusiones = session.query(Transfusion).all()
            return jsonify([{
                'id': t.id,
                'folio': t.folio,
                'fecha_transfusion': t.fecha_transfusion.strftime('%Y-%m-%d %H:%M:%S'),
                'paciente_id': t.paciente_id,
                'hemocomponente_id': t.hemocomponente_id,
                'servicio': t.servicio,
                'rce': t.rce
            } for t in transfusiones])
        finally:
            session.close()

    # Donantes
    @app.route('/api/donantes', methods=['POST'])
    def crear_donante():
        session = app.config['SESSION_MAKER']()
        try:
            data = request.get_json()
            donante = Donante(
                rut=data['rut'],
                nombre=data['nombre'],
                grupo_sanguineo=data['grupo_sanguineo']
            )
            session.add(donante)
            session.commit()
            return jsonify({'id': donante.id, 'message': 'Donante creado'}), 201
        except IntegrityError as e:
            session.rollback()
            return jsonify({'error': 'RUT de donante ya existe'}), 400
        finally:
            session.close()

    @app.route('/api/donantes', methods=['GET'])
    def listar_donantes():
        session = app.config['SESSION_MAKER']()
        try:
            donantes = session.query(Donante).all()
            return jsonify([{
                'id': d.id,
                'rut': d.rut,
                'nombre': d.nombre,
                'grupo_sanguineo': d.grupo_sanguineo
            } for d in donantes])
        finally:
            session.close()

    # Donaciones
    @app.route('/api/donaciones', methods=['POST'])
    def crear_donacion():
        session = app.config['SESSION_MAKER']()
        try:
            data = request.get_json()
            donacion = Donacion(
                numero_donacion=data['numero_donacion'],
                fecha_extraccion=datetime.strptime(data['fecha_extraccion'], '%Y-%m-%d'),
                donante_id=data['donante_id']
            )
            session.add(donacion)
            session.commit()
            return jsonify({'id': donacion.id, 'message': 'Donación creada'}), 201
        except IntegrityError as e:
            session.rollback()
            return jsonify({'error': 'Número de donación ya existe'}), 400
        finally:
            session.close()

    # Hemocomponentes
    @app.route('/api/hemocomponentes', methods=['POST'])
    def crear_hemocomponente():
        session = app.config['SESSION_MAKER']()
        try:
            data = request.get_json()
            hemocomponente = Hemocomponente(
                donacion_id=data['donacion_id'],
                tipo_componente=data['tipo_componente'],
                codigo_unico=data['codigo_unico'],
                volumen_ml=data['volumen_ml'],
                fecha_vencimiento=datetime.strptime(data['fecha_vencimiento'], '%Y-%m-%d'),
                grupo_sanguineo=data['grupo_sanguineo']
            )
            session.add(hemocomponente)
            session.commit()
            return jsonify({'id': hemocomponente.id, 'message': 'Hemocomponente creado'}), 201
        except IntegrityError as e:
            session.rollback()
            return jsonify({'error': 'Código único ya existe'}), 400
        finally:
            session.close()

    @app.route('/api/hemocomponentes', methods=['GET'])
    def listar_hemocomponentes():
        session = app.config['SESSION_MAKER']()
        try:
            hemocomponentes = session.query(Hemocomponente).filter_by(disponible=True).all()
            return jsonify([{
                'id': h.id,
                'codigo_unico': h.codigo_unico,
                'tipo_componente': h.tipo_componente,
                'volumen_ml': h.volumen_ml,
                'fecha_vencimiento': h.fecha_vencimiento.strftime('%Y-%m-%d'),
                'grupo_sanguineo': h.grupo_sanguineo
            } for h in hemocomponentes])
        finally:
            session.close()
    
    # Exámenes
    @app.route('/api/examenes', methods=['POST'])
    def crear_examen():
        session = app.config['SESSION_MAKER']()
        try:
            data = request.get_json()
            examen = Examen(
                paciente_id=data['paciente_id'],
                fecha_muestra=datetime.strptime(data['fecha_muestra'], '%Y-%m-%d %H:%M:%S'),
                hto=data.get('hto'),
                hb=data.get('hb'),
                plaq=data.get('plaq'),
                ttpk=data.get('ttpk'),
                tp=data.get('tp')
            )
            session.add(examen)
            session.commit()
            return jsonify({'id': examen.id, 'message': 'Examen creado'}), 201
        except IntegrityError as e:
            session.rollback()
            return jsonify({'error': 'Error al crear examen'}), 400
        finally:
            session.close()

    @app.route('/api/examenes', methods=['GET'])
    def listar_examenes():
        session = app.config['SESSION_MAKER']()
        try:
            examenes = session.query(Examen).all()
            return jsonify([{
                'id': e.id,
                'paciente_id': e.paciente_id,
                'fecha_muestra': e.fecha_muestra.strftime('%Y-%m-%d %H:%M:%S'),
                'hto': e.hto,
                'hb': e.hb,
                'plaq': e.plaq,
                'ttpk': e.ttpk,
                'tp': e.tp
            } for e in examenes])
        finally:
            session.close()