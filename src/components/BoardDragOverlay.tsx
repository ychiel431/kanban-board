import React from 'react';
import { Paper, Typography, Stack } from "@mui/material";
import type { Issue } from "../types";

interface BoardDragOverlayProps {
  activeIssue: Issue | null;
}

const BoardDragOverlay: React.FC<BoardDragOverlayProps> = ({ activeIssue }) => {
  if (!activeIssue) return null;

  return (
    <Paper
      elevation={8}
      sx={{
        p: 2,
        width: 280,
        cursor: "grabbing",
        borderRadius: 2,
        border: "2px solid",
        borderColor: "primary.main",
        backgroundColor: "background.paper",
      }}
    >
      <Typography 
        variant="subtitle2" 
        noWrap 
        sx={{ fontWeight: "700", mb: 1 }}
      >
        {activeIssue.title}
      </Typography>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {activeIssue.assignee}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: "capitalize", fontWeight: 600 }}
        >
          {activeIssue.priority}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default BoardDragOverlay;