import {
  AppData, Habit, HabitCompletion, DailyStats, MonthlyChart, UserSettings,
  StudyData, RecordsData, ExtendedAppData, Flashcard, QuizResult, Book,
  VocabularyWord, Course, StudyNote, PomodoroSession, InspirationQuote,
  UploadedFile, PhotoGallery, ProgressComparison, CommunityPost
} from '@/types';

const STORAGE_KEY = 'glow-up-organizer-data';
const STORAGE_VERSION = '1.0.0';

// Dados padrão iniciais
const defaultSettings: UserSettings = {
  theme: 'system',
  soundEnabled: true,
  animationsEnabled: true,
  minimalMode: false,
  dailyMotivation: 'Hoje é um novo dia para evoluir! 💪',
  notifications: {
    habitReminders: true,
    workoutReminders: true,
    journalReminders: true,
  },
};

const defaultStudyData: StudyData = {
  flashcards: [],
  quizResults: [],
  books: [],
  vocabulary: [],
  courses: [],
  studyNotes: [],
  pomodoroSessions: [],
  quotes: [],
};

const defaultRecordsData: RecordsData = {
  uploadedFiles: [],
  galleries: [],
  progressComparisons: [],
  communityPosts: [],
};

const defaultData: ExtendedAppData = {
  habits: [],
  habitCompletions: [],
  monthlyCharts: [],
  workouts: [],
  bodyMeasurements: [],
  journalEntries: [],
  goals: [],
  settings: defaultSettings,
  lastUpdated: new Date().toISOString(),
  version: STORAGE_VERSION,
  study: defaultStudyData,
  records: defaultRecordsData,
};

