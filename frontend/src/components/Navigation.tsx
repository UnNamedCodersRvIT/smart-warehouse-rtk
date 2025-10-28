import { Paper, Tabs, Tab, Button, Box } from "@mui/material";
import { UploadFile } from "@mui/icons-material";

export interface NavigationProps {
  activeTab: "monitoring" | "history";
  onTabChange: (tab: "monitoring" | "history") => void;
  onCsvUpload: () => void;
}

export function Navigation({ activeTab, onTabChange, onCsvUpload }: NavigationProps) {
  const handleTabChange = (event: React.SyntheticEvent, newValue: "monitoring" | "history") => {
    onTabChange(newValue);
  };

  return (
    <Paper 
      sx={{ 
        borderRadius: 0,
        borderBottom: 1,
        borderColor: "divider",
        boxShadow: 1
      }}
    >
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        px: 3,
        py: 0
      }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: 48
          }}
        >
          <Tab 
            label="Текущий мониторинг" 
            value="monitoring"
            sx={{ 
              fontWeight: activeTab === "monitoring" ? 600 : 400,
              minHeight: 48,
              fontSize: "0.875rem"
            }}
          />
          <Tab 
            label="Исторические данные" 
            value="history"
            sx={{ 
              fontWeight: activeTab === "history" ? 600 : 400,
              minHeight: 48,
              fontSize: "0.875rem"
            }}
          />
        </Tabs>
        
        <Button
          variant="contained"
          startIcon={<UploadFile />}
          onClick={onCsvUpload}
          size="medium"
          sx={{
            background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            borderRadius: 2,
            color: '#ffffff',
            '&:hover': {
              background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
            '&:disabled': {
              transform: 'none',
              boxShadow: 'none',
            },
          }}
        >
          Загрузить CSV
        </Button>
      </Box>
    </Paper>
  );
}