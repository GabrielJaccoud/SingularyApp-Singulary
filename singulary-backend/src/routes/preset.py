from flask import Blueprint, request, jsonify
from src.models.preset import Preset, db
from datetime import datetime
import uuid

preset_bp = Blueprint('preset', __name__)

@preset_bp.route('/presets', methods=['GET'])
def get_presets():
    """Listar todos os presets (padrão + personalizados do usuário)"""
    try:
        user_id = request.args.get('user_id')
        
        # Buscar presets padrão (user_id = null) e personalizados do usuário
        query = Preset.query.filter(
            (Preset.user_id == None) | (Preset.user_id == user_id)
        )
        
        dimension = request.args.get('dimension')
        if dimension and dimension != 'Todas':
            query = query.filter(Preset.dimension == dimension)
            
        category = request.args.get('category')
        if category and category != 'Todas':
            query = query.filter(Preset.category == category)
        
        presets = query.all()
        return jsonify([preset.to_dict() for preset in presets])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@preset_bp.route('/presets/<preset_id>', methods=['GET'])
def get_preset(preset_id):
    """Obter detalhes de um preset específico"""
    try:
        preset = Preset.query.get_or_404(preset_id)
        return jsonify(preset.to_dict())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@preset_bp.route('/presets', methods=['POST'])
def create_preset():
    """Criar novo preset personalizado"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        required_fields = ['name', 'baseFrequency', 'beatFrequency', 'lightFrequency', 'duration']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Campo obrigatório: {field}'}), 400
        
        preset = Preset(
            id=f"custom-{uuid.uuid4().hex[:8]}",
            name=data['name'],
            description=data.get('description', ''),
            dimension=data.get('dimension', 'Personalizado'),
            category=data.get('category', 'Personalizado'),
            base_frequency=float(data['baseFrequency']),
            beat_frequency=float(data['beatFrequency']),
            light_frequency=float(data['lightFrequency']),
            duration=int(data['duration']),
            is_custom=True,
            user_id=data.get('userId')
        )
        
        db.session.add(preset)
        db.session.commit()
        
        return jsonify(preset.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@preset_bp.route('/presets/<preset_id>', methods=['PUT'])
def update_preset(preset_id):
    """Atualizar preset personalizado"""
    try:
        preset = Preset.query.get_or_404(preset_id)
        
        # Verificar se é um preset personalizado
        if not preset.is_custom:
            return jsonify({'error': 'Não é possível editar presets padrão'}), 403
        
        data = request.get_json()
        
        # Atualizar campos
        if 'name' in data:
            preset.name = data['name']
        if 'description' in data:
            preset.description = data['description']
        if 'baseFrequency' in data:
            preset.base_frequency = float(data['baseFrequency'])
        if 'beatFrequency' in data:
            preset.beat_frequency = float(data['beatFrequency'])
        if 'lightFrequency' in data:
            preset.light_frequency = float(data['lightFrequency'])
        if 'duration' in data:
            preset.duration = int(data['duration'])
        if 'category' in data:
            preset.category = data['category']
        
        preset.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(preset.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@preset_bp.route('/presets/<preset_id>', methods=['DELETE'])
def delete_preset(preset_id):
    """Deletar preset personalizado"""
    try:
        preset = Preset.query.get_or_404(preset_id)
        
        # Verificar se é um preset personalizado
        if not preset.is_custom:
            return jsonify({'error': 'Não é possível deletar presets padrão'}), 403
        
        db.session.delete(preset)
        db.session.commit()
        
        return jsonify({'message': 'Preset deletado com sucesso'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@preset_bp.route('/presets/seed', methods=['POST'])
def seed_default_presets():
    """Criar presets padrão (apenas para desenvolvimento)"""
    try:
        # Verificar se já existem presets padrão
        existing = Preset.query.filter(Preset.user_id == None).first()
        if existing:
            return jsonify({'message': 'Presets padrão já existem'})
        
        default_presets = [
            {
                'id': '3d-focus',
                'name': 'Foco 3D',
                'description': 'Frequências para concentração e produtividade',
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
                'description': 'Frequências para relaxamento profundo',
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
                'description': 'Frequências de cura e regeneração',
                'dimension': '5D',
                'category': 'Cura',
                'base_frequency': 741,
                'beat_frequency': 10,
                'light_frequency': 5,
                'duration': 35
            }
        ]
        
        for preset_data in default_presets:
            preset = Preset(**preset_data, is_custom=False, user_id=None)
            db.session.add(preset)
        
        db.session.commit()
        
        return jsonify({'message': f'{len(default_presets)} presets padrão criados com sucesso'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

