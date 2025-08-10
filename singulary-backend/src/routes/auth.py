from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from src.models.user import User, db
import jwt
import datetime
import uuid

auth_bp = Blueprint('auth', __name__)

# Chave secreta para JWT (em produção, usar variável de ambiente)
JWT_SECRET = 'singulary-jwt-secret-key-2025'

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """Registrar novo usuário"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        # Verificar se usuário já existe
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'Email já está em uso'}), 409
        
        # Criar novo usuário
        user = User(
            id=f"user-{uuid.uuid4().hex[:12]}",
            name=data.get('name', ''),
            email=data['email'],
            password_hash=generate_password_hash(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Gerar token JWT
        token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'user': user.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """Fazer login"""
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        # Buscar usuário
        user = User.query.filter_by(email=data['email']).first()
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Email ou senha incorretos'}), 401
        
        # Atualizar último login
        user.last_login = datetime.datetime.utcnow()
        db.session.commit()
        
        # Gerar token JWT
        token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'user': user.to_dict(),
            'token': token
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/verify', methods=['POST'])
def verify_token():
    """Verificar se token JWT é válido"""
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token não fornecido'}), 401
        
        # Remover 'Bearer ' do token
        if token.startswith('Bearer '):
            token = token[7:]
        
        # Decodificar token
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        
        # Buscar usuário
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        return jsonify({
            'valid': True,
            'user': user.to_dict()
        })
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expirado'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token inválido'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/refresh', methods=['POST'])
def refresh_token():
    """Renovar token JWT"""
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token não fornecido'}), 401
        
        # Remover 'Bearer ' do token
        if token.startswith('Bearer '):
            token = token[7:]
        
        # Decodificar token (mesmo que expirado)
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'], options={"verify_exp": False})
        
        # Buscar usuário
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        # Gerar novo token
        new_token = jwt.encode({
            'user_id': user.id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)
        }, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'message': 'Token renovado com sucesso',
            'token': new_token
        })
        
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token inválido'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/auth/change-password', methods=['POST'])
def change_password():
    """Alterar senha do usuário"""
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token não fornecido'}), 401
        
        # Remover 'Bearer ' do token
        if token.startswith('Bearer '):
            token = token[7:]
        
        # Decodificar token
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        
        # Buscar usuário
        user = User.query.get(payload['user_id'])
        if not user:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        data = request.get_json()
        
        # Validar dados
        if not data.get('currentPassword') or not data.get('newPassword'):
            return jsonify({'error': 'Senha atual e nova senha são obrigatórias'}), 400
        
        # Verificar senha atual
        if not check_password_hash(user.password_hash, data['currentPassword']):
            return jsonify({'error': 'Senha atual incorreta'}), 401
        
        # Atualizar senha
        user.password_hash = generate_password_hash(data['newPassword'])
        user.updated_at = datetime.datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': 'Senha alterada com sucesso'})
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expirado'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token inválido'}), 401
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Middleware para verificar autenticação
def require_auth(f):
    """Decorator para rotas que requerem autenticação"""
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token não fornecido'}), 401
        
        try:
            # Remover 'Bearer ' do token
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Decodificar token
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            
            # Adicionar user_id ao request
            request.current_user_id = payload['user_id']
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        
        return f(*args, **kwargs)
    
    decorated_function.__name__ = f.__name__
    return decorated_function

