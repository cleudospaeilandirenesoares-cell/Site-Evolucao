import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DailyStats, MonthlyChart } from '@/types';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react';

interface ProgressChartProps {
  monthlyChart: MonthlyChart;
  isCurrentMonth?: boolean;
}

export function ProgressChart({ monthlyChart, isCurrentMonth = false }: ProgressChartProps) {
  const maxDaysInMonth = 31;
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 40;
  
  // Criar array de todos os dias do mês
  const year = parseInt(monthlyChart.month.split('-')[0]);
  const month = parseInt(monthlyChart.month.split('-')[1]);
  const daysInMonth = new Date(year, month, 0).getDate();
  
  const allDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${monthlyChart.month}-${String(day).padStart(2, '0')}`;
    const stats = monthlyChart.dailyStats.find(s => s.date === dateStr);
    return {
      day,
      date: dateStr,
      percentage: stats?.percentage || 0,
      hasData: !!stats,
    };
  });

  // Calcular pontos do gráfico
  const points = allDays.map((dayData, index) => {
    const x = padding + (index / (daysInMonth - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - (dayData.percentage / 100) * (chartHeight - 2 * padding);
    return { x, y, ...dayData };
  });

  // Criar path do gráfico
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  // Criar área preenchida
  const areaPath = `${pathData} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;

  // Obter cor baseada na performance
  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return '#22c55e'; // Verde
    if (percentage >= 60) return '#3b82f6'; // Azul
    if (percentage >= 40) return '#f59e0b'; // Amarelo
    return '#ef4444'; // Vermelho
  };

  const averagePerformance = monthlyChart.averagePerformance || 0;
  const chartColor = getPerformanceColor(averagePerformance);

  return (
    <Card className={isCurrentMonth ? 'border-primary/50 bg-primary/5' : ''}>
      <CardHeader>
        <div className={'flex items-center justify-between'}>
          <CardTitle className={'flex items-center space-x-2'}>
            <Calendar className={'h-5 w-5'} />
            <span>
              {new Date(monthlyChart.month + '-01').toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </span>
            {isCurrentMonth && (
              <Badge variant={'default'} className={'gradient-primary text-white border-0'}>
                Mês Atual
              </Badge>
            )}
          </CardTitle>
          <div className={'text-right'}>
            <div className={'text-2xl font-bold'} style={{ color: chartColor }}>
              {averagePerformance}%
            </div>
            <div className={'text-xs text-muted-foreground'}>
              Performance média
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Gráfico SVG */}
        <div className={'mb-4'}>
          <svg width={chartWidth} height={chartHeight} className={'w-full h-auto border rounded-lg bg-background'}>
            {/* Grid lines */}
            <defs>
              <pattern id={'grid'} width={'40'} height={'40'} patternUnits={'userSpaceOnUse'}>
                <path d={'M 40 0 L 0 0 0 40'} fill={'none'} stroke={'#e5e7eb'} strokeWidth={'1'} opacity={'0.3'} />
              </pattern>
              <linearGradient id={`gradient-${monthlyChart.month}`} x1={'0%'} y1={'0%'} x2={'0%'} y2={'100%'}>
                <stop offset={'0%'} stopColor={chartColor} stopOpacity={'0.3'} />
                <stop offset={'100%'} stopColor={chartColor} stopOpacity={'0.1'} />
              </linearGradient>
            </defs>
            
            <rect width={chartWidth} height={chartHeight} fill={'url(#grid)'} />
            
            {/* Linhas de referência */}
            {[25, 50, 75, 100].map(percentage => {
              const y = chartHeight - padding - (percentage / 100) * (chartHeight - 2 * padding);
              return (
                <g key={percentage}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke={'#d1d5db'}
                    strokeWidth={'1'}
                    strokeDasharray={'5,5'}
                    opacity={'0.5'}
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    fontSize={'12'}
                    fill={'#6b7280'}
                    textAnchor={'end'}
                  >
                    {percentage}%
                  </text>
                </g>
              );
            })}
            
            {/* Área preenchida */}
            {points.length > 1 && (
              <path
                d={areaPath}
                fill={`url(#gradient-${monthlyChart.month})`}
                stroke={'none'}
              />
            )}
            
            {/* Linha do gráfico */}
            {points.length > 1 && (
              <path
                d={pathData}
                fill={'none'}
                stroke={chartColor}
                strokeWidth={'3'}
                strokeLinecap={'round'}
                strokeLinejoin={'round'}
              />
            )}
            
            {/* Pontos */}
            {points.map((point, index) => (
              <g key={index}>
                {point.hasData && (
                  <>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={'4'}
                      fill={chartColor}
                      stroke={'white'}
                      strokeWidth={'2'}
                    />
                    <title>
                      Dia {point.day}: {point.percentage}%
                    </title>
                  </>
                )}
              </g>
            ))}
            
            {/* Eixo X - Dias */}
            <line
              x1={padding}
              y1={chartHeight - padding}
              x2={chartWidth - padding}
              y2={chartHeight - padding}
              stroke={'#374151'}
              strokeWidth={'2'}
            />
            
            {/* Labels dos dias (a cada 5 dias) */}
            {points.filter((_, index) => index % 5 === 0 || index === points.length - 1).map((point, index) => (
              <text
                key={index}
                x={point.x}
                y={chartHeight - padding + 20}
                fontSize={'12'}
                fill={'#6b7280'}
                textAnchor={'middle'}
              >
                {point.day}
              </text>
            ))}
          </svg>
        </div>

        {/* Estatísticas do mês */}
        <div className={'grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'}>
          <div className={'text-center'}>
            <div className={'font-bold text-lg'} style={{ color: chartColor }}>
              {monthlyChart.totalDays}
            </div>
            <div className={'text-muted-foreground'}>Dias registrados</div>
          </div>
          
          <div className={'text-center'}>
            <div className={'font-bold text-lg text-green-600'}>
              {monthlyChart.completedDays}
            </div>
            <div className={'text-muted-foreground'}>Dias produtivos</div>
          </div>
          
          <div className={'text-center'}>
            <div className={'font-bold text-lg'}>
              {monthlyChart.bestDay ? new Date(monthlyChart.bestDay + 'T00:00:00').getDate() : '-'}
            </div>
            <div className={'text-muted-foreground'}>Melhor dia</div>
          </div>
          
          <div className={'text-center'}>
            <div className={'font-bold text-lg'}>
              {monthlyChart.completedDays > 0 
                ? Math.round((monthlyChart.completedDays / monthlyChart.totalDays) * 100)
                : 0
              }%
            </div>
            <div className={'text-muted-foreground'}>Taxa de sucesso</div>
          </div>
        </div>

        {/* Insights */}
        {monthlyChart.totalDays > 0 && (
          <div className={'mt-4 p-3 bg-muted/30 rounded-lg'}>
            <div className={'flex items-center space-x-2 mb-2'}>
              <TrendingUp className={'h-4 w-4 text-primary'} />
              <span className={'font-medium text-sm'}>Insights do Mês</span>
            </div>
            <div className={'text-xs text-muted-foreground space-y-1'}>
              {averagePerformance >= 80 && (
                <p>🎉 Excelente consistência! Você manteve uma performance alta durante o mês.</p>
              )}
              {averagePerformance >= 60 && averagePerformance < 80 && (
                <p>👍 Boa performance! Continue assim para alcançar a excelência.</p>
              )}
              {averagePerformance >= 40 && averagePerformance < 60 && (
                <p>⚡ Performance moderada. Foque em manter a consistência diária.</p>
              )}
              {averagePerformance < 40 && (
                <p>💪 Há espaço para melhoria. Pequenos passos diários fazem grande diferença!</p>
              )}
              
              {monthlyChart.completedDays > 0 && (
                <p>
                  Você teve {monthlyChart.completedDays} dias produtivos de {monthlyChart.totalDays} registrados.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}