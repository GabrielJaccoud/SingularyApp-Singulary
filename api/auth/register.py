from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
import sys
import os

# Adicionar o diretório lib ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib'))

from models.database import get_db_connection
from utils.auth import hash_password, generate_token

app = Flask(__name__)
CORS(app, origins=['*'])

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registrar novo usuário"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Verificar se usuário já existe
            cursor.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
            existing_user = cursor.fetchone()
            
            if existing_user:
                return jsonify({'error': 'Email já está em uso'}), 409
            
            # Criar novo usuário
            user_id = f"user-{uuid.uuid4().hex[:12]}"
            password_hash = hash_password(data['password'])
            
            cursor.execute('''
                INSERT INTO users (id, name, email, password_hash)
                VALUES (?, ?, ?, ?)
            ''', (user_id, data.get('name', ''), data['email'], password_hash))
            
            conn.commit()
            
            # Gerar token JWT
            token = generate_token(user_id)
            
            # Buscar usuário criado
            cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            user_row = cursor.fetchone()
            
            user_dict = {
                'id': user_row['id'],
                'name': user_row['name'],
                'email': user_row['email'],
                'createdAt': user_row['created_at'],
                'updatedAt': user_row['updated_at'],
                'lastLogin': user_row['last_login']
            }
            
            return jsonify({
                'message': 'Usuário criado com sucesso',
                'user': user_dict,
                'token': token
            }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Para Vercel
def handler(request):
    with app.test_request_context(request.url, method=request.method, headers=request.headers, data=request.get_data()):
        return app.full_dispatch_request()

