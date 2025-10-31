import { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from "@mui/material";
import {
  CloudUpload,
  Close,
  InsertDriveFile
} from "@mui/icons-material";

interface CsvUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

interface CsvRow {
  product_id: string;
  product_name: string;
  quantity: string;
  zone: string;
  date: string;
  row?: string;
  shelf?: string;
}

export function CsvUploadModal({ open, onClose, onUpload }: CsvUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<CsvRow[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Пожалуйста, выберите CSV файл');
      return;
    }

    setSelectedFile(file);
    setUploadProgress(0);

    // Чтение файла для предпросмотра
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n').slice(0, 6); // Первые 6 строк (заголовок + 5 данных)
      
      if (lines.length > 1) {
        const headers = lines[0].split(';');
        const previewRows: CsvRow[] = [];
        
        for (let i = 1; i < Math.min(lines.length, 6); i++) {
          const values = lines[i].split(';');
          const row: CsvRow = {
            product_id: values[0] || '',
            product_name: values[1] || '',
            quantity: values[2] || '',
            zone: values[3] || '',
            date: values[4] || '',
            row: values[5] || '',
            shelf: values[6] || ''
          };
          previewRows.push(row);
        }
        
        setPreviewData(previewRows);
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    // Имитация загрузки
    for (let progress = 0; progress <= 100; progress += 10) {
      setUploadProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Вызов callback для загрузки
    onUpload(selectedFile);
    
    // Закрытие модального окна после загрузки
    setTimeout(() => {
      setIsUploading(false);
      setSelectedFile(null);
      setPreviewData([]);
      setUploadProgress(0);
      onClose();
    }, 500);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setUploadProgress(0);
    setIsUploading(false);
    onClose();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Загрузка данных инвентаризации
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Drag & Drop область */}
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: 'center',
            border: isDragging ? '2px dashed #4caf50' : '2px dashed #e0e0e0',
            backgroundColor: isDragging ? '#f1f8e9' : '#fafafa',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            mb: 3
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv"
            style={{ display: 'none' }}
          />
          
          <CloudUpload sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {selectedFile ? selectedFile.name : 'Перетащите CSV файл сюда или нажмите для выбора'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Поддерживается только формат CSV
          </Typography>
        </Paper>

        {/* Требования к файлу */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Требования к файлу:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip label="Формат: CSV с разделителем ';'" size="small" variant="outlined" />
            <Chip label="Кодировка: UTF-8" size="small" variant="outlined" />
            <Chip label="Обязательные колонки: product_id, product_name, quantity, zone, date" size="small" variant="outlined" />
          </Box>
        </Box>

        {/* Прогресс-бар */}
        {isUploading && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Загрузка: {uploadProgress}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        {/* Предпросмотр данных */}
        {previewData.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Предпросмотр данных (первые {previewData.length} строк):
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>product_id</TableCell>
                    <TableCell>product_name</TableCell>
                    <TableCell align="right">quantity</TableCell>
                    <TableCell>zone</TableCell>
                    <TableCell>date</TableCell>
                    <TableCell>row</TableCell>
                    <TableCell>shelf</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.product_id}</TableCell>
                      <TableCell>{row.product_name}</TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                      <TableCell>{row.zone}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.row}</TableCell>
                      <TableCell>{row.shelf}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isUploading}>
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          startIcon={isUploading ? <InsertDriveFile /> : <CloudUpload />}
        >
          {isUploading ? 'Загрузка...' : 'Загрузить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}