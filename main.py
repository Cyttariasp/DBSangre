from flask import Flask
from flask_cors import CORS
from app.models import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.routes import configure_routes
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Database configuration
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///bloodbank.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize database
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    app.config['SESSION_MAKER'] = Session  
    
    configure_routes(app)
    
    @app.route('/api/health')
    def health_check():
        return {'status': 'API operativa', 'database': DATABASE_URL}, 200
    

    return app

if __name__ == '__main__':
    app = create_app()  # Solo retorna app, no Session
    app.run(debug=True, port=5001, host='0.0.0.0')