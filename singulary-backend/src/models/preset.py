from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db, User

class Preset(db.Model):
    __tablename__ = 'presets'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    dimension = db.Column(db.String(20), nullable=False)  # 3D, 4D, 5D, Personalizado
    category = db.Column(db.String(50), nullable=False)   # Foco, Relaxamento, etc.
    base_frequency = db.Column(db.Float, nullable=False)
    beat_frequency = db.Column(db.Float, nullable=False)
    light_frequency = db.Column(db.Float, nullable=False)
    duration = db.Column(db.Integer, nullable=False)      # em minutos
    is_custom = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=True)  # null para presets padrão
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'dimension': self.dimension,
            'category': self.category,
            'baseFrequency': self.base_frequency,
            'beatFrequency': self.beat_frequency,
            'lightFrequency': self.light_frequency,
            'duration': self.duration,
            'isCustom': self.is_custom,
            'userId': self.user_id,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

