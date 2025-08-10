from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db, User

class Session(db.Model):
    __tablename__ = 'sessions'
    
    id = db.Column(db.String(50), primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    preset_id = db.Column(db.String(50), db.ForeignKey('presets.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.Integer, nullable=True)  # em segundos
    pre_mood_score = db.Column(db.Integer, nullable=True)  # 1-10
    post_mood_score = db.Column(db.Integer, nullable=True)  # 1-10
    notes = db.Column(db.Text, nullable=True)
    device_model = db.Column(db.String(100), nullable=True)
    headphones_used = db.Column(db.Boolean, default=False)
    room_dark = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    user = db.relationship('User', backref='sessions')
    preset = db.relationship('Preset', backref='sessions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'presetId': self.preset_id,
            'startTime': self.start_time.isoformat() if self.start_time else None,
            'endTime': self.end_time.isoformat() if self.end_time else None,
            'duration': self.duration,
            'preMoodScore': self.pre_mood_score,
            'postMoodScore': self.post_mood_score,
            'notes': self.notes,
            'deviceModel': self.device_model,
            'headphonesUsed': self.headphones_used,
            'roomDark': self.room_dark,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
    
    def to_csv_row(self):
        """Retorna dados formatados para CSV"""
        preset_name = self.preset.name if self.preset else 'Personalizado'
        dimension_tag = self.preset.dimension if self.preset else 'Personalizado'
        base_freq = self.preset.base_frequency if self.preset else 0
        beat_freq = self.preset.beat_frequency if self.preset else 0
        light_freq = self.preset.light_frequency if self.preset else 0
        
        return {
            'session_id': self.id,
            'user_id': self.user_id,
            'date_utc': self.start_time.isoformat() if self.start_time else '',
            'timezone': 'UTC',
            'preset_name': preset_name,
            'dimension_tag': dimension_tag,
            'base_frequency_hz': base_freq,
            'beat_frequency_hz': beat_freq,
            'light_frequency_hz': light_freq,
            'duration_seconds': self.duration or 0,
            'headphones_used': 'yes' if self.headphones_used else 'no',
            'room_dark': 'yes' if self.room_dark else 'no',
            'pre_mood_score': self.pre_mood_score or '',
            'post_mood_score': self.post_mood_score or '',
            'notes_text': self.notes or '',
            'device_model': self.device_model or '',
            'firmware_version': '1.0.0',
            'recording_path': '',
            'session_hash': f"hash_{self.id}"
        }

