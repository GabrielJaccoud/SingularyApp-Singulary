from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Adicionar o diretório lib ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'lib'))

from models.database import get_db_connection
from utils.auth import require_auth

app = Flask(__name__)
CORS(app, origins=['*'])

@app.route('/api/sessions', methods=['GET'])
@require_auth
def get_sessions():
    """Listar todas as sessões do usuário"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Buscar sessões do usuário com informações do preset
            cursor.execute('''
                SELECT s.*, p.name as preset_name, p.dimension, p.category
                FROM sessions s
                LEFT JOIN presets p ON s.preset_id = p.id
                WHERE s.user_id = ?
                ORDER BY s.started_at DESC
            ''', (request.user_id,))
            
            sessions_rows = cursor.fetchall()
            
            sessions = []
            for row in sessions_rows:
                session_dict = {
                    'id': row['id'],
                    'userId': row['user_id'],
                    'presetId': row['preset_id'],
                    'presetName': row['preset_name'],
                    'dimension': row['dimension'],
                    'category': row['category'],
                    'duration': row['duration'],
                    'moodBefore': row['mood_before'],
                    'moodAfter': row['mood_after'],
                    'notes': row['notes'],
                    'startedAt': row['started_at'],
                    'endedAt': row['ended_at'],
                    'createdAt': row['created_at']
                }
                sessions.append(session_dict)
            
            return jsonify({
                'sessions': sessions
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Para Vercel
def handler(request):
    with app.test_request_context(request.url, method=request.method, headers=request.headers, data=request.get_data()):
        return app.full_dispatch_request()

