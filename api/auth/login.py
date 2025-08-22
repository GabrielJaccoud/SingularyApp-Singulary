from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sys
import os

# Adicionar o diretório lib ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib'))

from models.database import get_db_connection
from utils.auth import verify_password, generate_token

app = Flask(__name__)
CORS(app, origins=['*'])

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Fazer login"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Buscar usuário
            cursor.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
            user_row = cursor.fetchone()
            
            if not user_row or not verify_password(data['password'], user_row['password_hash']):
                return jsonify({'error': 'Email ou senha incorretos'}), 401
            
            # Atualizar último login
            cursor.execute('''
                UPDATE users SET last_login = ? WHERE id = ?
            ''', (datetime.utcnow().isoformat(), user_row['id']))
            
            conn.commit()
            
            # Gerar token JWT
            token = generate_token(user_row['id'])
            
            user_dict = {
                'id': user_row['id'],
                'name': user_row['name'],
                'email': user_row['email'],
                'createdAt': user_row['created_at'],
                'updatedAt': user_row['updated_at'],
                'lastLogin': datetime.utcnow().isoformat()
            }
            
            return jsonify({
                'message': 'Login realizado com sucesso',
                'user': user_dict,
                'token': token
            })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Para Vercel
def handler(request):
    with app.test_request_context(request.url, method=request.method, headers=request.headers, data=request.get_data()):
        return app.full_dispatch_request()

