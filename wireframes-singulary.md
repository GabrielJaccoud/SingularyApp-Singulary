# Wireframes Detalhados - Singulary App

## Visão Geral do Design

O Singulary utiliza uma identidade visual etérea e espiritual, baseada na paleta de cores do logo:
- **Lilás suave**: #D8C7E8 (cor primária)
- **Azul profundo**: #1C2B4A (texto e elementos principais)
- **Dourado translúcido**: rgba(255, 215, 0, 0.6) (acentos e destaques)
- **Gradientes**: Transições suaves entre lilás, azul e branco

### Princípios de Design
- **Glassmorphism**: Cards com transparência e blur
- **Minimalismo Espiritual**: Interface limpa com elementos significativos
- **Responsividade**: Design mobile-first
- **Acessibilidade**: Contraste adequado e avisos de segurança

---



## 1. Splash Screen

```
┌─────────────────────────────────────┐
│                                     │
│              [LOGO]                 │
│           Singulary                 │
│                                     │
│                                     │
│            Singulary                │
│                                     │
│    Conectando você ao seu           │
│    potencial e além...              │
│                                     │
│                                     │
│         [Loading Spinner]           │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### Especificações:
- **Background**: Gradiente lilás para branco
- **Logo**: Centralizado, 64x64px com animação pulse
- **Título**: "Singulary" em fonte bold, cor azul profundo
- **Subtítulo**: Texto inspiracional em cor muted
- **Loading**: Spinner circular com cor primária
- **Duração**: 3 segundos com fade out suave

---


## 2. Tela Inicial (Home)

```
┌─────────────────────────────────────┐
│ [Logo] Bem-vindo ao Singulary       │
│        Seu Ressonador Quântico      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    Sua Jornada de Hoje          │ │
│ │                                 │ │
│ │   [2]        [45]               │ │
│ │ Sessões     Minutos             │ │
│ │                                 │ │
│ │ Recomendado para você:          │ │
│ │ Foco 3D - Concentração...       │ │
│ │                    [▶ Iniciar]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────┐ ┌─────────────────┐ │
│ │ [🧭]        │ │ [▶]             │ │
│ │ Explorar    │ │ Sessão          │ │
│ │ Dimensões   │ │ Rápida          │ │
│ │ Descubra... │ │ Comece agora    │ │
│ └─────────────┘ └─────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    Seu Progresso                │ │
│ │                                 │ │
│ │ [15]    [320]    [3]            │ │
│ │Total   Minutos  Dimensões       │ │
│ │Sessões  Totais                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🏠] [🧭] [▶] [🗺️] [📊] [👤]        │
└─────────────────────────────────────┘
```

### Especificações:
- **Header**: Logo pequeno + saudação personalizada
- **Card Principal**: Glassmorphism com estatísticas do dia
- **Grid de Navegação**: 2 cards principais com ícones
- **Progresso**: Card com métricas gerais
- **Bottom Navigation**: 6 ícones com labels

---


## 3. Explorar Dimensões

```
┌─────────────────────────────────────┐
│ [←] Explorar Dimensões              │
│     Descubra frequências para       │
│     diferentes estados...           │
│                                     │
│ Filtros:                            │
│ [Todas][3D][4D][5D][Personalizado] │
│ [Todas][Foco][Relaxamento][Sono]... │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Foco 3D              [3D] [▶]   │ │
│ │ Frequências para concentração   │ │
│ │ Base: 528Hz | Batida: 40Hz      │ │
│ │ Duração: 20min                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Meditação 4D         [4D] [▶]   │ │
│ │ Acesso ao plano astral...       │ │
│ │ Base: 285Hz | Batida: 6Hz       │ │
│ │ Duração: 45min                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Amor Incondicional 5D [5D] [▶]  │ │
│ │ Conexão com o eu superior...    │ │
│ │ Base: 144Hz | Batida: 7.83Hz    │ │
│ │ Duração: 40min                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │           [+]                   │ │
│ │ Criar Preset Personalizado      │ │
│ │ Configure suas próprias freq... │ │
│ │        [Criar Novo]             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🏠] [🧭] [▶] [🗺️] [📊] [👤]        │
└─────────────────────────────────────┘
```

### Especificações:
- **Filtros**: Chips horizontais com scroll
- **Cards de Preset**: Informações técnicas + badge dimensional
- **Botão Play**: Acesso direto ao player
- **Card de Criação**: Destaque para funcionalidade personalizada

---


## 4. Player / Sessão

```
┌─────────────────────────────────────┐
│ [←] Foco 3D                         │
│     Frequências para concentração   │
│                                     │
│ ⚠️  AVISO: Luzes estroboscópicas    │
│     podem causar convulsões...      │
│     [Entendi] [Apenas Áudio]        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    Visualização Estroboscópica  │ │
│ │                                 │ │
│ │        [Padrão Pulsante]        │ │
│ │                                 │ │
│ │     10Hz • Ativo               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Controles de Áudio    [15:42]   │ │
│ │                                 │ │
│ │ Frequência Base: 528Hz          │ │
│ │ ████████████░░░░░░░░░░░░         │ │
│ │                                 │ │
│ │ Frequência de Batida: 40Hz      │ │
│ │ ████████░░░░░░░░░░░░░░░░         │ │
│ │                                 │ │
│ │ Frequência de Luz: 10Hz         │ │
│ │ ████░░░░░░░░░░░░░░░░░░░░         │ │
│ │                                 │ │
│ │    [▶ Iniciar]  [⏹ Parar]      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Como você se sente agora?       │ │
│ │                                 │ │
│ │ Humor atual (1-10)              │ │
│ │ ████████░░░░░░░░░░░░░░░░  [8]    │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🏠] [🧭] [▶] [🗺️] [📊] [👤]        │
└─────────────────────────────────────┘
```

### Especificações:
- **Aviso de Segurança**: Alert destacado para epilepsia
- **Visualização**: Canvas com padrões estroboscópicos
- **Controles**: Sliders para ajuste em tempo real
- **Timer**: Contador de sessão em destaque
- **Avaliação**: Slider de humor pré-sessão

---


## 5. Jornada Espiritual

```
┌─────────────────────────────────────┐
│ Sua Jornada Espiritual              │
│ Acompanhe seu progresso e           │
│ desbloqueie novas dimensões         │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    Missões de Hoje              │ │
│ │                                 │ │
│ │ ✓ Sessão Diária                 │ │
│ │   Complete uma sessão de 10min  │ │
│ │   ████████████████████ 1/1      │ │
│ │   Recompensa: 10 pontos XP      │ │
│ │                                 │ │
│ │ ○ Explorar Nova Frequência      │ │
│ │   Experimente um preset novo    │ │
│ │   ░░░░░░░░░░░░░░░░░░░░ 0/1       │ │
│ │   Recompensa: Insight           │ │
│ │                                 │ │
│ │ ○ Sessão Consciente             │ │
│ │   Complete com avaliação        │ │
│ │   ░░░░░░░░░░░░░░░░░░░░ 0/1       │ │
│ │   Recompensa: Análise humor     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Zonas Dimensionais              │ │
│ │                                 │ │
│ │ [3D] [4D] [5D]                  │ │
│ │                                 │ │
│ │ Dimensão Física                 │ │
│ │ Foco, energia e relaxamento     │ │
│ │                                 │ │
│ │ Progresso: 75%                  │ │
│ │ ███████████████░░░░░░░░          │ │
│ │                                 │ │
│ │ [15] Sessões | Desbloqueada     │ │
│ │                                 │ │
│ │ Próximo: Desbloqueie 4D com     │ │
│ │ 20 sessões 3D                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    Conquistas                   │ │
│ │                                 │ │
│ │ ⭐ Primeira Jornada             │ │
│ │    Complete sua primeira...     │ │
│ │    [Conquistado]                │ │
│ │                                 │ │
│ │ 🏆 Dedicação Semanal            │ │
│ │    7 dias consecutivos...       │ │
│ │    [Bloqueado]                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🏠] [🧭] [▶] [🗺️] [📊] [👤]        │
└─────────────────────────────────────┘
```

### Especificações:
- **Missões**: Lista com checkboxes e progress bars
- **Dimensões**: Tabs com progresso visual
- **Conquistas**: Cards com ícones e status
- **Gamificação**: Elementos visuais motivacionais

---


## 6. Histórico de Sessões

```
┌─────────────────────────────────────┐
│ Histórico de Sessões    [📥 Export] │
│ Acompanhe sua evolução e padrões    │
│                                     │
│ Filtros:                            │
│ Dimensão: [Todas ▼] Período: [▼]    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [15] [320] [+2.1]               │ │
│ │ Sessões Minutos Humor           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Foco 3D              [3D]       │ │
│ │ 10/08/2025 14:30                │ │
│ │                                 │ │
│ │ 20:00                  +1.5     │ │
│ │ Duração               Humor     │ │
│ │                                 │ │
│ │ "Me senti mais concentrado"     │ │
│ │                                 │ │
│ │ Base: 528Hz | Batida: 40Hz      │ │
│ │ Luz: 10Hz                       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Meditação 4D         [4D]       │ │
│ │ 09/08/2025 19:15                │ │
│ │                                 │ │
│ │ 45:00                  +2.0     │ │
│ │ Duração               Humor     │ │
│ │                                 │ │
│ │ "Experiência profunda"          │ │
│ │                                 │ │
│ │ Base: 285Hz | Batida: 6Hz       │ │
│ │ Luz: 3Hz                        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Sessão Personalizada [Custom]   │ │
│ │ 08/08/2025 21:00                │ │
│ │                                 │ │
│ │ 30:00                  +0.5     │ │
│ │ Duração               Humor     │ │
│ │                                 │ │
│ │ Base: 432Hz | Batida: 8Hz       │ │
│ │ Luz: 4Hz                        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [🏠] [🧭] [▶] [🗺️] [📊] [👤]        │
└─────────────────────────────────────┘
```

### Especificações:
- **Filtros**: Dropdowns para dimensão e período
- **Estatísticas**: Cards com métricas resumidas
- **Lista de Sessões**: Cards cronológicos com detalhes
- **Export**: Botão para download CSV
- **Indicadores**: Badges dimensionais e mudança de humor

---


## 7. Perfil / Configurações

```
┌─────────────────────────────────────┐
│ [Logo] Usuário Singulary            │
│        usuario@singulary.app        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    Suas Estatísticas            │ │
│ │                                 │ │
│ │ [15]    [320]   [7]     [3]     │ │
│ │Total   Minutos Sequência Dimen. │ │
│ │Sessões  Totais  Atual           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    Configurações                │ │
│ │                                 │ │
│ │ 🌙 Modo Escuro          [○]     │ │
│ │    Alternar tema claro/escuro   │ │
│ │                                 │ │
│ │ 🔔 Notificações         [●]     │ │
│ │    Receber lembretes...         │ │
│ │                                 │ │
│ │ 🛡️  Dados Privados      [●]     │ │
│ │    Manter dados localmente      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Informações da Conta            │ │
│ │                                 │ │
│ │ Nome: [Usuário Singulary    ]   │ │
│ │ Email: [usuario@singulary.app]  │ │
│ │                                 │ │
│ │     [Editar Perfil (Em breve)]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │    Sobre o Singulary            │ │
│ │                                 │ │
│ │ [Mostrar Informações]           │ │
│ │                                 │ │
│ │ Versão: 1.0.0 (MVP)             │ │
│ │ Desenvolvido por: Equipe...     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ⚠️  Este aplicativo é uma          │ │
│     ferramenta de bem-estar...     │ │
│                                     │ │
│        [🚪 Sair da Conta]          │ │
│                                     │
│ [🏠] [🧭] [▶] [🗺️] [📊] [👤]        │
└─────────────────────────────────────┘
```

### Especificações:
- **Header**: Logo + informações do usuário
- **Estatísticas**: Grid com métricas principais
- **Configurações**: Switches para preferências
- **Conta**: Campos de informações pessoais
- **Sobre**: Informações do app e versão
- **Avisos**: Disclaimers importantes
- **Logout**: Botão de saída destacado

---


## 8. Bottom Navigation

```
┌─────────────────────────────────────┐
│                                     │
│              CONTEÚDO               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [🏠] [🧭] [▶] [🗺️] [📊] [👤]    │ │
│ │ Início Explorar Player Jornada  │ │
│ │              Histórico Perfil   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Especificações:
- **Posição**: Fixa na parte inferior
- **Background**: Glassmorphism com blur
- **Ícones**: Lucide icons com labels
- **Estado Ativo**: Cor primária + background sutil
- **Responsividade**: Adapta ao tamanho da tela

