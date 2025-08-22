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

@app.route('/api/sessions', methods=['POST'])
@require_auth
def create_session():
    """Criar nova sessão"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['presetId', 'duration', 'startedAt']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Verificar se preset existe
            cursor.execute('SELECT id FROM presets WHERE id = ?', (data['presetId'],))
            preset = cursor.fetchone()
            
            if not preset:
                return jsonify({'error': 'Preset não encontrado'}), 404
            
            # Criar nova sessão
            session_id = f"session-{uuid.uuid4().hex[:12]}"
            
            cursor.execute('''
                INSERT INTO sessions 
                (id, user_id, preset_id, duration, mood_before, mood_after, 
                 notes, started_at, ended_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                session_id,
                request.user_id,
                data['presetId'],
                int(data['duration']),
                data.get('moodBefore'),
                data.get('moodAfter'),
                data.get('notes', ''),
                data['startedAt'],
                data.get('endedAt')
            ))
            
            conn.commit()
            
            # Buscar sessão criada com informações do preset
            cursor.execute('''
                SELECT s.*, p.name as preset_name, p.dimension, p.category
                FROM sessions s
                LEFT JOIN presets p ON s.preset_id = p.id
                WHERE s.id = ?
            ''', (session_id,))
            
            session_row = cursor.fetchone()
            
            session_dict = {
                'id': session_row['id'],
                'userId': session_row['user_id'],
                'presetId': session_row['preset_id'],
                'presetName': session_row['preset_name'],
                'dimension': session_row['dimension'],
                'category': session_row['category'],
                'duration': session_row['duration'],
                'moodBefore': session_row['mood_before'],
                'moodAfter': session_row['mood_after'],
                'notes': session_row['notes'],
                'startedAt': session_row['started_at'],
                'endedAt': session_row['ended_at'],
                'createdAt': session_row['created_at']
            }
            
            return jsonify({
                'message': 'Sessão criada com sucesso',
                'session': session_dict
            }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Para Vercel
def handler(request):
    with app.test_request_context(request.url, method=request.method, headers=request.headers, data=request.get_data()):
        return app.full_dispatch_request()

