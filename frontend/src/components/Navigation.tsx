import { Box, Button, Tab, Tabs } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

interface NavigationProps {
  activeTab: "monitoring" | "history";
  onTabChange: (tab: "monitoring" | "history") => void;
  onCsvUpload: () => void;
}

export function Navigation({ activeTab, onTabChange, onCsvUpload }: NavigationProps) {
  const handleTabChange = (event: React.SyntheticEvent, newValue: "monitoring" | "history") => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ 
      borderBottom: 1, 
      borderColor: "divider", 
      bgcolor: "white", 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      px: 2
    }}>
      <Tabs value={activeTab} onChange={handleTabChange}>
        <Tab label="Текущий мониторинг" value="monitoring" />
        <Tab label="Исторические данные" value="history" />
      </Tabs>
      
      {/* Кнопка показывается только на странице исторических данных */}
      {activeTab === "history" && (
        <Box sx={{ py: 1 }}>
          <Button 
            variant="contained" 
            onClick={onCsvUpload}
            startIcon={<CloudUpload />}
            sx={{
              bgcolor: "#4caf50",
              '&:hover': {
                bgcolor: "#388e3c",
              },
              px: 2,
              py: 0.75,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: 1,
              minWidth: 'auto',
              color: 'white',
            }}
          >
            Загрузить CSV
          </Button>
        </Box>
      )}
    </Box>
  );
}