---

## 9. Modais e Dialogs

### Modal de Fim de Sessão
```
┌─────────────────────────────────────┐
│                                     │
│   ┌─────────────────────────────┐   │
│   │ Finalizar Sessão            │   │
│   │                             │   │
│   │ Como você se sente agora?   │   │
│   │ (1-10)                      │   │
│   │ ████████░░░░░░░░░░░░  [8]    │   │
│   │                             │   │
│   │ Notas da sessão (opcional)  │   │
│   │ [Como foi sua experiência?] │   │
│   │                             │   │
│   │   [Finalizar] [Cancelar]    │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Alert de Segurança
```
┌─────────────────────────────────────┐
│ ⚠️  AVISO: Este aplicativo utiliza  │
│     luzes estroboscópicas que podem │
│     causar convulsões em pessoas... │
│                                     │
│     [Entendi, continuar]            │
│     [Usar apenas áudio]             │
└─────────────────────────────────────┘
```

---

## 10. Especificações Técnicas de UI

### Paleta de Cores
```css
:root {
  --lilas: #D8C7E8;
  --azul-profundo: #1C2B4A;
  --dourado: rgba(255, 215, 0, 0.6);
  --glass: rgba(255, 255, 255, 0.12);
  --bg-gradient: linear-gradient(180deg, #D8C7E8 0%, #E8E3F6 40%, #F5F3FA 60%);
}
```

### Tipografia
- **Fonte**: Inter, system-ui, sans-serif
- **Títulos**: 18-24px, font-weight: 700
- **Corpo**: 14-16px, font-weight: 400
- **Labels**: 12-13px, font-weight: 500

### Espaçamento
- **Padding**: 16px (padrão), 20px (cards)
- **Margin**: 16px (entre elementos), 24px (seções)
- **Border Radius**: 12-14px (cards), 8-10px (botões)

### Componentes
- **Cards**: Glassmorphism com backdrop-filter: blur(6px)
- **Botões**: Border-radius: 10px, padding: 10px 14px
- **Inputs**: Border-radius: 8px, padding: 10px
- **Sliders**: Altura: 6px, thumb: 20px

### Animações
- **Transições**: 0.3s ease para hover/focus
- **Loading**: Spinner com rotação suave
- **Fade**: 0.5s para modais e transições de tela
- **Pulse**: 2s ease-in-out infinite para elementos destacados

### Responsividade
- **Mobile**: 320px - 768px (design principal)
- **Tablet**: 768px - 1024px (adaptações)
- **Desktop**: 1024px+ (centralizado, max-width: 480px)

---

## Conclusão

Os wireframes do Singulary seguem uma abordagem centrada no usuário, priorizando:

1. **Segurança**: Avisos claros sobre epilepsia fotossensível
2. **Usabilidade**: Interface intuitiva e acessível
3. **Espiritualidade**: Design que reflete a proposta transcendental
4. **Funcionalidade**: Todas as features do MVP contempladas
5. **Escalabilidade**: Estrutura preparada para futuras expansões

O design visual combina elementos modernos (glassmorphism, gradientes) com uma paleta de cores que evoca espiritualidade e tecnologia, criando uma experiência única para o usuário em sua jornada de expansão de consciência.

