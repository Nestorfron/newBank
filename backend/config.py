import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager


load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'tu_clave_secreta')  
    JWT_TOKEN_LOCATION = ['headers', 'cookies']  
    

