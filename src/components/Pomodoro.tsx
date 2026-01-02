import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RefreshCcw, Settings } from 'lucide-react';

interface PomodoroProps {
  focusMinutes?: number;
  breakMinutes?: number;
}

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const Pomodoro: React.FC<PomodoroProps> = ({ focusMinutes = 25, breakMinutes = 5 }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [remaining, setRemaining] = useState(focusMinutes * 60);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    // update remaining if durations changed via props
    setRemaining(mode === 'focus' ? focusMinutes * 60 : breakMinutes * 60);
  }, [focusMinutes, breakMinutes, mode]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          // switch mode
          const nextMode = mode === 'focus' ? 'break' : 'focus';
          setMode(nextMode);
          return nextMode === 'focus' ? focusMinutes * 60 : breakMinutes * 60;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, focusMinutes, breakMinutes]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setMode('focus');
    setRemaining(focusMinutes * 60);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-red-500" />
          <span>Pomodoro</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="text-4xl font-mono">{formatTime(remaining)}</div>
          <div className="text-sm text-muted-foreground">Modo: {mode === 'focus' ? 'Foco' : 'Pausa'}</div>
          <div className="flex items-center justify-center space-x-2 pt-4">
            {!isRunning ? (
              <Button onClick={start} className="flex items-center">
                <Play className="h-4 w-4 mr-2" /> Iniciar
              </Button>
            ) : (
              <Button onClick={pause} className="flex items-center">
                <Pause className="h-4 w-4 mr-2" /> Pausar
              </Button>
            )}
            <Button variant="outline" onClick={reset} className="flex items-center">
              <RefreshCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Pomodoro;