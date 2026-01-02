import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { storage } from '@/lib/storage';
import { Habit, HabitCompletion, DailyStats } from '@/types';
import { toast } from 'sonner';
import { 
  Calendar,
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Target, 
  TrendingUp,
  Sparkles,
  Edit3,
  Save,
  X
} from 'lucide-react';

const Index = () => {
  const [todayHabits, setTodayHabits] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [dailyMotivation, setDailyMotivation] = useState('');
  const [isEditingMotivation, setIsEditingMotivation] = useState(false);
  const [tempMotivation, setTempMotivation] = useState('');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayFormatted = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const habits = storage.getTodayHabits();
    const completions = storage.getHabitCompletions();
    const stats = calculateDailyStats(habits, completions);
    const settings = storage.getSettings();
    
    setTodayHabits(habits);
    setHabitCompletions(completions);
    setDailyStats(stats);
    setDailyMotivation(settings.dailyMotivation);
    setTempMotivation(settings.dailyMotivation);
  };

  const calculateDailyStats = (habits: Habit[], completions: HabitCompletion[]): DailyStats => {
    const totalHabits = habits.length;
    const completedHabits = completions.filter(c => c.status === 'completed').length;
    const totalPoints = habits.reduce((sum, habit) => sum + habit.weight, 0);
    const earnedPoints = completions
      .filter(c => c.status === 'completed')
      .reduce((sum, completion) => {
        const habit = habits.find(h => h.id === completion.habitId);
        return sum + (habit?.weight || 0);
      }, 0);
    
    return {
      date: todayStr,
      totalHabits,
      completedHabits,
      totalPoints,
      earnedPoints,
      percentage: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0,
    };
  };

  const toggleHabit = (habitId: string) => {
    const completion = habitCompletions.find(c => c.habitId === habitId);
    const newStatus = completion?.status === 'completed' ? 'not_completed' : 'completed';
    
    storage.completeHabit(habitId, newStatus);
    
    if (newStatus === 'completed') {
      toast.success('Hábito concluído! 🎉', {
        description: 'Parabéns por manter a consistência!'
      });
    }
    
    loadDashboardData();
  };

  const saveMotivation = () => {
    storage.updateSettings({ dailyMotivation: tempMotivation });
    setDailyMotivation(tempMotivation);
    setIsEditingMotivation(false);
    toast.success('Frase motivacional atualizada!');
  };

  const cancelEditMotivation = () => {
    setTempMotivation(dailyMotivation);
    setIsEditingMotivation(false);
  };

  const getHabitCompletion = (habitId: string) => {
    return habitCompletions.find(c => c.habitId === habitId);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      saude: 'bg-green-500',
      treino: 'bg-orange-500',
      estudo: 'bg-blue-500',
      estetica: 'bg-pink-500',
      disciplina: 'bg-purple-500',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      saude: 'Saúde',
      treino: 'Treino',
      estudo: 'Estudo',
      estetica: 'Estética',
      disciplina: 'Disciplina',
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm capitalize">{todayFormatted}</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Dashboard Diário
          </h1>
        </div>

        {/* Motivational Quote */}
        <Card className="gradient-glow border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <Sparkles className="h-5 w-5 text-white" />
                {isEditingMotivation ? (
                  <Input
                    value={tempMotivation}
                    onChange={(e) => setTempMotivation(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                    placeholder="Digite sua frase motivacional..."
                  />
                ) : (
                  <p className="text-white font-medium flex-1">{dailyMotivation}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {isEditingMotivation ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={saveMotivation}
                      className="text-white hover:bg-white/20"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelEditMotivation}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingMotivation(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hábitos Hoje</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dailyStats?.completedHabits || 0}/{dailyStats?.totalHabits || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {dailyStats?.percentage || 0}% concluído
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dailyStats?.earnedPoints || 0}/{dailyStats?.totalPoints || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Pontuação do dia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sequência</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...todayHabits.map(h => h.streak), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Maior streak
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desempenho</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dailyStats?.percentage || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Performance geral
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Progresso do Dia</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hábitos concluídos</span>
                <span>{dailyStats?.percentage || 0}%</span>
              </div>
              <Progress 
                value={dailyStats?.percentage || 0} 
                className="h-3"
              />
              {(dailyStats?.percentage || 0) >= 80 && (
                <p className="text-sm text-green-600 font-medium flex items-center space-x-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Excelente desempenho hoje! 🎉</span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Habits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Hábitos de Hoje</span>
              <Badge variant="outline">{todayHabits.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayHabits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum hábito configurado para hoje.</p>
                <p className="text-sm">Vá para a aba Hábitos para adicionar novos hábitos.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayHabits.map((habit) => {
                  const completion = getHabitCompletion(habit.id);
                  const isCompleted = completion?.status === 'completed';
                  
                  return (
                    <div
                      key={habit.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                        isCompleted 
                          ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                          : 'bg-background hover:bg-accent/50'
                      }`}
                    >
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleHabit(habit.id)}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${
                            isCompleted ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {habit.name}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getCategoryColor(habit.category)} text-white border-0`}
                          >
                            {getCategoryLabel(habit.category)}
                          </Badge>
                          {habit.isEssential && (
                            <Badge variant="destructive" className="text-xs">
                              Essencial
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                          {habit.time && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{habit.time}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Flame className="h-3 w-3" />
                            <span>{habit.streak} dias</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-3 w-3" />
                            <span>{habit.weight} pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
