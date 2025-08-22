from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['*'])

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'message': 'Singulary API está funcionando',
        'timestamp': '2025-08-20T15:36:00Z'
    })

# Para Vercel
def handler(request):
    with app.test_request_context(request.url, method=request.method, headers=request.headers):
        return app.full_dispatch_request()

