import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime
import json

# Configuração do banco de dados SQLite para Vercel
DATABASE_PATH = '/tmp/singulary.db'

def init_database():
    """Inicializa o banco de dados com as tabelas necessárias"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Tabela de usuários
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            last_login TEXT
        )
    ''')
    
    # Tabela de presets
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS presets (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            dimension TEXT NOT NULL,
            category TEXT,
            base_frequency REAL NOT NULL,
            binaural_beat REAL NOT NULL,
            duration INTEGER NOT NULL,
            volume REAL DEFAULT 0.5,
            is_default BOOLEAN DEFAULT FALSE,
            user_id TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Tabela de sessões
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            preset_id TEXT NOT NULL,
            duration INTEGER NOT NULL,
            mood_before INTEGER,
            mood_after INTEGER,
            notes TEXT,
            started_at TEXT NOT NULL,
            ended_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (preset_id) REFERENCES presets (id)
        )
    ''')
    
    conn.commit()
    conn.close()

@contextmanager
def get_db_connection():
    """Context manager para conexões com o banco de dados"""
    init_database()
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Para acessar colunas por nome
    try:
        yield conn
    finally:
        conn.close()

def seed_default_presets():
    """Popula o banco com presets padrão"""
    default_presets = [
        {
            'id': '3d-relaxamento',
            'name': 'Relaxamento Profundo 3D',
            'description': 'Frequência base para relaxamento e redução do estresse',
            'dimension': '3D',
            'category': 'relaxamento',
            'base_frequency': 432.0,
            'binaural_beat': 8.0,
            'duration': 1200,
            'volume': 0.5,
            'is_default': True,
            'user_id': None
        },
        {
            'id': '4d-meditacao',
            'name': 'Meditação Transcendental 4D',
            'description': 'Frequência para estados meditativos profundos',
            'dimension': '4D',
            'category': 'meditacao',
            'base_frequency': 528.0,
            'binaural_beat': 6.0,
            'duration': 1800,
            'volume': 0.5,
            'is_default': True,
            'user_id': None
        },
        {
            'id': '5d-expansao',
            'name': 'Expansão Consciencial 5D',
            'description': 'Frequência para expansão da consciência e conexão espiritual',
            'dimension': '5D',
            'category': 'expansao',
            'base_frequency': 963.0,
            'binaural_beat': 4.0,
            'duration': 2400,
            'volume': 0.5,
            'is_default': True,
            'user_id': None
        }
    ]
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        for preset in default_presets:
            cursor.execute('''
                INSERT OR IGNORE INTO presets 
                (id, name, description, dimension, category, base_frequency, 
                 binaural_beat, duration, volume, is_default, user_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                preset['id'], preset['name'], preset['description'],
                preset['dimension'], preset['category'], preset['base_frequency'],
                preset['binaural_beat'], preset['duration'], preset['volume'],
                preset['is_default'], preset['user_id']
            ))
        conn.commit()

