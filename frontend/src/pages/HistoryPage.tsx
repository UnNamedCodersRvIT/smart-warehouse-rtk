import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Card,
  CardContent,
  IconButton,
  alpha,
  useTheme,
  Tabs,
  Tab
} from "@mui/material";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { CsvUploadModal } from "../components/CsvUploadModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FilterList,
  Search,
  Refresh,
  PictureAsPdf,
  TableChart,
  TrendingUp,
  Download,
  Analytics,
  Dashboard as DashboardIcon,
  BarChart,
  Timeline
} from "@mui/icons-material";

// Типы данных
interface InventoryRecord {
  id: string;
  scannedAt: string;
  robotId: string;
  zone: string;
  productId: string;
  productName: string;
  expectedQuantity: number;
  actualQuantity: number;
  discrepancy: number;
  status: 'OK' | 'LOW_STOCK' | 'CRITICAL';
  rowNumber?: number;
  shelfNumber?: number;
}

// Статистика по зонам
interface ZoneStats {
  zone: string;
  totalScans: number;
  discrepancies: number;
  efficiency: number;
}

export function HistoryPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Все']);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState(0);

  // Моковые данные для демонстрации
  const mockData: InventoryRecord[] = [
    {
      id: '1',
      scannedAt: '2024-03-15 10:30:00',
      robotId: 'RB-001',
      zone: 'A',
      productId: 'TEL-4567',
      productName: 'Роутер RT-AC68U',
      expectedQuantity: 50,
      actualQuantity: 45,
      discrepancy: -5,
      status: 'LOW_STOCK',
      rowNumber: 12,
      shelfNumber: 3
    },
    {
      id: '2',
      scannedAt: '2024-03-15 11:15:00',
      robotId: 'RB-002',
      zone: 'B',
      productId: 'TEL-8901',
      productName: 'Модем DSL-2640U',
      expectedQuantity: 15,
      actualQuantity: 12,
      discrepancy: -3,
      status: 'CRITICAL',
      rowNumber: 5,
      shelfNumber: 2
    },
    {
      id: '3',
      scannedAt: '2024-03-14 09:45:00',
      robotId: 'RB-001',
      zone: 'C',
      productId: 'TEL-1234',
      productName: 'Коммутатор SG-2000',
      expectedQuantity: 100,
      actualQuantity: 100,
      discrepancy: 0,
      status: 'OK',
      rowNumber: 8,
      shelfNumber: 1
    },
    {
      id: '4',
      scannedAt: '2024-03-14 14:20:00',
      robotId: 'RB-003',
      zone: 'A',
      productId: 'TEL-5678',
      productName: 'Точка доступа AC1200',
      expectedQuantity: 30,
      actualQuantity: 28,
      discrepancy: -2,
      status: 'LOW_STOCK',
      rowNumber: 3,
      shelfNumber: 2
    },
    {
      id: '5',
      scannedAt: '2024-03-13 16:45:00',
      robotId: 'RB-002',
      zone: 'D',
      productId: 'TEL-9012',
      productName: 'Маршрутизатор промышленный',
      expectedQuantity: 8,
      actualQuantity: 8,
      discrepancy: 0,
      status: 'OK',
      rowNumber: 15,
      shelfNumber: 1
    }
  ];

  // Статистика по зонам
  const zoneStats: ZoneStats[] = [
    { zone: 'A', totalScans: 347, discrepancies: 12, efficiency: 96.5 },
    { zone: 'B', totalScans: 289, discrepancies: 8, efficiency: 97.2 },
    { zone: 'C', totalScans: 412, discrepancies: 15, efficiency: 96.4 },
    { zone: 'D', totalScans: 199, discrepancies: 5, efficiency: 97.5 }
  ];

  useEffect(() => {
    document.title = "Исторические данные | Умный склад";
  }, []);

  const handleLogout = () => {
    console.log("Выход из системы");
    logout();
  };

  const handleTabChange = (tab: "monitoring" | "history") => {
    if (tab === "monitoring") {
      navigate("/dashboard");
    }
  };

  const handleCsvUpload = () => {
    setCsvModalOpen(true);
  };

  const handleFileUpload = (file: File) => {
    console.log("Загружаем файл:", file.name);
  };

  const handleApplyFilters = () => {
    console.log("Применение фильтров", {
      dateFrom,
      dateTo,
      selectedZones,
      selectedCategories,
      selectedStatuses,
      searchQuery
    });
  };

  const handleResetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedZones([]);
    setSelectedCategories([]);
    setSelectedStatuses(['Все']);
    setSearchQuery('');
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatuses(prev => {
      if (status === 'Все') {
        return ['Все'];
      }
      const newStatuses = prev.filter(s => s !== 'Все');
      if (newStatuses.includes(status)) {
        return newStatuses.filter(s => s !== status);
      } else {
        return [...newStatuses, status];
      }
    });
  };

  const handleZoneChange = (event: any) => {
    setSelectedZones(event.target.value as string[]);
  };

  const handleCategoryChange = (event: any) => {
    setSelectedCategories(event.target.value as string[]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'success';
      case 'LOW_STOCK': return 'warning';
      case 'CRITICAL': return 'error';
      default: return 'default';
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
        activeTab="history" 
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            mb: 2,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
          }}>
            <Analytics sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold'
            }}
          >
            Исторические данные
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Глубокий анализ и визуализация данных инвентаризации
          </Typography>
        </Box>

        {/* Панель фильтров */}
        <Paper 
          sx={{ 
            p: 4, 
            mb: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}
        >
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
              <FilterList sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Фильтры и поиск
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {/* Период */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>Период анализа</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Начальная дата"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: 'white'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Конечная дата"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: 'white'
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                {['Сегодня', 'Вчера', 'Неделя', 'Месяц'].map(period => (
                  <Button
                    key={period}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      mr: 1, 
                      mb: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {period}
                  </Button>
                ))}
              </Box>
            </Grid>

            {/* Зоны и категории */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Зоны склада</InputLabel>
                <Select
                  multiple
                  value={selectedZones}
                  onChange={handleZoneChange}
                  label="Зоны склада"
                  sx={{ borderRadius: 2 }}
                >
                  {['A', 'B', 'C', 'D'].map(zone => (
                    <MenuItem key={zone} value={zone}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: `zone.${zone}`,
                          mr: 1,
                          background: cardGradients[['A','B','C','D'].indexOf(zone)]
                        }} />
                        Зона {zone}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Категории товаров</InputLabel>
                <Select
                  multiple
                  value={selectedCategories}
                  onChange={handleCategoryChange}
                  label="Категории товаров"
                  sx={{ borderRadius: 2 }}
                >
                  {['Сетевое оборудование', 'Компьютеры', 'Комплектующие', 'Периферия'].map(cat => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Статус и поиск */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>Статус инвентаризации</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Все', 'OK', 'LOW_STOCK', 'CRITICAL'].map(status => (
                  <Chip
                    key={status}
                    label={status === 'LOW_STOCK' ? 'Низкий остаток' : 
                           status === 'CRITICAL' ? 'Критично' : status}
                    clickable
                    variant={selectedStatuses.includes(status) ? "filled" : "outlined"}
                    color={status === 'OK' ? 'success' : status === 'LOW_STOCK' ? 'warning' : status === 'CRITICAL' ? 'error' : 'primary'}
                    onClick={() => handleStatusChange(status)}
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: '500'
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Поиск по артикулу или названию товара"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'primary.main', mr: 1 }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'white'
                  }
                }}
              />
            </Grid>

            {/* Кнопки действий */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleResetFilters}
                  startIcon={<Refresh />}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    fontWeight: '600'
                  }}
                >
                  Сбросить фильтры
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleApplyFilters}
                  startIcon={<FilterList />}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Применить фильтры
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Сводная статистика */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Всего проверок', value: '1,247', icon: <DashboardIcon />, change: '+12%' },
            { label: 'Уникальных товаров', value: '356', icon: <TableChart />, change: '+5%' },
            { label: 'Выявлено расхождений', value: '23', icon: <Analytics />, change: '-8%' },
            { label: 'Эффективность', value: '96.8%', icon: <TrendingUp />, change: '+2.3%' }
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                background: cardGradients[index],
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)'
                    }}>
                      {stat.icon}
                    </Box>
                    <Chip 
                      label={stat.change} 
                      size="small"
                      sx={{ 
                        background: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
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

        {/* Статистика по зонам */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <BarChart sx={{ mr: 1, color: 'primary.main' }} />
              Эффективность по зонам
            </Typography>
          </Grid>
          {zoneStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.zone}>
              <Card sx={{
                background: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: cardGradients[index],
                      mr: 2
                    }} />
                    <Typography variant="h6" fontWeight="bold">
                      Зона {stat.zone}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Проверок: <strong>{stat.totalScans}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Расхождений: <strong style={{ color: stat.discrepancies > 10 ? '#f44336' : '#4caf50' }}>{stat.discrepancies}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      {stat.efficiency}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Эффективность
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Таблица данных */}
        <Paper sx={{ 
          width: '100%', 
          mb: 4,
          background: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            p: 3, 
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
          }}>
            <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <TableChart sx={{ mr: 1, color: 'primary.main' }} />
              Детализация инвентаризации
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  {['Дата и время', 'Робот', 'Зона', 'Артикул', 'Товар', 'Ожидаемо', 'Фактически', 'Расхождение', 'Статус'].map((header) => (
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
                {mockData.map((row) => (
                  <TableRow 
                    key={row.id}
                    sx={{ 
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.04),
                        transform: 'scale(1.01)'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {row.scannedAt.split(' ')[0]}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.scannedAt.split(' ')[1]}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.robotId} 
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: cardGradients[['A','B','C','D'].indexOf(row.zone)],
                          mr: 1
                        }} />
                        {row.zone}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500" fontFamily="monospace">
                        {row.productId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {row.productName}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="500">
                        {row.expectedQuantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="500">
                        {row.actualQuantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={row.discrepancy > 0 ? `+${row.discrepancy}` : row.discrepancy} 
                        size="small"
                        color={row.discrepancy < 0 ? "error" : "success"}
                        sx={{ 
                          borderRadius: 1,
                          fontWeight: 'bold',
                          minWidth: 60
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.status === 'LOW_STOCK' ? 'Низкий остаток' : 
                               row.status === 'CRITICAL' ? 'Критично' : 'OK'} 
                        color={getStatusColor(row.status) as any}
                        size="small"
                        sx={{ 
                          borderRadius: 1,
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[20, 50, 100]}
            component="div"
            count={mockData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              background: '#f8f9fa'
            }}
          />
        </Paper>

        {/* График тренда */}
        <Paper sx={{ 
          p: 4,
          background: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <Timeline sx={{ mr: 1, color: 'primary.main' }} />
              Аналитика трендов
            </Typography>
            <Tabs 
              value={activeChartTab} 
              onChange={(e, newValue) => setActiveChartTab(newValue)}
              sx={{
                '& .MuiTab-root': {
                  borderRadius: 2,
                  fontWeight: '500'
                }
              }}
            >
              <Tab label="Остатки" />
              <Tab label="Расхождения" />
              <Tab label="Эффективность" />
            </Tabs>
          </Box>
          
          <Box sx={{ 
            height: 400, 
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <BarChart sx={{ fontSize: 64, color: 'primary.main', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Интерактивные графики
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Выберите данные для построения аналитических графиков
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Модальное окно загрузки CSV */}
        <CsvUploadModal
          open={csvModalOpen}
          onClose={() => setCsvModalOpen(false)}
          onUpload={handleFileUpload}
        />
      </Box>
    </Box>
  );
}