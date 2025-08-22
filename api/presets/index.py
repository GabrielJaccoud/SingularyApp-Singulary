from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Adicionar o diretório lib ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib'))

from models.database import get_db_connection, seed_default_presets
from utils.auth import require_auth

app = Flask(__name__)
CORS(app, origins=['*'])

@app.route('/api/presets', methods=['GET'])
@require_auth
def get_presets():
    """Listar todos os presets do usuário"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Buscar presets públicos e do usuário atual
            cursor.execute('''
                SELECT * FROM presets 
                WHERE user_id = ? OR user_id IS NULL 
                ORDER BY is_default DESC, created_at DESC
            ''', (request.user_id,))
            
            presets_rows = cursor.fetchall()
            
            presets = []
            for row in presets_rows:
                preset_dict = {
                    'id': row['id'],
                    'name': row['name'],
                    'description': row['description'],
                    'dimension': row['dimension'],
                    'category': row['category'],
                    'baseFrequency': row['base_frequency'],
                    'binauralBeat': row['binaural_beat'],
                    'duration': row['duration'],
                    'volume': row['volume'],
                    'isDefault': bool(row['is_default']),
                    'userId': row['user_id'],
                    'createdAt': row['created_at'],
                    'updatedAt': row['updated_at']
                }
                presets.append(preset_dict)
            
            return jsonify({
                'presets': presets
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/presets/seed', methods=['POST'])
def seed_presets():
    """Popular banco com presets padrão"""
    try:
        seed_default_presets()
        return jsonify({'message': 'Presets padrão criados com sucesso'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Para Vercel
def handler(request):
    with app.test_request_context(request.url, method=request.method, headers=request.headers, data=request.get_data()):
        return app.full_dispatch_request()

