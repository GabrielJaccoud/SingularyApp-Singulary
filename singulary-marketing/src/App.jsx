import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Play, 
  Download, 
  Star, 
  Users, 
  Zap, 
  Brain, 
  Heart, 
  Shield,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Waves,
  Eye,
  Volume2
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import './App.css';
import logoSingulary from './assets/LogoSingularyemTonsGradientes.png';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
  }, []);

  const features = [
    {
      icon: <Waves className="w-8 h-8" />,
      title: "Terapia Sonora Binaural",
      description: "Frequências precisas para diferentes estados mentais e expansão de consciência",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Visualização Estroboscópica",
      description: "Padrões de luz sincronizados com avisos de segurança para epilepsia",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Dimensões Espirituais",
      description: "Presets organizados por níveis 3D, 4D e 5D de consciência",
      color: "from-pink-500 to-red-600"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Personalização Avançada",
      description: "Crie seus próprios presets e ajuste frequências conforme sua necessidade",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Análise de Progresso",
      description: "Tracking de humor e evolução pessoal com relatórios detalhados",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Gamificação",
      description: "Sistema de jornada espiritual com conquistas e níveis",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Terapeuta Holística",
      content: "O Singulary revolucionou minha prática. Meus clientes relatam estados de consciência mais profundos.",
      rating: 5,
      avatar: "MS"
    },
    {
      name: "João Santos",
      role: "Meditador Avançado",
      content: "Nunca experimentei algo tão poderoso. As frequências 5D me levaram a dimensões inexploradas.",
      rating: 5,
      avatar: "JS"
    },
    {
      name: "Ana Costa",
      role: "Pesquisadora em Neurociência",
      content: "A precisão das frequências binaurais é impressionante. Resultados mensuráveis em EEG.",
      rating: 5,
      avatar: "AC"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Usuários Ativos" },
    { number: "50,000+", label: "Sessões Realizadas" },
    { number: "4.9/5", label: "Avaliação Média" },
    { number: "95%", label: "Taxa de Satisfação" }
  ];

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logoSingulary} alt="Singulary" className="w-10 h-10" />
            <span className="text-2xl font-bold singulary-text-gradient">Singulary</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-purple-600 transition-colors">
              Recursos
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-purple-600 transition-colors">
              Como Funciona
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-purple-600 transition-colors">
              Depoimentos
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-purple-600 transition-colors">
              Preços
            </button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              Entrar
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <a href="https://osjxoywh.manus.space" target="_blank" rel="noopener noreferrer" className="flex items-center">
                Abrir App
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <button onClick={() => scrollToSection('features')} className="block text-gray-600 hover:text-purple-600">
                Recursos
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="block text-gray-600 hover:text-purple-600">
                Como Funciona
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="block text-gray-600 hover:text-purple-600">
                Depoimentos
              </button>
              <button onClick={() => scrollToSection('pricing')} className="block text-gray-600 hover:text-purple-600">
                Preços
              </button>
              <div className="pt-4 space-y-2">
                <Button variant="outline" className="w-full border-purple-200 text-purple-600">
                  Entrar
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  <a href="https://osjxoywh.manus.space" target="_blank" rel="noopener noreferrer">
                    Abrir App
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-pattern">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </motion.div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
              🚀 Revolucionário em Expansão de Consciência
            </Badge>
            
            <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 text-shadow">
              <span className="singulary-text-gradient">Singulary</span>
              <br />
              <span className="text-gray-800">Ressonador Quântico Pessoal</span>
            </h1>
            
            <p className="hero-subtitle text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Conectando você ao seu potencial e além... Descubra dimensões inexploradas da consciência através de frequências binaurais e visualização estroboscópica.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4 hover-lift"
              >
                <a href="https://osjxoywh.manus.space" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Abrir App Grátis
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-200 text-purple-600 hover:bg-purple-50 text-lg px-8 py-4 hover-lift"
                onClick={() => scrollToSection('features')}
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Recursos
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Gratuito para sempre
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Sem anúncios
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Dados privados
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-gray-400 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold singulary-text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Recursos <span className="singulary-text-gradient">Revolucionários</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologia de ponta encontra sabedoria ancestral para criar uma experiência única de expansão de consciência.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover-lift glassmorphism border-0 shadow-lg">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Como <span className="singulary-text-gradient">Funciona</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Três passos simples para começar sua jornada de expansão de consciência.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Escolha sua Dimensão",
                description: "Selecione entre presets 3D, 4D ou 5D baseados no seu nível de experiência e objetivos.",
                icon: <Brain className="w-8 h-8" />
              },
              {
                step: "02",
                title: "Configure sua Sessão",
                description: "Ajuste frequências, duração e intensidade conforme sua preferência e ambiente.",
                icon: <Volume2 className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Experimente a Transformação",
                description: "Relaxe e permita que as frequências binaurais guiem você para estados expandidos de consciência.",
                icon: <Sparkles className="w-8 h-8" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {step.step}
                  </div>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-purple-600">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              O que dizem nossos <span className="singulary-text-gradient">Usuários</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Milhares de pessoas já transformaram suas vidas com o Singulary.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para Expandir sua Consciência?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de pessoas que já descobriram o poder transformador do Singulary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 hover-lift"
              >
                <a href="https://osjxoywh.manus.space" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Abrir Agora - Grátis
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4 hover-lift"
                onClick={() => scrollToSection('features')}
              >
                Saiba Mais
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src={logoSingulary} alt="Singulary" className="w-8 h-8" />
                <span className="text-xl font-bold">Singulary</span>
              </div>
              <p className="text-gray-400 mb-4">
                Conectando você ao seu potencial e além...
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs">i</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://osjxoywh.manus.space" className="hover:text-white transition-colors">Abrir App</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Depoimentos</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comunidade</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Singulary. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
