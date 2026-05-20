import React from 'react';
import { Typography, TextField, Stack, Button, IconButton, Paper, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AddIcon from "@mui/icons-material/Add";
import { useUIStore } from "../store/uiStore";

interface BoardHeaderProps {
  onAddColumn: () => void;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ onAddColumn }) => {
  const { search, setSearch, mode, toggleMode } = useUIStore();

  return (
    <Paper 
      elevation={0} 
      sx={{ p: 2, mb: 4, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
    >
      <Stack 
        direction="row" 
        sx={{ justifyContent: "space-between", alignItems: "center" }} 
        spacing={2}
      >
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 900, color: "primary.main", letterSpacing: '-0.5px' }}
        >
          Kanban Board
        </Typography>

        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' }}
        >
          <TextField
            size="small"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
            // תיקון ל-InputProps: משתמשים ב-slotProps בגרסאות חדשות או מוודאים תאימות
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }
            }}
          />
          
          <IconButton onClick={toggleMode} color="inherit" sx={{ border: '1px solid', borderColor: 'divider' }}>
            {mode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>

          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={onAddColumn}
            sx={{ px: 3, fontWeight: 700, borderRadius: 2 }}
          >
            Add Column
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default BoardHeader;