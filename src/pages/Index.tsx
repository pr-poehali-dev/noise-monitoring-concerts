import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NoiseStandard {
  id: string;
  name: string;
  dayLimit: number;
  nightLimit: number;
  description: string;
  icon: string;
}

const noiseStandards: NoiseStandard[] = [
  {
    id: 'concert',
    name: 'Концерты и массовые мероприятия',
    dayLimit: 70,
    nightLimit: 55,
    description: 'Максимально допустимый уровень шума для концертных площадок и массовых мероприятий на открытом воздухе',
    icon: 'Music'
  },
  {
    id: 'construction',
    name: 'Строительные работы',
    dayLimit: 80,
    nightLimit: 0,
    description: 'Допустимый уровень шума при строительных работах (ночные работы запрещены)',
    icon: 'HardHat'
  },
  {
    id: 'transport',
    name: 'Транспортный шум',
    dayLimit: 65,
    nightLimit: 50,
    description: 'Предельно допустимые уровни шума от автомобильного и железнодорожного транспорта',
    icon: 'Car'
  },
  {
    id: 'restaurant',
    name: 'Рестораны и кафе',
    dayLimit: 60,
    nightLimit: 45,
    description: 'Нормы шума для заведений общественного питания с летними площадками',
    icon: 'Utensils'
  },
  {
    id: 'sport',
    name: 'Спортивные мероприятия',
    dayLimit: 75,
    nightLimit: 60,
    description: 'Допустимый уровень шума на открытых спортивных площадках и стадионах',
    icon: 'Trophy'
  }
];

