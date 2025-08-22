import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Settings, Bell, Shield, Info, LogOut, Moon, Sun } from 'lucide-react'
import logoSingulary from '../assets/LogoSingularyemTonsGradientes.png'

export default function Profile() {
  const { user, userProgress, logout } = useApp()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [showAbout, setShowAbout] = useState(false)

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout()
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="logo-container">
          <img 
            src={logoSingulary} 
            alt="Singulary" 
            className="w-12 h-12 object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">
            {user?.name || 'Usuário Singulary'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user?.email || 'usuario@singulary.app'}
          </p>
        </div>
      </div>

      {/* Estatísticas do Usuário */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Suas Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {userProgress.totalSessions}
              </div>
              <div className="text-sm text-muted-foreground">
                Total de Sessões
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {userProgress.totalMinutes}
              </div>
              <div className="text-sm text-muted-foreground">
                Minutos Totais
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {userProgress.currentStreak}
              </div>
              <div className="text-sm text-muted-foreground">
                Sequência Atual
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {userProgress.dimensionsUnlocked.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Dimensões Desbloqueadas
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tema */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              <div>
                <Label>Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Alternar entre tema claro e escuro
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>

          {/* Notificações */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={20} />
              <div>
                <Label>Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  Receber lembretes de sessões
                </p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          {/* Privacidade */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={20} />
              <div>
                <Label>Dados Privados</Label>
                <p className="text-sm text-muted-foreground">
                  Manter dados apenas localmente
                </p>
              </div>
            </div>
            <Switch checked={true} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Informações da Conta */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input 
              value={user?.name || ''} 
              placeholder="Seu nome"
              disabled
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input 
              value={user?.email || ''} 
              placeholder="seu@email.com"
              disabled
            />
          </div>
          <Button variant="outline" className="w-full" disabled>
            Editar Perfil (Em breve)
          </Button>
        </CardContent>
      </Card>

      {/* Sobre */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} />
            Sobre o Singulary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full mb-4"
            onClick={() => setShowAbout(!showAbout)}
          >
            {showAbout ? 'Ocultar' : 'Mostrar'} Informações
          </Button>
          
          {showAbout && (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>Singulary</strong> é um Ressonador Quântico Pessoal que utiliza 
                frequências de áudio binaurais e isocrônicas para promover estados 
                alterados de consciência e bem-estar.
              </p>
              <p>
                Baseado em princípios de neurociência e física da consciência, 
                o aplicativo oferece uma jornada progressiva através de diferentes 
                dimensões de experiência.
              </p>
              <div className="border-t pt-4">
                <p><strong>Versão:</strong> 1.0.0 (MVP)</p>
                <p><strong>Desenvolvido por:</strong> Equipe Singulary</p>
                <p><strong>Tecnologia:</strong> PWA com Web Audio API</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Avisos Importantes */}
      <Alert className="mb-6">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Este aplicativo é uma ferramenta de bem-estar 
          e não substitui tratamento médico profissional. Se você tem condições 
          médicas, consulte um profissional antes de usar.
        </AlertDescription>
      </Alert>

      {/* Logout */}
      <Button 
        variant="destructive" 
        className="w-full"
        onClick={handleLogout}
      >
        <LogOut size={20} className="mr-2" />
        Sair da Conta
      </Button>
    </div>
  )
}

