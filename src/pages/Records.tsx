import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Video, 
  Image, 
  Upload, 
  Calendar, 
  Tag, 
  Filter, 
  Grid3X3, 
  List, 
  Search, 
  Download, 
  Share2, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Eye, 
  Clock, 
  MapPin, 
  Smile, 
  TrendingUp, 
  Award, 
  Zap, 
  Star, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink, 
  BarChart3, 
  Target, 
  Flame, 
  Trophy, 
  Users, 
  Lock, 
  Globe, 
  Settings, 
  Folder, 
  Archive, 
  RefreshCw,
  Sparkles,
  Camera as CameraIcon,
  FileImage,
  FileVideo,
  Mic,
  FileText,
  Link,
  Hash,
  Calendar as CalendarIcon,
  Clock3,
  MapPin as LocationIcon
} from 'lucide-react';

import UploadArea from '@/components/UploadArea';
import Gallery from '@/components/Gallery';

const RecordsPage = () => {
  return (
    <Layout>
      <div className={'space-y-6'}>
        {/* Header */}
        <div className={'flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'}>
          <div>
            <h1 className={'text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'}>
              Registros de Evolução
            </h1>
            <p className={'text-muted-foreground mt-1'}>
              Documente sua jornada de transformação com fotos, vídeos e momentos especiais
            </p>
          </div>
          
          <div className={'flex items-center space-x-2'}>
            <Button variant={'outline'}>
              <Grid3X3 className={'h-4 w-4 mr-2'} />
              Grade
            </Button>
            <Button className={'gradient-primary text-white border-0'}>
              <Upload className={'h-4 w-4 mr-2'} />
              Novo Registro
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={'grid grid-cols-1 md:grid-cols-4 gap-4'}>
          <Card>
            <CardHeader className={'flex flex-row items-center justify-between space-y-0 pb-2'}>
              <CardTitle className={'text-sm font-medium'}>Total de Registros</CardTitle>
              <Camera className={'h-4 w-4 text-muted-foreground'} />
            </CardHeader>
            <CardContent>
              <div className={'text-2xl font-bold'}>247</div>
              <p className={'text-xs text-muted-foreground'}>+12 esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className={'flex flex-row items-center justify-between space-y-0 pb-2'}>
              <CardTitle className={'text-sm font-medium'}>Dias Registrados</CardTitle>
              <Calendar className={'h-4 w-4 text-muted-foreground'} />
            </CardHeader>
            <CardContent>
              <div className={'text-2xl font-bold'}>89</div>
              <p className={'text-xs text-muted-foreground'}>Sequência: 7 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className={'flex flex-row items-center justify-between space-y-0 pb-2'}>
              <CardTitle className={'text-sm font-medium'}>Marcos Visuais</CardTitle>
              <Trophy className={'h-4 w-4 text-muted-foreground'} />
            </CardHeader>
            <CardContent>
              <div className={'text-2xl font-bold'}>15</div>
              <p className={'text-xs text-muted-foreground'}>Transformações</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className={'flex flex-row items-center justify-between space-y-0 pb-2'}>
              <CardTitle className={'text-sm font-medium'}>Progresso Geral</CardTitle>
              <TrendingUp className={'h-4 w-4 text-muted-foreground'} />
            </CardHeader>
            <CardContent>
              <div className={'text-2xl font-bold'}>78%</div>
              <p className={'text-xs text-muted-foreground'}>Meta 2026</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className={'grid grid-cols-1 lg:grid-cols-3 gap-6'}>
          
          {/* Upload Section */}
          <Card className={'lg:col-span-2 hover:shadow-lg transition-shadow'}>
            <CardHeader>
              <CardTitle className={'flex items-center space-x-2'}>
                <Upload className={'h-5 w-5 text-blue-500'} />
                <span>Central de Upload</span>
                <Badge variant={'secondary'}>Múltiplos formatos</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className={'space-y-4'}>
              <UploadArea />
            </CardContent>
          </Card>

          {/* Gallery */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className={'h-5 w-5 text-purple-500'} />
                <span>Galeria</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Gallery />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className={'hover:shadow-lg transition-shadow'}>
            <CardHeader>
              <CardTitle className={'flex items-center space-x-2'}>
                <Zap className={'h-5 w-5 text-yellow-500'} />
                <span>Ações Rápidas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className={'space-y-3'}>
              <Button className={'w-full justify-start'} variant={'outline'}>
                <Camera className={'h-4 w-4 mr-2'} />
                Selfie de Progresso
              </Button>
              <Button className={'w-full justify-start'} variant={'outline'}>
                <Video className={'h-4 w-4 mr-2'} />
                Vídeo de Treino
              </Button>
              <Button className={'w-full justify-start'} variant={'outline'}>
                <FileImage className={'h-4 w-4 mr-2'} />
                Before & After
              </Button>
              <Button className={'w-full justify-start'} variant={'outline'}>
                <Sparkles className={'h-4 w-4 mr-2'} />
                Marco Especial
              </Button>
              <Button className={'w-full justify-start'} variant={'outline'}>
                <BarChart3 className={'h-4 w-4 mr-2'} />
                Progresso Mensal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Features */}
        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-6'}>
          
          {/* Smart Gallery */}
          <Card className={'hover:shadow-lg transition-shadow'}>
            <CardHeader>
              <CardTitle className={'flex items-center space-x-2'}>
                <Grid3X3 className={'h-5 w-5 text-purple-500'} />
                <span>Galeria Inteligente</span>
                <Badge variant={'secondary'}>IA Powered</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className={'space-y-4'}>
              <div className={'bg-muted/50 p-6 rounded-lg text-center space-y-4'}>
                <Grid3X3 className={'h-12 w-12 mx-auto text-purple-500 opacity-50'} />
                <div className={'space-y-2'}>
                  <h3 className={'text-lg font-semibold'}>Galeria com Inteligência Artificial</h3>
                  <p className={'text-sm text-muted-foreground leading-relaxed'}>
                    <strong>Funcionalidades da Galeria:</strong><br/>
                    • <strong>Organização Automática:</strong> IA categoriza por tipo (treino, alimentação, selfies, marcos)<br/>
                    • <strong>Timeline Inteligente:</strong> Visualização cronológica com marcos importantes destacados<br/>
                    • <strong>Busca Visual:</strong> Encontre fotos por conteúdo, cores, pessoas, objetos<br/>
                    • <strong>Álbuns Dinâmicos:</strong> Criação automática de álbuns por período, evento, progresso<br/>
                    • <strong>Comparações Visuais:</strong> Before/After automático com slider interativo<br/>
                    • <strong>Detecção de Progresso:</strong> IA identifica mudanças físicas ao longo do tempo<br/>
                    • <strong>Mosaicos Personalizados:</strong> Crie colagens automáticas de sua evolução<br/>
                    • <strong>Filtros Avançados:</strong> Por data, tipo, humor, localização, pessoas<br/>
                    • <strong>Modo Apresentação:</strong> Slideshow automático com música de fundo<br/>
                    • <strong>Compartilhamento Inteligente:</strong> Crie stories e posts otimizados para redes sociais<br/>
                    • <strong>Backup Inteligente:</strong> Sincronização automática com múltiplos serviços<br/>
                    • <strong>Reconhecimento Facial:</strong> Organize fotos por pessoas automaticamente
                  </p>
                </div>
              </div>
              <div className={'flex space-x-2'}>
                <Button className={'flex-1'} variant={'outline'}>
                  <Eye className={'h-4 w-4 mr-2'} />
                  Visualizar
                </Button>
                <Button className={'flex-1'} variant={'outline'}>
                  <Filter className={'h-4 w-4 mr-2'} />
                  Filtrar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Tracking */}
          <Card className={'hover:shadow-lg transition-shadow'}>
            <CardHeader>
              <CardTitle className={'flex items-center space-x-2'}>
                <TrendingUp className={'h-5 w-5 text-green-500'} />
                <span>Tracking de Progresso</span>
                <Badge variant={'secondary'}>Análise Visual</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className={'space-y-4'}>
              <div className={'bg-muted/50 p-6 rounded-lg text-center space-y-4'}>
                <TrendingUp className={'h-12 w-12 mx-auto text-green-500 opacity-50'} />
                <div className={'space-y-2'}>
                  <h3 className={'text-lg font-semibold'}>Análise Visual de Progresso</h3>
                  <p className={'text-sm text-muted-foreground leading-relaxed'}>
                    <strong>Funcionalidades de Análise:</strong><br/>
                    • <strong>Detecção de Mudanças:</strong> IA analisa diferenças físicas entre fotos ao longo do tempo<br/>
                    • <strong>Métricas Visuais:</strong> Gráficos de evolução baseados em análise de imagem<br/>
                    • <strong>Marcos Automáticos:</strong> Sistema detecta e celebra transformações significativas<br/>
                    • <strong>Comparações Temporais:</strong> Compare fotos de diferentes períodos lado a lado<br/>
                    • <strong>Análise de Postura:</strong> Acompanhe melhorias na postura corporal<br/>
                    • <strong>Tracking de Expressões:</strong> Monitore mudanças na confiança e felicidade<br/>
                    • <strong>Relatórios Visuais:</strong> Gere relatórios automáticos de sua evolução<br/>
                    • <strong>Predições IA:</strong> Projeções de como você pode estar no futuro<br/>
                    • <strong>Análise de Consistência:</strong> Identifique padrões em sua jornada<br/>
                    • <strong>Celebração de Conquistas:</strong> Destaque automaticamente momentos especiais<br/>
                    • <strong>Compartilhamento de Progresso:</strong> Crie posts motivacionais de sua evolução<br/>
                    • <strong>Insights Personalizados:</strong> Recomendações baseadas em sua jornada visual
                  </p>
                </div>
              </div>
              <div className={'flex space-x-2'}>
                <Button className={'flex-1'} variant={'outline'}>
                  <BarChart3 className={'h-4 w-4 mr-2'} />
                  Analisar
                </Button>
                <Button className={'flex-1'} variant={'outline'}>
                  <Award className={'h-4 w-4 mr-2'} />
                  Marcos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Features */}
          <Card className={'hover:shadow-lg transition-shadow'}>
            <CardHeader>
              <CardTitle className={'flex items-center space-x-2'}>
                <Share2 className={'h-5 w-5 text-blue-500'} />
                <span>Recursos Sociais</span>
                <Badge variant={'secondary'}>Comunidade</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className={'space-y-4'}>
              <div className={'bg-muted/50 p-6 rounded-lg text-center space-y-4'}>
                <Share2 className={'h-12 w-12 mx-auto text-blue-500 opacity-50'} />
                <div className={'space-y-2'}>
                  <h3 className={'text-lg font-semibold'}>Comunidade e Compartilhamento</h3>
                  <p className={'text-sm text-muted-foreground leading-relaxed'}>
                    <strong>Funcionalidades Sociais:</strong><br/>
                    • <strong>Comunidade Glow Up:</strong> Conecte-se com outros usuários em jornadas similares<br/>
                    • <strong>Compartilhamento Seletivo:</strong> Escolha o que compartilhar (público, amigos, privado)<br/>
                    • <strong>Sistema de Apoio:</strong> Receba e dê encorajamento para outros usuários<br/>
                    • <strong>Desafios Visuais:</strong> Participe de desafios de transformação em grupo<br/>
                    • <strong>Mentoria Visual:</strong> Conecte-se com mentores que já passaram por transformações<br/>
                    • <strong>Stories de Progresso:</strong> Crie stories automáticos de sua evolução<br/>
                    • <strong>Grupos Temáticos:</strong> Participe de grupos por interesse (fitness, skincare, estilo)<br/>
                    • <strong>Feedback Construtivo:</strong> Receba dicas e sugestões da comunidade<br/>
                    • <strong>Celebrações Coletivas:</strong> Comemore marcos com a comunidade<br/>
                    • <strong>Inspiração Diária:</strong> Veja transformações inspiradoras de outros usuários<br/>
                    • <strong>Parcerias de Accountability:</strong> Encontre parceiros para jornada conjunta<br/>
                    • <strong>Eventos Virtuais:</strong> Participe de eventos e workshops da comunidade
                  </p>
                </div>
              </div>
              <div className={'flex space-x-2'}>
                <Button className={'flex-1'} variant={'outline'}>
                  <Users className={'h-4 w-4 mr-2'} />
                  Comunidade
                </Button>
                <Button className={'flex-1'} variant={'outline'}>
                  <Heart className={'h-4 w-4 mr-2'} />
                  Inspirar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Features */}
          <Card className={'hover:shadow-lg transition-shadow'}>
            <CardHeader>
              <CardTitle className={'flex items-center space-x-2'}>
                <Settings className={'h-5 w-5 text-gray-500'} />
                <span>Recursos Avançados</span>
                <Badge variant={'secondary'}>Pro Features</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className={'space-y-4'}>
              <div className={'bg-muted/50 p-6 rounded-lg text-center space-y-4'}>
                <Settings className={'h-12 w-12 mx-auto text-gray-500 opacity-50'} />
                <div className={'space-y-2'}>
                  <h3 className={'text-lg font-semibold'}>Funcionalidades Profissionais</h3>
                  <p className={'text-sm text-muted-foreground leading-relaxed'}>
                    <strong>Recursos Premium:</strong><br/>
                    • <strong>Edição Avançada:</strong> Filtros profissionais, ajustes de cor, recorte inteligente<br/>
                    • <strong>Timelapse Automático:</strong> Crie vídeos de transformação automaticamente<br/>
                    • <strong>Análise Corporal 3D:</strong> Medições precisas usando IA e câmera<br/>
                    • <strong>Realidade Aumentada:</strong> Visualize mudanças futuras em tempo real<br/>
                    • <strong>Exportação Profissional:</strong> Alta resolução, múltiplos formatos, marca d'água personalizada<br/>
                    • <strong>Backup Ilimitado:</strong> Armazenamento em nuvem sem limites<br/>
                    • <strong>Relatórios Detalhados:</strong> PDFs profissionais de sua jornada<br/>
                    • <strong>API de Integração:</strong> Conecte com outros apps de saúde e fitness<br/>
                    • <strong>Modo Profissional:</strong> Interface para coaches e personal trainers<br/>
                    • <strong>Análise Nutricional Visual:</strong> IA analisa pratos e calcula nutrientes<br/>
                    • <strong>Reconhecimento de Exercícios:</strong> Identifica exercícios em vídeos automaticamente<br/>
                    • <strong>Consultoria IA:</strong> Recomendações personalizadas baseadas em sua evolução visual
                  </p>
                </div>
              </div>
              <div className={'flex space-x-2'}>
                <Button className={'flex-1'} variant={'outline'}>
                  <Star className={'h-4 w-4 mr-2'} />
                  Upgrade
                </Button>
                <Button className={'flex-1'} variant={'outline'}>
                  <ExternalLink className={'h-4 w-4 mr-2'} />
                  Saiba Mais
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Organization */}
        <Card>
          <CardHeader>
            <CardTitle className={'flex items-center space-x-2'}>
              <Folder className={'h-5 w-5'} />
              <span>Organização de Conteúdo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={'bg-muted/50 p-6 rounded-lg text-center space-y-4'}>
              <Folder className={'h-12 w-12 mx-auto text-primary opacity-50'} />
              <div className={'space-y-2'}>
                <h3 className={'text-lg font-semibold'}>Sistema de Organização Inteligente</h3>
                <p className={'text-sm text-muted-foreground leading-relaxed'}>
                  <strong>Funcionalidades de Organização:</strong><br/>
                  • <strong>Tags Inteligentes:</strong> Sistema de tags automáticas e manuais (#treino, #alimentação, #selfie, #marco)<br/>
                  • <strong>Categorização Automática:</strong> IA organiza conteúdo por tipo, data, localização, pessoas<br/>
                  • <strong>Álbuns Dinâmicos:</strong> Criação automática de álbuns por mês, evento, tipo de progresso<br/>
                  • <strong>Busca Avançada:</strong> Encontre conteúdo por data, tag, tipo, humor, localização, texto<br/>
                  • <strong>Filtros Múltiplos:</strong> Combine filtros para encontrar exatamente o que procura<br/>
                  • <strong>Favoritos e Destaques:</strong> Marque conteúdo especial para acesso rápido<br/>
                  • <strong>Arquivamento Inteligente:</strong> Sistema de arquivamento automático por idade<br/>
                  • <strong>Duplicatas:</strong> Detecção e remoção automática de conteúdo duplicado<br/>
                  • <strong>Metadados Ricos:</strong> Informações detalhadas sobre cada arquivo (localização, dispositivo, configurações)<br/>
                  • <strong>Coleções Temáticas:</strong> Agrupe conteúdo por temas específicos (Glow Up 2026, Verão 2025)<br/>
                  • <strong>Linha do Tempo:</strong> Visualização cronológica interativa de sua jornada<br/>
                  • <strong>Estatísticas de Conteúdo:</strong> Análise de padrões de upload e tipos de conteúdo mais frequentes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-6'}>
          <Card>
            <CardHeader>
              <CardTitle className={'flex items-center space-x-2'}>
                <Lock className={'h-5 w-5 text-red-500'} />
                <span>Privacidade & Segurança</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={'space-y-4'}>
                <div className={'bg-muted/50 p-4 rounded-lg'}>
                  <h4 className={'font-semibold mb-2'}>Controles de Privacidade</h4>
                  <p className={'text-sm text-muted-foreground'}>
                    • Configurações granulares de privacidade por arquivo<br/>
                    • Criptografia end-to-end para conteúdo sensível<br/>
                    • Controle total sobre compartilhamento<br/>
                    • Backup seguro com múltiplas camadas de proteção<br/>
                    • Autenticação biométrica para acesso<br/>
                    • Logs de acesso e atividade detalhados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={'flex items-center space-x-2'}>
                <BarChart3 className={'h-5 w-5 text-blue-500'} />
                <span>Analytics & Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={'space-y-4'}>
                <div className={'bg-muted/50 p-4 rounded-lg'}>
                  <h4 className={'font-semibold mb-2'}>Análises Inteligentes</h4>
                  <p className={'text-sm text-muted-foreground'}>
                    • Relatórios automáticos de progresso visual<br/>
                    • Análise de padrões de comportamento<br/>
                    • Insights sobre consistência de registros<br/>
                    • Correlação entre registros e outros dados<br/>
                    • Previsões de tendências pessoais<br/>
                    • Recomendações baseadas em análise visual
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RecordsPage;