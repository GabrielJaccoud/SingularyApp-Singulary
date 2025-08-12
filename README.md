# Singulary: Ressonador Quântico Pessoal (RQP)

![Singulary Logo](/home/ubuntu/upload/LogoSingularyemTonsGradientes.png)

O Singulary é um aplicativo inovador projetado para auxiliar na expansão da consciência e no bem-estar através da combinação de terapia sonora binaural e visualização estroboscópica. Ele oferece uma jornada personalizada através de diferentes "dimensões" de consciência (3D, 4D, 5D), permitindo aos usuários explorar estados mentais profundos, melhorar o foco, reduzir o estresse e promover a cura emocional e espiritual.

## ✨ Funcionalidades Principais

*   **Terapia Sonora Binaural**: Frequências precisas para induzir estados cerebrais específicos.
*   **Visualização Estroboscópica**: Padrões de luz sincronizados para potencializar a experiência (com avisos de segurança).
*   **Dimensões de Consciência (3D, 4D, 5D)**: Presets categorizados para diferentes níveis de experiência e objetivos.
*   **Presets Personalizáveis**: Crie e salve suas próprias configurações de áudio e visual.
*   **Histórico de Sessões**: Acompanhe seu progresso e observe padrões de bem-estar.
*   **Autenticação JWT**: Segurança para seus dados e sessões.

## 🚀 Acessar o Aplicativo Deployado

Você pode acessar a versão mais recente do Singulary diretamente pelo seu navegador:

*   **Aplicativo (Frontend)**: [https://osjxoywh.manus.space](https://osjxoywh.manus.space)
*   **Site de Marketing**: [https://emhwkqoq.manus.space](https://emhwkqoq.manus.space)
*   **API (Backend)**: [https://kkh7ikcy081e.manus.space/api](https://kkh7ikcy081e.manus.space/api)

## 💻 Como Executar Localmente

Para executar o Singulary em seu ambiente local, siga as instruções abaixo:

### Pré-requisitos

Certifique-se de ter o seguinte instalado:

*   Python 3.8+
*   Node.js 16+
*   npm ou pnpm

### 1. Clonar o Repositório

```bash
git clone https://github.com/GabrielJaccoud/SingularyApp-Singulary.git
cd SingularyApp-Singulary
```

### 2. Configurar e Iniciar o Backend (Flask)

```bash
cd singulary-backend
python -m venv venv
source venv/bin/activate  # No Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

O backend será iniciado em `http://localhost:5000`.

### 3. Configurar e Iniciar o Frontend (React)

```bash
cd ../singulary-frontend
pnpm install  # ou npm install
pnpm run dev  # ou npm run start
```

O frontend será iniciado em `http://localhost:5173` (ou outra porta disponível).

### 4. Inicializar Presets Padrão (Opcional)

Para popular o banco de dados com presets padrão, execute o seguinte comando após iniciar o backend:

```bash
curl -X POST http://localhost:5000/api/presets/seed
```

## 📄 Manual do Usuário

Para um guia detalhado sobre como usar o Singulary, seus recursos, avisos de segurança e perguntas frequentes, consulte o Manual do Usuário:

*   [Manual do Usuário (PDF)](manual_usuario_singulary.pdf)
*   [Manual do Usuário (Markdown)](manual_usuario_singulary.md)

## 🛡️ Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📸 Capturas de Tela

(Em breve: Adicionar capturas de tela do aplicativo e do site de marketing aqui.)

---

**Desenvolvido por:** Manus AI
**Versão:** 1.0
**Data:** 10 de Agosto de 2025


