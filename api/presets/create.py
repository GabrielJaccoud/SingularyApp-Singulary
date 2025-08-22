from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime
import sys
import os

# Adicionar o diretório lib ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib'))

from models.database import get_db_connection
from utils.auth import require_auth

app = Flask(__name__)
CORS(app, origins=['*'])

@app.route('/api/presets', methods=['POST'])
@require_auth
def create_preset():
    """Criar novo preset personalizado"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['name', 'baseFrequency', 'binauralBeat', 'dimension']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Criar novo preset
            preset_id = f"preset-{uuid.uuid4().hex[:12]}"
            
            cursor.execute('''
                INSERT INTO presets 
                (id, name, description, dimension, category, base_frequency, 
                 binaural_beat, duration, volume, is_default, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                preset_id,
                data['name'],
                data.get('description', ''),
                data['dimension'],
                data.get('category', 'Personalizado'),
                float(data['baseFrequency']),
                float(data['binauralBeat']),
                int(data.get('duration', 1200)),
                float(data.get('volume', 0.5)),
                False,  # is_default
                request.user_id
            ))
            
            conn.commit()
            
            # Buscar preset criado
            cursor.execute('SELECT * FROM presets WHERE id = ?', (preset_id,))
            preset_row = cursor.fetchone()
            
            preset_dict = {
                'id': preset_row['id'],
                'name': preset_row['name'],
                'description': preset_row['description'],
                'dimension': preset_row['dimension'],
                'category': preset_row['category'],
                'baseFrequency': preset_row['base_frequency'],
                'binauralBeat': preset_row['binaural_beat'],
                'duration': preset_row['duration'],
                'volume': preset_row['volume'],
                'isDefault': bool(preset_row['is_default']),
                'userId': preset_row['user_id'],
                'createdAt': preset_row['created_at'],
                'updatedAt': preset_row['updated_at']
            }
            
            return jsonify({
                'message': 'Preset criado com sucesso',
                'preset': preset_dict
            }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Para Vercel
def handler(request):
    with app.test_request_context(request.url, method=request.method, headers=request.headers, data=request.get_data()):
        return app.full_dispatch_request()

