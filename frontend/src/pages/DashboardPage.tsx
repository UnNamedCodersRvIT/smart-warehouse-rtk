import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  alpha,
  useTheme,
  LinearProgress,
  Tooltip
} from "@mui/material";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  PlayArrow,
  Pause,
  Refresh,
  Battery20,
  Battery50,
  Battery80,
  BatteryFull,
  Warning,
  Error as ErrorIcon,
  CheckCircle,
  TrendingUp,
  Analytics,
  Wifi,
  WifiOff,
  Cable,
  Dashboard as DashboardIcon,
  Map,
  Inventory,
  SmartToy
} from "@mui/icons-material";

// Типы данных
interface Robot {
  id: string;
  x: number;
  y: number;
  battery: number;
  status: 'active' | 'low_battery' | 'offline';
  lastUpdate: string;
  currentZone: string;
}

interface ScanRecord {
  id: string;
  timestamp: string;
  robotId: string;
  zone: string;
  productName: string;
  productId: string;
  quantity: number;
  status: 'OK' | 'LOW_STOCK' | 'CRITICAL';
}

interface Prediction {
  id: string;
  productName: string;
  currentStock: number;
  predictedDepletion: string;
  recommendedOrder: number;
  confidence: number;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [isPaused, setIsPaused] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());

  // Моковые данные
  const robots: Robot[] = [
    { id: 'RB-001', x: 15, y: 8, battery: 85, status: 'active', lastUpdate: '2 мин назад', currentZone: 'B3' },
    { id: 'RB-002', x: 32, y: 15, battery: 45, status: 'low_battery', lastUpdate: '5 мин назад', currentZone: 'D7' },
    { id: 'RB-003', x: 8, y: 25, battery: 92, status: 'active', lastUpdate: '1 мин назад', currentZone: 'A12' },
    { id: 'RB-004', x: 42, y: 35, battery: 0, status: 'offline', lastUpdate: '15 мин назад', currentZone: 'F9' },
    { id: 'RB-005', x: 25, y: 42, battery: 78, status: 'active', lastUpdate: '3 мин назад', currentZone: 'C15' },
  ];

  const recentScans: ScanRecord[] = [
    { id: '1', timestamp: '14:23:45', robotId: 'RB-001', zone: 'B3', productName: 'Роутер RT-AC68U', productId: 'TEL-4567', quantity: 45, status: 'LOW_STOCK' },
    { id: '2', timestamp: '14:22:30', robotId: 'RB-003', zone: 'A12', productName: 'Коммутатор SG-2000', productId: 'TEL-1234', quantity: 100, status: 'OK' },
    { id: '3', timestamp: '14:21:15', robotId: 'RB-002', zone: 'D7', productName: 'Модем DSL-2640U', productId: 'TEL-8901', quantity: 12, status: 'CRITICAL' },
    { id: '4', timestamp: '14:20:50', robotId: 'RB-005', zone: 'C15', productName: 'Точка доступа AC1200', productId: 'TEL-5678', quantity: 28, status: 'LOW_STOCK' },
    { id: '5', timestamp: '14:19:35', robotId: 'RB-001', zone: 'B2', productName: 'Маршрутизатор промышленный', productId: 'TEL-9012', quantity: 8, status: 'OK' },
  ];

  const predictions: Prediction[] = [
    { id: '1', productName: 'Модем DSL-2640U', currentStock: 12, predictedDepletion: '2024-03-18', recommendedOrder: 50, confidence: 92 },
    { id: '2', productName: 'Точка доступа AC1200', currentStock: 28, predictedDepletion: '2024-03-20', recommendedOrder: 30, confidence: 85 },
    { id: '3', productName: 'Роутер RT-AC68U', currentStock: 45, predictedDepletion: '2024-03-22', recommendedOrder: 25, confidence: 78 },
    { id: '4', productName: 'Кабель Ethernet 5м', currentStock: 15, predictedDepletion: '2024-03-19', recommendedOrder: 100, confidence: 95 },
    { id: '5', productName: 'Коммутатор 24 порта', currentStock: 5, predictedDepletion: '2024-03-17', recommendedOrder: 10, confidence: 88 },
  ];

  // Статистика
  const stats = {
    activeRobots: robots.filter(r => r.status === 'active').length,
    totalRobots: robots.length,
    scannedToday: 1247,
    criticalItems: 23,
    avgBattery: Math.round(robots.reduce((acc, r) => acc + r.battery, 0) / robots.length)
  };

  useEffect(() => {
    document.title = "Текущий мониторинг | Умный склад";
    
    // Имитация WebSocket соединения
    const interval = setInterval(() => {
      if (!isPaused) {
        setLastUpdate(new Date().toLocaleTimeString());
        if (Math.random() > 0.8) {
          const statuses: typeof connectionStatus[] = ['connected', 'disconnected', 'reconnecting'];
          setConnectionStatus(statuses[Math.floor(Math.random() * statuses.length)]);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleLogout = () => {
    console.log("Выход из системы");
    logout();
  };

  const handleTabChange = (tab: "monitoring" | "history") => {
    if (tab === "history") {
      navigate("/history");
    }
  };

  const handleCsvUpload = () => {
    console.log("Загрузка CSV файла");
  };

  const getBatteryIcon = (level: number) => {
    if (level >= 80) return <BatteryFull sx={{ color: '#4caf50' }} />;
    if (level >= 50) return <Battery80 sx={{ color: '#8bc34a' }} />;
    if (level >= 20) return <Battery50 sx={{ color: '#ff9800' }} />;
    return <Battery20 sx={{ color: '#f44336' }} />;
  };

  const getRobotColor = (robot: Robot) => {
    switch (robot.status) {
      case 'active': return '#4caf50';
      case 'low_battery': return '#ff9800';
      case 'offline': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OK': return <CheckCircle sx={{ color: '#4caf50', fontSize: 16 }} />;
      case 'LOW_STOCK': return <Warning sx={{ color: '#ff9800', fontSize: 16 }} />;
      case 'CRITICAL': return <ErrorIcon sx={{ color: '#f44336', fontSize: 16 }} />;
      default: return <CheckCircle sx={{ color: '#9e9e9e', fontSize: 16 }} />;
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi sx={{ color: '#4caf50' }} />;
      case 'disconnected': return <WifiOff sx={{ color: '#f44336' }} />;
      case 'reconnecting': return <Cable sx={{ color: '#ff9800' }} />;
    }
  };

  const userInfo = {
    name: user?.name || "Иван Иванов",
    role: user?.role || "Администратор"
  };

  // Градиенты для карточек
  const cardGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "grey.50",
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <Header 
        userInfo={userInfo} 
        onLogout={handleLogout} 
      />
      <Navigation 
        activeTab="monitoring" 
        onTabChange={handleTabChange} 
        onCsvUpload={handleCsvUpload} 
      />
      
      <Box sx={{ p: 3 }}>
        {/* Заголовок с иконкой */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            mb: 2,
            boxShadow: '0 8px 32px rgba(67, 233, 123, 0.3)'
          }}>
            <DashboardIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Текущий мониторинг
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Режим реального времени • Автообновление каждые 5 секунд
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Блок 1: Карта склада */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ 
              p: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mr: 2
                }}>
                  <Map sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  Карта склада
                </Typography>
              </Box>

              {/* SVG карта склада */}
              <Box sx={{ 
                flex: 1, 
                background: 'linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                borderRadius: 2,
                position: 'relative',
                border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                height: 400
              }}>
                {/* Зоны склада */}
                {Array.from({ length: 6 }, (_, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'absolute',
                      left: `${i * 16.66}%`,
                      top: '10%',
                      width: '16.66%',
                      height: '80%',
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      background: alpha(['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'][i], 0.1),
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: theme.palette.primary.main,
                      fontSize: '14px'
                    }}
                  >
                    Зона {String.fromCharCode(65 + i)}
                  </Box>
                ))}

                {/* Роботы на карте */}
                {robots.map((robot) => (
                  <Tooltip
                    key={robot.id}
                    title={
                      <Box>
                        <Typography variant="subtitle2">{robot.id}</Typography>
                        <Typography variant="body2">Батарея: {robot.battery}%</Typography>
                        <Typography variant="body2">Зона: {robot.currentZone}</Typography>
                        <Typography variant="body2">Обновление: {robot.lastUpdate}</Typography>
                      </Box>
                    }
                    arrow
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        left: `${(robot.x / 50) * 100}%`,
                        top: `${(robot.y / 50) * 100}%`,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: getRobotColor(robot),
                        border: `2px solid white`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transform: 'translate(-50%, -50%)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translate(-50%, -50%) scale(1.2)'
                        }
                      }}
                    >
                      {robot.id.split('-')[1]}
                    </Box>
                  </Tooltip>
                ))}
              </Box>

              {/* Легенда карты */}
              <Box sx={{ display: 'flex', gap: 3, mt: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4caf50' }} />
                  <Typography variant="body2">Активные</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff9800' }} />
                  <Typography variant="body2">Низкий заряд</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f44336' }} />
                  <Typography variant="body2">Оффлайн</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Правая колонка */}
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3}>
              {/* Блок 2: Статистика */}
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        mr: 2
                      }}>
                        <TrendingUp sx={{ color: 'white' }} />
                      </Box>
                      <Typography variant="h5" fontWeight="bold">
                        Статистика в реальном времени
                      </Typography>
                    </Box>
                    <Chip 
                      label={`Обновлено: ${lastUpdate}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Grid container spacing={2}>
                    {[
                      { label: 'Активных роботов', value: `${stats.activeRobots}/${stats.totalRobots}`, icon: <SmartToy /> },
                      { label: 'Проверено сегодня', value: stats.scannedToday.toLocaleString(), icon: <Inventory /> },
                      { label: 'Критических остатков', value: stats.criticalItems.toString(), icon: <Warning /> },
                      { label: 'Средний заряд', value: `${stats.avgBattery}%`, icon: <Battery80 /> }
                    ].map((stat, index) => (
                      <Grid item xs={6} key={stat.label}>
                        <Card sx={{
                          background: cardGradients[index],
                          color: 'white',
                          borderRadius: 2,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                          }
                        }}>
                          <CardContent sx={{ p: 2, textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                              {stat.icon}
                            </Box>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                              {stat.value}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              {stat.label}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* График активности */}
                  <Box sx={{ mt: 3, p: 2, background: alpha(theme.palette.primary.main, 0.04), borderRadius: 2 }}>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Активность роботов (последний час)
                    </Typography>
                    <Box sx={{ height: 60, display: 'flex', alignItems: 'end', gap: 1 }}>
                      {Array.from({ length: 12 }, (_, i) => (
                        <Box
                          key={i}
                          sx={{
                            flex: 1,
                            height: `${20 + Math.random() * 80}%`,
                            background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 1,
                            minWidth: 4
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Блок 3: Последние сканирования */}
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        mr: 2
                      }}>
                        <Analytics sx={{ color: 'white' }} />
                      </Box>
                      <Typography variant="h5" fontWeight="bold">
                        Последние сканирования
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => setIsPaused(!isPaused)}
                      color={isPaused ? "primary" : "default"}
                      sx={{
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                      }}
                    >
                      {isPaused ? <PlayArrow /> : <Pause />}
                    </IconButton>
                  </Box>

                  <TableContainer sx={{ maxHeight: 200, borderRadius: 1 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}>
                          {['Время', 'Робот', 'Зона', 'Товар', 'Кол-во', 'Статус'].map((header) => (
                            <TableCell 
                              key={header}
                              sx={{ 
                                color: 'white', 
                                fontWeight: 'bold',
                                borderBottom: 'none'
                              }}
                            >
                              {header}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentScans.map((scan) => (
                          <TableRow 
                            key={scan.id} 
                            hover
                            sx={{ 
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                background: alpha(theme.palette.primary.main, 0.04)
                              }
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace" fontWeight="500">
                                {scan.timestamp}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={scan.robotId} 
                                size="small" 
                                variant="outlined"
                                sx={{ borderRadius: 1, fontWeight: '500' }}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {scan.zone}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Tooltip title={scan.productId}>
                                <Box>
                                  <Typography variant="body2" fontWeight="500" noWrap sx={{ maxWidth: 120 }}>
                                    {scan.productName}
                                  </Typography>
                                </Box>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="bold">
                                {scan.quantity}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {getStatusIcon(scan.status)}
                                <Typography variant="body2" fontWeight="500">
                                  {scan.status === 'OK' ? 'ОК' : scan.status === 'LOW_STOCK' ? 'Низкий' : 'Критично'}
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>

              {/* Блок 4: Предиктивная аналитика */}
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 4,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        mr: 2
                      }}>
                        <TrendingUp sx={{ color: 'white' }} />
                      </Box>
                      <Box>
                        <Typography variant="h5" fontWeight="bold">
                          Прогноз ИИ на 7 дней
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Товары с критическим прогнозом
                        </Typography>
                      </Box>
                    </Box>
                    <Button 
                      size="small" 
                      startIcon={<Refresh />}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Обновить
                    </Button>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Достоверность прогноза
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        92%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={92} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 3,
                        background: alpha(theme.palette.primary.main, 0.2),
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {predictions.map((prediction) => (
                      <Box
                        key={prediction.id}
                        sx={{
                          p: 2,
                          mb: 1,
                          background: alpha(theme.palette.warning.main, 0.05),
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            background: alpha(theme.palette.warning.main, 0.1),
                            transform: 'translateX(4px)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {prediction.productName}
                          </Typography>
                          <Chip 
                            label={`${prediction.confidence}%`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Текущий остаток: <strong>{prediction.currentStock}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Исчерпание: <strong>{prediction.predictedDepletion}</strong>
                            </Typography>
                          </Box>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="warning"
                            sx={{ borderRadius: 2, fontWeight: 'bold' }}
                          >
                            Заказать {prediction.recommendedOrder}
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* WebSocket индикатор */}
        <Tooltip title={`Статус соединения: ${connectionStatus === 'connected' ? 'Активно' : connectionStatus === 'disconnected' ? 'Потеряно' : 'Переподключение'}`}>
          <Box
            sx={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: connectionStatus === 'connected' ? '#4caf50' : connectionStatus === 'disconnected' ? '#f44336' : '#ff9800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              animation: connectionStatus === 'reconnecting' ? 'pulse 1.5s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.5 },
                '100%': { opacity: 1 }
              }
            }}
          >
            {getConnectionIcon()}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}