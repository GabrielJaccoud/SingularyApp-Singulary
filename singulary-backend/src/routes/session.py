from flask import Blueprint, request, jsonify, make_response
from src.models.session import Session, db
from src.models.preset import Preset
from datetime import datetime
import uuid
import csv
import io

session_bp = Blueprint('session', __name__)

@session_bp.route('/sessions', methods=['GET'])
def get_sessions():
    """Listar sessões do usuário"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id é obrigatório'}), 400
        
        # Filtros opcionais
        dimension = request.args.get('dimension')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        limit = request.args.get('limit', 50, type=int)
        
        query = Session.query.filter(Session.user_id == user_id)
        
        # Filtro por dimensão
        if dimension and dimension != 'Todas':
            query = query.join(Preset).filter(Preset.dimension == dimension)
        
        # Filtro por data
        if start_date:
            start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.filter(Session.start_time >= start_dt)
        
        if end_date:
            end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.filter(Session.start_time <= end_dt)
        
        # Ordenar por data mais recente
        sessions = query.order_by(Session.start_time.desc()).limit(limit).all()
        
        return jsonify([session.to_dict() for session in sessions])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@session_bp.route('/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    """Obter detalhes de uma sessão específica"""
    try:
        session = Session.query.get_or_404(session_id)
        return jsonify(session.to_dict())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@session_bp.route('/sessions', methods=['POST'])
def create_session():
    """Criar nova sessão"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['userId', 'presetId', 'startTime']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo obrigatório: {field}'}), 400
        
        # Converter datas
        start_time = datetime.fromisoformat(data['startTime'].replace('Z', '+00:00'))
        end_time = None
        if data.get('endTime'):
            end_time = datetime.fromisoformat(data['endTime'].replace('Z', '+00:00'))
        
        session = Session(
            id=f"session-{uuid.uuid4().hex[:12]}",
            user_id=data['userId'],
            preset_id=data['presetId'],
            start_time=start_time,
            end_time=end_time,
            duration=data.get('duration'),
            pre_mood_score=data.get('preMoodScore'),
            post_mood_score=data.get('postMoodScore'),
            notes=data.get('notes'),
            device_model=data.get('deviceModel'),
            headphones_used=data.get('headphonesUsed', False),
            room_dark=data.get('roomDark', False)
        )
        
        db.session.add(session)
        db.session.commit()
        
        return jsonify(session.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@session_bp.route('/sessions/<session_id>', methods=['PUT'])
def update_session(session_id):
    """Atualizar sessão (principalmente para finalizar)"""
    try:
        session = Session.query.get_or_404(session_id)
        data = request.get_json()
        
        # Atualizar campos
        if 'endTime' in data:
            session.end_time = datetime.fromisoformat(data['endTime'].replace('Z', '+00:00'))
        if 'duration' in data:
            session.duration = data['duration']
        if 'postMoodScore' in data:
            session.post_mood_score = data['postMoodScore']
        if 'notes' in data:
            session.notes = data['notes']
        if 'headphonesUsed' in data:
            session.headphones_used = data['headphonesUsed']
        if 'roomDark' in data:
            session.room_dark = data['roomDark']
        
        db.session.commit()
        
        return jsonify(session.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@session_bp.route('/sessions/<session_id>/export', methods=['GET'])
def export_session(session_id):
    """Exportar sessão específica como CSV"""
    try:
        session = Session.query.get_or_404(session_id)
        
        # Criar CSV
        output = io.StringIO()
        fieldnames = [
            'session_id', 'user_id', 'date_utc', 'timezone', 'preset_name',
            'dimension_tag', 'base_frequency_hz', 'beat_frequency_hz', 'light_frequency_hz',
            'duration_seconds', 'headphones_used', 'room_dark', 'pre_mood_score',
            'post_mood_score', 'notes_text', 'device_model', 'firmware_version',
            'recording_path', 'session_hash'
        ]
        
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerow(session.to_csv_row())
        
        # Criar resposta
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=session_{session_id}.csv'
        
        return response
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@session_bp.route('/sessions/export', methods=['GET'])
def export_sessions():
    """Exportar múltiplas sessões como CSV"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id é obrigatório'}), 400
        
        # Filtros opcionais
        dimension = request.args.get('dimension')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = Session.query.filter(Session.user_id == user_id)
        
        # Aplicar filtros
        if dimension and dimension != 'Todas':
            query = query.join(Preset).filter(Preset.dimension == dimension)
        
        if start_date:
            start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            query = query.filter(Session.start_time >= start_dt)
        
        if end_date:
            end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query = query.filter(Session.start_time <= end_dt)
        
        sessions = query.order_by(Session.start_time.desc()).all()
        
        # Criar CSV
        output = io.StringIO()
        fieldnames = [
            'session_id', 'user_id', 'date_utc', 'timezone', 'preset_name',
            'dimension_tag', 'base_frequency_hz', 'beat_frequency_hz', 'light_frequency_hz',
            'duration_seconds', 'headphones_used', 'room_dark', 'pre_mood_score',
            'post_mood_score', 'notes_text', 'device_model', 'firmware_version',
            'recording_path', 'session_hash'
        ]
        
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        
        for session in sessions:
            writer.writerow(session.to_csv_row())
        
        # Criar resposta
        response = make_response(output.getvalue())
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = f'attachment; filename=singulary_sessions_{user_id}.csv'
        
        return response
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@session_bp.route('/sessions/stats', methods=['GET'])
def get_session_stats():
    """Obter estatísticas das sessões do usuário"""
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id é obrigatório'}), 400
        
        sessions = Session.query.filter(Session.user_id == user_id).all()
        
        # Calcular estatísticas
        total_sessions = len(sessions)
        total_minutes = sum((s.duration or 0) for s in sessions) // 60
        
        # Estatísticas de humor
        mood_sessions = [s for s in sessions if s.pre_mood_score and s.post_mood_score]
        avg_mood_improvement = 0
        if mood_sessions:
            mood_improvements = [s.post_mood_score - s.pre_mood_score for s in mood_sessions]
            avg_mood_improvement = sum(mood_improvements) / len(mood_improvements)
        
        # Sessões por dimensão
        dimension_stats = {}
        for session in sessions:
            if session.preset:
                dim = session.preset.dimension
                if dim not in dimension_stats:
                    dimension_stats[dim] = 0
                dimension_stats[dim] += 1
        
        # Sessões por categoria
        category_stats = {}
        for session in sessions:
            if session.preset:
                cat = session.preset.category
                if cat not in category_stats:
                    category_stats[cat] = 0
                category_stats[cat] += 1
        
        return jsonify({
            'totalSessions': total_sessions,
            'totalMinutes': total_minutes,
            'avgMoodImprovement': round(avg_mood_improvement, 2),
            'dimensionStats': dimension_stats,
            'categoryStats': category_stats,
            'moodSessionsCount': len(mood_sessions)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