const Index = () => {
  const [currentNoise, setCurrentNoise] = useState(45);
  const [selectedStandard, setSelectedStandard] = useState<NoiseStandard>(noiseStandards[0]);
  const [isDay, setIsDay] = useState(true);
  const [history, setHistory] = useState<number[]>([45, 47, 50, 48, 52, 55, 58, 60, 62, 58]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newValue = Math.max(30, Math.min(90, currentNoise + (Math.random() - 0.5) * 10));
      setCurrentNoise(Math.round(newValue));
      setHistory(prev => [...prev.slice(-29), Math.round(newValue)]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, currentNoise]);

  const currentLimit = isDay ? selectedStandard.dayLimit : selectedStandard.nightLimit;
  const exceedsLimit = currentNoise > currentLimit;
  const percentage = (currentNoise / 100) * 100;

  const getStatusColor = () => {
    if (exceedsLimit) return 'hsl(var(--destructive))';
    if (currentNoise > currentLimit * 0.8) return 'hsl(var(--warning))';
    return 'hsl(var(--success))';
  };

  const getStatusText = () => {
    if (exceedsLimit) return 'Превышение нормы';
    if (currentNoise > currentLimit * 0.8) return 'Приближается к норме';
    return 'В пределах нормы';
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Мониторинг уровня шума
          </h1>
          <p className="text-muted-foreground text-lg">
            Контроль соответствия норм шума от концертов и мероприятий для защиты жителей
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Текущий уровень шума</CardTitle>
                  <CardDescription>Измерение в реальном времени</CardDescription>
                </div>
                <button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isMonitoring
                      ? 'bg-destructive text-destructive-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {isMonitoring ? 'Остановить' : 'Начать измерение'}
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center py-8">
                <div className="relative">
                  <div
                    className="text-8xl font-bold tabular-nums"
                    style={{ color: getStatusColor() }}
                  >
                    {currentNoise}
                  </div>
                  <div className="absolute -right-8 top-4 text-3xl font-medium text-muted-foreground">
                    дБ
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Прогресс относительно нормы</span>
                  <span className="font-medium">{percentage.toFixed(0)}%</span>
                </div>
                <Progress value={percentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 дБ</span>
                  <span className="font-medium" style={{ color: getStatusColor() }}>
                    Норма: {currentLimit} дБ
                  </span>
                  <span>100 дБ</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Статус</div>
                  <Badge
                    variant={exceedsLimit ? 'destructive' : 'default'}
                    className="text-base py-1"
                    style={{
                      backgroundColor: getStatusColor(),
                      color: 'white'
                    }}
                  >
                    {getStatusText()}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Время суток</div>
                  <Select value={isDay ? 'day' : 'night'} onValueChange={(v) => setIsDay(v === 'day')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">День (7:00 - 23:00)</SelectItem>
                      <SelectItem value="night">Ночь (23:00 - 7:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">График изменения за последние 30 секунд</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-end gap-1">
                    {history.map((value, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t transition-all duration-300"
                        style={{
                          height: `${(value / 100) * 100}%`,
                          backgroundColor: value > currentLimit ? 'hsl(var(--destructive))' : 'hsl(var(--primary))',
                          opacity: 0.7 + (index / history.length) * 0.3
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Панель сравнения</CardTitle>
              <CardDescription>Выберите тип мероприятия</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={selectedStandard.id}
                onValueChange={(id) => {
                  const standard = noiseStandards.find(s => s.id === id);
                  if (standard) setSelectedStandard(standard);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {noiseStandards.map(standard => (
                    <SelectItem key={standard.id} value={standard.id}>
                      {standard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon name={selectedStandard.icon as any} className="text-primary" size={24} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">{selectedStandard.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedStandard.description}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Icon name="Sun" size={20} className="text-warning" />
                      <span className="font-medium">Дневная норма</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">{selectedStandard.dayLimit} дБ</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Icon name="Moon" size={20} className="text-accent" />
                      <span className="font-medium">Ночная норма</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {selectedStandard.nightLimit === 0 ? '—' : `${selectedStandard.nightLimit} дБ`}
                    </span>
                  </div>
                </div>

                {exceedsLimit && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <Icon name="AlertTriangle" className="text-destructive mt-1" size={20} />
                      <div className="space-y-1">
                        <div className="font-semibold text-destructive">Превышение нормы!</div>
                        <div className="text-sm text-muted-foreground">
                          Текущий уровень превышает допустимую норму на{' '}
                          <span className="font-bold">{currentNoise - currentLimit} дБ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="standards" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="standards">Справочник норм</TabsTrigger>
            <TabsTrigger value="info">Информация</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standards" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {noiseStandards.map((standard) => (
                <Card
                  key={standard.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedStandard.id === standard.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedStandard(standard)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon name={standard.icon as any} className="text-primary" size={24} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{standard.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{standard.description}</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        <Icon name="Sun" size={14} className="mr-1" />
                        {standard.dayLimit} дБ
                      </Badge>
                      <Badge variant="secondary">
                        <Icon name="Moon" size={14} className="mr-1" />
                        {standard.nightLimit === 0 ? 'Запрещено' : `${standard.nightLimit} дБ`}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>О системе измерения шума</CardTitle>
                <CardDescription>Как работает контроль соответствия норм</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon name="Info" size={18} className="text-primary" />
                    Что такое децибел (дБ)?
                  </h3>
                  <p className="text-sm text-muted-foreground pl-6">
                    Децибел — это единица измерения уровня звукового давления. Шкала логарифмическая:
                    увеличение на 10 дБ означает удвоение громкости звука.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon name="Scale" size={18} className="text-primary" />
                    Справочные значения
                  </h3>
                  <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                    <div>• 30 дБ — тихая библиотека</div>
                    <div>• 50 дБ — спокойный разговор</div>
                    <div>• 70 дБ — пылесос, шумная улица</div>
                    <div>• 85 дБ — интенсивный городской транспорт</div>
                    <div>• 100 дБ — мотоцикл, отбойный молоток</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon name="ShieldCheck" size={18} className="text-primary" />
                    Защита прав жителей
                  </h3>
                  <p className="text-sm text-muted-foreground pl-6">
                    Данное приложение помогает жителям контролировать соблюдение норм шума от концертов,
                    строительных работ и других мероприятий. При систематическом превышении норм можно
                    обратиться в Роспотребнадзор с официальной жалобой.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