// Utilitários de data
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDateTime = (date: Date): string => {
  return date.toISOString();
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

export const isToday = (dateString: string): boolean => {
  return dateString === formatDate(new Date());
};

export const getWeekDay = (dateString: string): number => {
  return parseDate(dateString).getDay();
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Gerenciamento de dados locais
export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private data: ExtendedAppData;

  private constructor() {
    this.data = this.loadData();
    this.setupMidnightReset();
  }

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  private loadData(): ExtendedAppData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migração de versão se necessário
        return { ...defaultData, ...parsed, version: STORAGE_VERSION };
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
    return { ...defaultData };
  }

  private saveData(): void {
    try {
      this.data.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }

  // Reset diário à meia-noite
  private setupMidnightReset(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.performMidnightReset();
      // Configurar reset diário
      setInterval(() => {
        this.performMidnightReset();
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  }

  private performMidnightReset(): void {
    const today = formatDate(new Date());
    const currentMonth = getCurrentMonth();

    // Ensure current month chart exists (important at month boundary)
    if (!this.data.monthlyCharts.find(c => c.month === currentMonth)) {
      this.data.monthlyCharts.push(this.createMonthlyChart(currentMonth));
    }

    // Atualizar estatísticas do dia anterior (these stats will be saved into the month of that day)
    this.updateDailyStats();

    this.saveData();
  }

  private updateDailyStats(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);
    
    const todayHabits = this.getTodayHabits(yesterdayStr);
    const completions = this.getHabitCompletions(yesterdayStr);
    
    const totalHabits = todayHabits.length;
    const completedHabits = completions.filter(c => c.status === 'completed').length;
    const totalPoints = todayHabits.reduce((sum, habit) => sum + habit.weight, 0);
    const earnedPoints = completions
      .filter(c => c.status === 'completed')
      .reduce((sum, completion) => {
        const habit = todayHabits.find(h => h.id === completion.habitId);
        return sum + (habit?.weight || 0);
      }, 0);
    
    const stats: DailyStats = {
      date: yesterdayStr,
      totalHabits,
      completedHabits,
      totalPoints,
      earnedPoints,
      percentage: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0,
    };
    
    // Adicionar às estatísticas do mês do dia (yesterday), não necessariamente do mês atual
    const targetMonth = yesterdayStr.substring(0, 7); // YYYY-MM of yesterday
    let monthlyChart = this.data.monthlyCharts.find(chart => chart.month === targetMonth);
    
    if (!monthlyChart) {
      monthlyChart = this.createMonthlyChart(targetMonth);
      this.data.monthlyCharts.push(monthlyChart);
    }
    
    // Remover estatística existente do dia e adicionar a nova
    monthlyChart.dailyStats = monthlyChart.dailyStats.filter(s => s.date !== yesterdayStr);
    monthlyChart.dailyStats.push(stats);
    monthlyChart.dailyStats.sort((a, b) => a.date.localeCompare(b.date));
    
    this.updateMonthlyChartSummary(monthlyChart);
  }

  private createNewMonthlyChart(): void {
    const currentMonth = getCurrentMonth();
    const newChart = this.createMonthlyChart(currentMonth);
    this.data.monthlyCharts.push(newChart);
  }

  private createMonthlyChart(month: string): MonthlyChart {
    return {
      month,
      dailyStats: [],
      averagePerformance: 0,
      bestDay: '',
      worstDay: '',
      totalDays: 0,
      completedDays: 0,
    };
  }

  private updateMonthlyChartSummary(chart: MonthlyChart): void {
    const stats = chart.dailyStats;
    if (stats.length === 0) return;
    
    chart.totalDays = stats.length;
    chart.completedDays = stats.filter(s => s.percentage >= 80).length;
    chart.averagePerformance = Math.round(
      stats.reduce((sum, s) => sum + s.percentage, 0) / stats.length
    );
    
    const sortedByPerformance = [...stats].sort((a, b) => b.percentage - a.percentage);
    chart.bestDay = sortedByPerformance[0]?.date || '';
    chart.worstDay = sortedByPerformance[sortedByPerformance.length - 1]?.date || '';
  }

  // Métodos públicos para gerenciar dados
  public getData(): ExtendedAppData {
    return { ...this.data };
  }

  public exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      this.data = { ...defaultData, ...imported, version: STORAGE_VERSION };

      // Deep-merge nested study section to ensure missing arrays fall back to defaults
      if (imported.study) {
        this.data.study = { ...defaultStudyData, ...imported.study };
      }

      this.saveData();
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }

  // Métodos para hábitos
  public getHabits(): Habit[] {
    return [...this.data.habits];
  }

  public addHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'streak'>): Habit {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: formatDateTime(new Date()),
      streak: 0,
    };
    
    this.data.habits.push(newHabit);
    this.saveData();
    return newHabit;
  }

  public updateHabit(id: string, updates: Partial<Habit>): boolean {
    const index = this.data.habits.findIndex(h => h.id === id);
    if (index === -1) return false;
    
    this.data.habits[index] = { ...this.data.habits[index], ...updates };
    this.saveData();
    return true;
  }

  public deleteHabit(id: string): boolean {
    const index = this.data.habits.findIndex(h => h.id === id);
    if (index === -1) return false;
    
    this.data.habits.splice(index, 1);
    // Remover completions relacionados
    this.data.habitCompletions = this.data.habitCompletions.filter(c => c.habitId !== id);
    this.saveData();
    return true;
  }

  public getTodayHabits(date?: string): Habit[] {
    const targetDate = date || formatDate(new Date());
    const weekDay = getWeekDay(targetDate);
    
    return this.data.habits.filter(habit => 
      habit.daysOfWeek.includes(weekDay)
    );
  }

  // Métodos para completions de hábitos
  public getHabitCompletions(date?: string): HabitCompletion[] {
    const targetDate = date || formatDate(new Date());
    return this.data.habitCompletions.filter(c => c.date === targetDate);
  }

  public completeHabit(habitId: string, status: HabitCompletion['status'], justification?: string): boolean {
    const today = formatDate(new Date());
    const existingIndex = this.data.habitCompletions.findIndex(
      c => c.habitId === habitId && c.date === today
    );
    
    const completion: HabitCompletion = {
      id: existingIndex >= 0 ? this.data.habitCompletions[existingIndex].id : crypto.randomUUID(),
      habitId,
      date: today,
      status,
      justification,
      completedAt: status === 'completed' ? formatDateTime(new Date()) : undefined,
    };
    
    if (existingIndex >= 0) {
      this.data.habitCompletions[existingIndex] = completion;
    } else {
      this.data.habitCompletions.push(completion);
    }
    
    // Atualizar streak
    this.updateHabitStreak(habitId);
    this.saveData();
    return true;
  }

  private updateHabitStreak(habitId: string): void {
    const habit = this.data.habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const completions = this.data.habitCompletions
      .filter(c => c.habitId === habitId)
      .sort((a, b) => b.date.localeCompare(a.date));
    
    let streak = 0;
    const today = formatDate(new Date());
    
    for (let i = 0; i < completions.length; i++) {
      const completion = completions[i];
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = formatDate(expectedDate);
      
      if (completion.date !== expectedDateStr) break;
      
      if (completion.status === 'completed' || completion.status === 'justified') {
        streak++;
      } else {
        break;
      }
    }
    
    habit.streak = streak;
    if (completions.length > 0 && completions[0].status === 'completed') {
      habit.lastCompleted = completions[0].date;
    }
  }

  // Métodos para estatísticas
  public getDailyStats(date?: string): DailyStats | null {
    const targetDate = date || formatDate(new Date());
    const currentMonth = targetDate.substring(0, 7); // YYYY-MM
    
    const monthlyChart = this.data.monthlyCharts.find(chart => chart.month === currentMonth);
    return monthlyChart?.dailyStats.find(stats => stats.date === targetDate) || null;
  }

  public getMonthlyChart(month?: string): MonthlyChart | null {
    const targetMonth = month || getCurrentMonth();
    return this.data.monthlyCharts.find(chart => chart.month === targetMonth) || null;
  }

  public getAllMonthlyCharts(): MonthlyChart[] {
    return [...this.data.monthlyCharts].sort((a, b) => b.month.localeCompare(a.month));
  }

  // Métodos para Body Measurements
  public getBodyMeasurements(): BodyMeasurement[] {
    return [...this.data.bodyMeasurements];
  }

  public addBodyMeasurement(measurement: Omit<BodyMeasurement, 'id' | 'createdAt' | 'updatedAt'>): BodyMeasurement {
    const now = formatDateTime(new Date());
    const newMeasurement: BodyMeasurement = {
      ...measurement,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.data.bodyMeasurements = this.data.bodyMeasurements || [];
    this.data.bodyMeasurements.push(newMeasurement);
    this.saveData();
    return newMeasurement;
  }

  public updateBodyMeasurement(id: string, updates: Partial<BodyMeasurement>): boolean {
    const index = this.data.bodyMeasurements.findIndex(m => m.id === id);
    if (index === -1) return false;

    this.data.bodyMeasurements[index] = { ...this.data.bodyMeasurements[index], ...updates, updatedAt: formatDateTime(new Date()) };
    this.saveData();
    return true;
  }

  public deleteBodyMeasurement(id: string): boolean {
    const index = this.data.bodyMeasurements.findIndex(m => m.id === id);
    if (index === -1) return false;

    this.data.bodyMeasurements.splice(index, 1);
    this.saveData();
    return true;
  }

  // Métodos para configurações
  public getSettings(): UserSettings {
    return { ...this.data.settings };
  }

  public updateSettings(updates: Partial<UserSettings>): void {
    this.data.settings = { ...this.data.settings, ...updates };
    this.saveData();
  }

  // Métodos para funcionalidades de estudo
  public getFlashcards(): Flashcard[] {
    return [...this.data.study.flashcards];
  }

  public getDueFlashcards(date?: string): Flashcard[] {
    const target = date || formatDate(new Date());
    return this.data.study.flashcards.filter(f => {
      if (!f.nextReview) return true;
      return f.nextReview <= target;
    });
  }

  public addFlashcard(flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'lastReviewed' | 'nextReview' | 'interval' | 'ease' | 'streak'>): Flashcard {
    const now = formatDateTime(new Date());
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: crypto.randomUUID(),
      createdAt: now,
      lastReviewed: now,
      nextReview: formatDate(new Date()),
      interval: 1,
      ease: 2.5,
      streak: 0,
    };
    
    this.data.study.flashcards.push(newFlashcard);
    this.saveData();
    return newFlashcard;
  }

  public updateFlashcard(id: string, updates: Partial<Flashcard>): boolean {
    const index = this.data.study.flashcards.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    this.data.study.flashcards[index] = { ...this.data.study.flashcards[index], ...updates };
    this.saveData();
    return true;
  }

  public scheduleReviewResult(id: string, result: 'again' | 'hard' | 'good' | 'easy'): boolean {
    const index = this.data.study.flashcards.findIndex(f => f.id === id);
    if (index === -1) return false;

    const card = this.data.study.flashcards[index];
    const now = new Date();

    let interval = card.interval || 1;
    let ease = card.ease || 2.5;
    let streak = card.streak || 0;

    switch (result) {
      case 'again':
        interval = 1;
        ease = Math.max(1.3, (ease || 2.5) - 0.25);
        streak = 0;
        break;
      case 'hard':
        interval = Math.max(1, Math.floor((card.interval || 1) * 1.2));
        ease = Math.max(1.3, (ease || 2.5) - 0.15);
        streak = 0;
        break;
      case 'good':
        interval = Math.max(1, Math.floor((card.interval || 1) * (ease || 2.5)));
        // ease unchanged
        streak = (streak || 0) + 1;
        break;
      case 'easy':
        interval = Math.max(1, Math.floor((card.interval || 1) * (ease || 2.5) * 2.5));
        ease = Math.min(4.0, (ease || 2.5) + 0.15);
        streak = (streak || 0) + 1;
        break;
    }

    const nextReview = new Date(now);
    nextReview.setDate(nextReview.getDate() + interval);

    card.lastReviewed = now.toISOString();
    card.nextReview = nextReview.toISOString().split('T')[0];
    card.interval = interval;
    card.ease = ease;
    card.streak = streak;

    this.data.study.flashcards[index] = card;
    this.saveData();
    return true;
  }

  public getBooks(): Book[] {
    return [...this.data.study.books];
  }

  public addBook(book: Omit<Book, 'id'>): Book {
    const newBook: Book = {
      ...book,
      id: crypto.randomUUID(),
    };
    
    this.data.study.books.push(newBook);
    this.saveData();
    return newBook;
  }

  public updateBook(id: string, updates: Partial<Book>): boolean {
    const index = this.data.study.books.findIndex(b => b.id === id);
    if (index === -1) return false;
    
    this.data.study.books[index] = { ...this.data.study.books[index], ...updates };
    this.saveData();
    return true;
  }

  public deleteBook(id: string): boolean {
    const index = this.data.study.books.findIndex(b => b.id === id);
    if (index === -1) return false;

    this.data.study.books.splice(index, 1);
    this.saveData();
    return true;
  }

  // Métodos para Quiz (perguntas e resultados)
  public getQuizQuestions(): QuizQuestion[] {
    return [...(this.data.study.quizQuestions || [])];
  }

  public addQuizQuestion(question: Omit<QuizQuestion, 'id' | 'createdAt'>): QuizQuestion {
    const now = formatDateTime(new Date());
    const newQuestion: QuizQuestion = {
      ...question,
      id: crypto.randomUUID(),
      createdAt: now,
    };

    // ensure array exists
    (this.data.study as any).quizQuestions = this.data.study?.quizQuestions || [];
    (this.data.study as any).quizQuestions.push(newQuestion);
    this.saveData();
    return newQuestion;
  }

  public updateQuizQuestion(id: string, updates: Partial<QuizQuestion>): boolean {
    const arr = (this.data.study as any).quizQuestions || [];
    const index = arr.findIndex((q: QuizQuestion) => q.id === id);
    if (index === -1) return false;
    arr[index] = { ...arr[index], ...updates };
    this.saveData();
    return true;
  }

  public deleteQuizQuestion(id: string): boolean {
    const arr = (this.data.study as any).quizQuestions || [];
    const index = arr.findIndex((q: QuizQuestion) => q.id === id);
    if (index === -1) return false;
    arr.splice(index, 1);
    this.saveData();
    return true;
  }

  public getQuizResults(): QuizResult[] {
    return [...(this.data.study.quizResults || [])];
  }

  public addQuizResult(result: Omit<QuizResult, 'id' | 'date'>): QuizResult {
    const newResult: QuizResult = {
      ...result,
      id: crypto.randomUUID(),
      date: formatDate(new Date()),
    };

    this.data.study.quizResults.push(newResult);
    this.saveData();
    return newResult;
  }

  /**
   * Return aggregated quiz statistics:
   * - totalAttempts
   * - averageScore (0-100)
   * - bestScore
   * - lastAttempt (YYYY-MM-DD or null)
   * - byCategory: { [category]: { attempts, averageScore } }
   */
  public getQuizStats() {
    const results = this.data.study.quizResults || [];
    const totalAttempts = results.length;

    if (totalAttempts === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        lastAttempt: null,
        byCategory: {},
      };
    }

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = Math.round((totalScore / totalAttempts) * 10) / 10;
    const bestScore = Math.max(...results.map(r => r.score));
    const lastAttempt = results.slice(-1)[0].date || null;

    const byCategory: Record<string, { attempts: number; averageScore: number }> = {};

    results.forEach(r => {
      const cat = r.category || 'general';
      byCategory[cat] = byCategory[cat] || { attempts: 0, averageScore: 0 };
      byCategory[cat].attempts += 1;
      byCategory[cat].averageScore += r.score;
    });

    Object.keys(byCategory).forEach(cat => {
      const info = byCategory[cat];
      info.averageScore = Math.round((info.averageScore / info.attempts) * 10) / 10;
    });

    return {
      totalAttempts,
      averageScore,
      bestScore,
      lastAttempt,
      byCategory,
    };
  }

  // Pomodoro sessions
  public getPomodoroSessions(): PomodoroSession[] {
    return [...(this.data.study.pomodoroSessions || [])];
  }

  public addPomodoroSession(session: Omit<PomodoroSession, 'id' | 'date'>): PomodoroSession {
    const newSession: PomodoroSession = {
      ...session,
      id: crypto.randomUUID(),
      date: formatDate(new Date()),
    };
    this.data.study.pomodoroSessions.push(newSession);
    this.saveData();
    return newSession;
  }

  public getCourses(): Course[] {
    return [...this.data.study.courses];
  }

  public addCourse(course: Omit<Course, 'id'>): Course {
    const newCourse: Course = {
      ...course,
      id: crypto.randomUUID(),
    };
    
    this.data.study.courses.push(newCourse);
    this.saveData();
    return newCourse;
  }

  public updateCourse(id: string, updates: Partial<Course>): boolean {
    const index = this.data.study.courses.findIndex(c => c.id === id);

    if (index >= 0 && this.data.study.courses) {
      this.data.study.courses[index] = { ...this.data.study.courses[index], ...updates };
      this.saveData();
      return true;
    }

    return false;
  }

  // Vocabulary management
  public getVocabulary(): VocabularyWord[] {
    return [...(this.data.study.vocabulary || [])];
  }

  public addVocabularyWord(word: Omit<VocabularyWord, 'id' | 'createdAt' | 'lastReviewed' | 'reviewCount' | 'nextReviewAt' | 'intervalDays'>): VocabularyWord {
    const now = formatDateTime(new Date());
    const newWord: VocabularyWord = {
      ...word,
      id: crypto.randomUUID(),
      createdAt: now,
      lastReviewed: '',
      reviewCount: 0,
      intervalDays: 1,
      nextReviewAt: now, // due immediately
    } as VocabularyWord;

    this.data.study.vocabulary = this.data.study.vocabulary || [];
    this.data.study.vocabulary.push(newWord);
    this.saveData();
    return newWord;
  }

  public updateVocabularyWord(id: string, updates: Partial<VocabularyWord>): boolean {
    const arr = this.data.study.vocabulary || [];
    const index = arr.findIndex((w: VocabularyWord) => w.id === id);
    if (index === -1) return false;
    arr[index] = { ...arr[index], ...updates };
    this.saveData();
    return true;
  }

  public deleteVocabularyWord(id: string): boolean {
    this.data.study.vocabulary = (this.data.study.vocabulary || []).filter(w => w.id !== id);
    this.saveData();
    return true;
  }

  public markVocabularyReviewed(id: string, success = true): boolean {
    const arr = this.data.study.vocabulary || [];
    const index = arr.findIndex((w: VocabularyWord) => w.id === id);
    if (index === -1) return false;

    const now = new Date();
    const nowDateStr = formatDate(now);

    arr[index].lastReviewed = nowDateStr;
    arr[index].reviewCount = (arr[index].reviewCount || 0) + 1;

    const prevInterval = arr[index].intervalDays || 1;

    if (success) {
      // simple doubling schedule (1,2,4,8...)
      arr[index].intervalDays = Math.max(1, Math.round(prevInterval * 2));
    } else {
      // reset interval on failure
      arr[index].intervalDays = 1;
    }

    arr[index].nextReviewAt = formatDateTime(new Date(now.getTime() + (arr[index].intervalDays || 1) * 24 * 60 * 60 * 1000));

    this.saveData();
    return true;
  }

  public getDueVocabulary(referenceDate?: Date): VocabularyWord[] {
    const now = referenceDate || new Date();
    return (this.data.study.vocabulary || []).filter(w => {
      if (!w.nextReviewAt) return true;
      return new Date(w.nextReviewAt).getTime() <= now.getTime();
    });
  }

  public getDueVocabularyCount(): number {
    return this.getDueVocabulary().length;
  }

  // Métodos para funcionalidades de registros
  public getUploadedFiles(): UploadedFile[] {
    return [...this.data.records.uploadedFiles];
  }

  public addUploadedFile(file: Omit<UploadedFile, 'id' | 'uploadDate'>): UploadedFile {
    const newFile: UploadedFile = {
      ...file,
      id: crypto.randomUUID(),
      uploadDate: formatDateTime(new Date()),
    };
    
    this.data.records.uploadedFiles.push(newFile);
    this.saveData();
    return newFile;
  }

  public deleteUploadedFile(id: string): boolean {
    const index = this.data.records.uploadedFiles.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    this.data.records.uploadedFiles.splice(index, 1);
    this.saveData();
    return true;
  }

  public getGalleries(): PhotoGallery[] {
    return [...this.data.records.galleries];
  }

  public addGallery(gallery: Omit<PhotoGallery, 'id' | 'createdAt' | 'updatedAt'>): PhotoGallery {
    const now = formatDateTime(new Date());
    const newGallery: PhotoGallery = {
      ...gallery,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    this.data.records.galleries.push(newGallery);
    this.saveData();
    return newGallery;
  }

  // Métodos para Journal
  public getJournalEntries(): JournalEntry[] {
    return [...this.data.journalEntries];
  }

  public addJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): JournalEntry {
    const now = formatDateTime(new Date());
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.data.journalEntries = this.data.journalEntries || [];
    this.data.journalEntries.push(newEntry);
    this.saveData();
    return newEntry;
  }

  public updateJournalEntry(id: string, updates: Partial<JournalEntry>): boolean {
    const index = this.data.journalEntries.findIndex(e => e.id === id);
    if (index === -1) return false;

    this.data.journalEntries[index] = {
      ...this.data.journalEntries[index],
      ...updates,
      updatedAt: formatDateTime(new Date()),
    };
    this.saveData();
    return true;
  }

  public deleteJournalEntry(id: string): boolean {
    const index = this.data.journalEntries.findIndex(e => e.id === id);
    if (index === -1) return false;

    this.data.journalEntries.splice(index, 1);
    this.saveData();
    return true;
  }
}

// Instância singleton
export const storage = LocalStorageManager.getInstance();