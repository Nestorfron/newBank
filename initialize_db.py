import sys
import os

# Agregar el directorio raíz al path de Python
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from backend.extensions import db  # Importar la extensión desde el directorio backend
from app import create_app  # Importar la función create_app desde el archivo en la raíz
from flask_migrate import upgrade, migrate  # Importar migrate si lo necesitas

def initialize_database():
    app = create_app()
    with app.app_context():
        try:
            # Crea las migraciones
            migrate()
            # Aplica las migraciones
            upgrade()
            print("Database upgraded successfully!")
        except Exception as e:
            print(f"Error upgrading database: {e}")

if __name__ == "__main__":
    initialize_database()
