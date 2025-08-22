from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Adicionar o diretório lib ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib'))

from models.database import get_db_connection
from utils.auth import verify_token

app = Flask(__name__)
CORS(app, origins=['*'])

@app.route('/api/auth/verify', methods=['POST'])
def verify():
    """Verificar se token JWT é válido"""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Token não fornecido'}), 401
        
        # Remover 'Bearer ' do token
        token = auth_header.replace('Bearer ', '') if auth_header.startswith('Bearer ') else auth_header
        
        # Verificar token
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'error': 'Token inválido ou expirado'}), 401
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Buscar usuário
            cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
            user_row = cursor.fetchone()
            
            if not user_row:
                return jsonify({'error': 'Usuário não encontrado'}), 404
            
            user_dict = {
                'id': user_row['id'],
                'name': user_row['name'],
                'email': user_row['email'],
                'createdAt': user_row['created_at'],
                'updatedAt': user_row['updated_at'],
                'lastLogin': user_row['last_login']
            }
            
            return jsonify({
                'valid': True,
                'user': user_dict
            })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Para Vercel
def handler(request):
    with app.test_request_context(request.url, method=request.method, headers=request.headers, data=request.get_data()):
        return app.full_dispatch_request()

