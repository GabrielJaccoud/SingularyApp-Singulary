from flask import Blueprint, request, jsonify
from src.models.preset import Preset, db
from src.routes.auth import require_auth
from datetime import datetime
import uuid

preset_bp = Blueprint('preset', __name__)

@preset_bp.route('/presets', methods=['GET'])
@require_auth
def get_presets():
    """Listar todos os presets do usuário"""
    try:
        # Buscar presets públicos e do usuário atual
        presets = Preset.query.filter(
            (Preset.user_id == request.current_user_id) | 
            (Preset.user_id == None)  # Presets públicos/padrão
        ).all()
        
        return jsonify({
            'presets': [preset.to_dict() for preset in presets]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@preset_bp.route('/presets', methods=['POST'])
@require_auth
def create_preset():
    """Criar novo preset personalizado"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['name', 'base_frequency', 'beat_frequency', 'dimension']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Criar novo preset
        preset = Preset(
            id=f"preset-{uuid.uuid4().hex[:12]}",
            name=data['name'],
            description=data.get('description', ''),
            base_frequency=float(data['base_frequency']),
            beat_frequency=float(data['beat_frequency']),
            light_frequency=float(data.get('light_frequency', 10.0)),
            dimension=data['dimension'],
            category=data.get('category', 'Personalizado'),
            duration=int(data.get('duration', 20)),
            user_id=request.current_user_id,  # Preset personalizado do usuário
            is_custom=True
        )
        
        db.session.add(preset)
        db.session.commit()
        
        return jsonify({
            'message': 'Preset criado com sucesso',
            'preset': preset.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@preset_bp.route('/presets/<preset_id>', methods=['GET'])
@require_auth
def get_preset(preset_id):
    """Obter preset específico"""
    try:
        preset = Preset.query.filter(
            (Preset.id == preset_id) & 
            ((Preset.user_id == request.current_user_id) | (Preset.user_id == None))
        ).first()
        
        if not preset:
            return jsonify({'error': 'Preset não encontrado'}), 404
        
        return jsonify({'preset': preset.to_dict()})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@preset_bp.route('/presets/<preset_id>', methods=['PUT'])
@require_auth
def update_preset(preset_id):
    """Atualizar preset (apenas presets do usuário)"""
    try:
        preset = Preset.query.filter(
            (Preset.id == preset_id) & 
            (Preset.user_id == request.current_user_id)
        ).first()
        
        if not preset:
            return jsonify({'error': 'Preset não encontrado ou não pertence ao usuário'}), 404
        
        data = request.get_json()
        
        # Atualizar campos permitidos
        if 'name' in data:
            preset.name = data['name']
        if 'description' in data:
            preset.description = data['description']
        if 'base_frequency' in data:
            preset.base_frequency = float(data['base_frequency'])
        if 'beat_frequency' in data:
            preset.beat_frequency = float(data['beat_frequency'])
        if 'light_frequency' in data:
            preset.light_frequency = float(data['light_frequency'])
        if 'dimension' in data:
            preset.dimension = data['dimension']
        if 'category' in data:
            preset.category = data['category']
        if 'duration' in data:
            preset.duration = int(data['duration'])
        
        preset.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Preset atualizado com sucesso',
            'preset': preset.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@preset_bp.route('/presets/<preset_id>', methods=['DELETE'])
@require_auth
def delete_preset(preset_id):
    """Deletar preset (apenas presets do usuário)"""
    try:
        preset = Preset.query.filter(
            (Preset.id == preset_id) & 
            (Preset.user_id == request.current_user_id)
        ).first()
        
        if not preset:
            return jsonify({'error': 'Preset não encontrado ou não pertence ao usuário'}), 404
        
        db.session.delete(preset)
        db.session.commit()
        
        return jsonify({'message': 'Preset deletado com sucesso'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@preset_bp.route('/presets/seed', methods=['POST'])
def seed_presets():
    """Criar presets padrão (apenas se não existirem)"""
    try:
        # Verificar se já existem presets padrão
        existing_presets = Preset.query.filter_by(user_id=None).count()
        if existing_presets > 0:
            return jsonify({'message': 'Presets padrão já existem'}), 200
        
        # Presets padrão baseados nas dimensões espirituais
        default_presets = [
            {
                'id': '3d-focus',
                'name': 'Foco 3D',
                'description': 'Frequências para concentração e produtividade na dimensão física',
                'dimension': '3D',
                'category': 'Foco',
                'base_frequency': 528,
                'beat_frequency': 40,
                'light_frequency': 10,
                'duration': 20
            },
            {
                'id': '3d-relax',
                'name': 'Relaxamento 3D',
                'description': 'Frequências para relaxamento profundo e alívio do estresse',
                'dimension': '3D',
                'category': 'Relaxamento',
                'base_frequency': 432,
                'beat_frequency': 8,
                'light_frequency': 4,
                'duration': 30
            },
            {
                'id': '4d-meditation',
                'name': 'Meditação 4D',
                'description': 'Acesso ao plano astral e meditação profunda',
                'dimension': '4D',
                'category': 'Meditação',
                'base_frequency': 285,
                'beat_frequency': 6,
                'light_frequency': 3,
                'duration': 45
            },
            {
                'id': '4d-lucid',
                'name': 'Sonho Lúcido 4D',
                'description': 'Frequências para indução de sonhos lúcidos',
                'dimension': '4D',
                'category': 'Sono',
                'base_frequency': 963,
                'beat_frequency': 4,
                'light_frequency': 2,
                'duration': 60
            },
            {
                'id': '5d-love',
                'name': 'Amor Incondicional 5D',
                'description': 'Conexão com o eu superior e amor universal',
                'dimension': '5D',
                'category': 'Espiritual',
                'base_frequency': 144,
                'beat_frequency': 7.83,
                'light_frequency': 1,
                'duration': 40
            },
            {
                'id': '5d-healing',
                'name': 'Cura Espiritual 5D',
                'description': 'Frequências de cura e regeneração espiritual',
                'dimension': '5D',
                'category': 'Cura',
                'base_frequency': 741,
                'beat_frequency': 10,
                'light_frequency': 5,
                'duration': 35
            }
        ]
        
        # Criar presets padrão
        for preset_data in default_presets:
            preset = Preset(
                id=preset_data['id'],
                name=preset_data['name'],
                description=preset_data['description'],
                base_frequency=preset_data['base_frequency'],
                beat_frequency=preset_data['beat_frequency'],
                light_frequency=preset_data['light_frequency'],
                dimension=preset_data['dimension'],
                category=preset_data['category'],
                duration=preset_data['duration'],
                user_id=None,  # Preset público/padrão
                is_custom=False
            )
            db.session.add(preset)
        
        db.session.commit()
        
        return jsonify({
            'message': f'{len(default_presets)} presets padrão criados com sucesso'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

