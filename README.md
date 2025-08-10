# Singulary - Ressonador Quântico Pessoal (RQP)

![Singulary Logo](./LogoSingularyemTonsGradientes.png)

## Visão Geral

O **Singulary** é um aplicativo inovador que combina terapia sonora binaural, visualização estroboscópica e tecnologia de expansão de consciência para proporcionar experiências transformadoras de bem-estar. O projeto representa a convergência entre ciência moderna e sabedoria ancestral sobre frequências e estados alterados de consciência.

### 🎯 Missão
Democratizar o acesso a tecnologias de expansão de consciência, oferecendo ferramentas seguras e eficazes para meditação, relaxamento, foco e crescimento espiritual.

### ✨ Características Principais
- **Terapia Sonora Binaural**: Frequências precisas para diferentes estados mentais
- **Visualização Estroboscópica**: Padrões de luz sincronizados (com avisos de segurança)
- **Dimensões Espirituais**: Presets organizados por níveis 3D, 4D e 5D
- **Personalização Avançada**: Criação de presets customizados
- **Análise de Progresso**: Tracking de humor e evolução pessoal
- **Gamificação**: Sistema de jornada espiritual e conquistas

## 🏗️ Arquitetura do Projeto

```
singulary-project/
├── singulary-frontend/          # Aplicação React
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── context/            # Context API
│   │   ├── utils/              # Utilitários e motor de áudio
│   │   └── assets/             # Imagens e recursos
│   └── package.json
├── singulary-backend/           # API Flask
│   ├── src/
│   │   ├── models/             # Modelos de dados
│   │   ├── routes/             # Endpoints da API
│   │   └── database/           # Banco de dados SQLite
│   └── requirements.txt
├── wireframes-singulary.md      # Wireframes detalhados
├── api-specification-singulary.yaml  # Documentação OpenAPI
├── plano-acao-singulary.md      # Plano de ação integrado
└── *.csv                       # Templates e exemplos de dados
```

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 20+ 
- Python 3.11+
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd singulary-project
```

2. **Configure o Backend**
```bash
cd singulary-backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

3. **Configure o Frontend**
```bash
cd ../singulary-frontend
npm install
# ou pnpm install
```

### Executando o Projeto

1. **Inicie o Backend**
```bash
cd singulary-backend
source venv/bin/activate
python src/main.py
```
O backend estará disponível em `http://localhost:5000`

2. **Inicie o Frontend**
```bash
cd singulary-frontend
npm run dev
```
O frontend estará disponível em `http://localhost:5173`

3. **Inicialize os Dados**
```bash
# Criar presets padrão
curl -X POST http://localhost:5000/api/presets/seed
```

## 📱 Funcionalidades Implementadas

### ✅ MVP Completo
- [x] Sistema de autenticação JWT
- [x] Gerenciamento de presets (padrão + personalizados)
- [x] Player de áudio binaural
- [x] Visualização estroboscópica com avisos de segurança
- [x] Registro e análise de sessões
- [x] Sistema de avaliação de humor
- [x] Exportação de dados em CSV
- [x] Interface responsiva e acessível
- [x] Navegação por dimensões espirituais (3D, 4D, 5D)

### 🔄 Em Desenvolvimento
- [ ] Sistema de gamificação completo
- [ ] Notificações e lembretes
- [ ] Modo offline
- [ ] Integração com wearables
- [ ] IA para recomendações personalizadas

### 🔮 Roadmap Futuro
- [ ] Hardware dedicado (LED Ring, Headsets)
- [ ] Realidade virtual e aumentada
- [ ] Estudos científicos de eficácia
- [ ] Expansão internacional
- [ ] Plataforma para profissionais

## 🛡️ Segurança e Avisos

### ⚠️ AVISO IMPORTANTE
Este aplicativo utiliza **luzes estroboscópicas** que podem causar convulsões em pessoas com epilepsia fotossensível. Sempre:
- Leia todos os avisos antes de usar
- Use o modo "apenas áudio" se tiver histórico de epilepsia
- Pare imediatamente se sentir desconforto
- Consulte um médico antes de usar se tiver condições neurológicas

### 🔒 Privacidade
- Dados pessoais criptografados
- Conformidade com LGPD/GDPR
- Opção de manter dados localmente
- Transparência total sobre coleta de dados

## 🧪 Tecnologias Utilizadas

### Frontend
- **React 18** com Hooks e Context API
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **Web Audio API** para síntese de áudio
- **Canvas API** para visualizações

### Backend
- **Flask** com blueprints
- **SQLAlchemy** para ORM
- **JWT** para autenticação
- **Flask-CORS** para integração frontend
- **SQLite** para banco de dados

### DevOps e Ferramentas
- **Git** para versionamento
- **ESLint/Prettier** para qualidade de código
- **OpenAPI 3.0** para documentação da API
- **CSV** para exportação de dados

## 📊 Estrutura de Dados

### Principais Entidades
- **Users**: Usuários do sistema
- **Presets**: Configurações de frequências
- **Sessions**: Registros de sessões realizadas
- **Devices**: Hardware conectado (futuro)

### Exemplo de Preset
```json
{
  "id": "3d-focus",
  "name": "Foco 3D",
  "dimension": "3D",
  "category": "Foco",
  "baseFrequency": 528,
  "beatFrequency": 40,
  "lightFrequency": 10,
  "duration": 20
}
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```bash
# Backend
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///app.db

# Frontend
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Singulary
```

### Personalização de Frequências
O sistema suporta:
- **Frequência Base**: 100-1000 Hz
- **Frequência Binaural**: 1-100 Hz
- **Frequência de Luz**: 1-30 Hz (com limitações de segurança)

## 🤝 Contribuindo

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes
- Siga os padrões de código estabelecidos
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Priorize sempre a segurança do usuário

## 📄 Documentação Adicional

- [Wireframes Detalhados](./wireframes-singulary.md)
- [Especificação da API](./api-specification-singulary.yaml)
- [Plano de Ação](./plano-acao-singulary.md)
- [Templates de Dados](./presets_singulary.csv)

## 📞 Suporte e Contato

- **Email**: suporte@singulary.app
- **Website**: https://singulary.app
- **Documentação**: https://docs.singulary.app
- **Comunidade**: https://community.singulary.app

## 📜 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- Comunidade de desenvolvedores de bem-estar tecnológico
- Pesquisadores em neurociência e terapia sonora
- Beta testers e early adopters
- Todos que acreditam no potencial transformador da tecnologia

---

**Desenvolvido com ❤️ pela equipe Singulary**

*"Conectando você ao seu potencial e além..."*

