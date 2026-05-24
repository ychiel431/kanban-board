import { Paper, Stack, Typography, IconButton, Box } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDroppable } from "@dnd-kit/core";
import type { Column, Issue } from "../types";
import IssueCard from "./IssueCard";

interface BoardColumnProps {
  column: Column;
  issues: Issue[];
  onAddIssue: (columnId: string) => void;
  onDeleteIssue: (issue: Issue) => void;
  onEditIssue: (issue: Issue) => void;
  onViewIssue: (issue: Issue) => void;
  onDeleteColumn: (column: Column) => void;
}

function BoardColumn({
  column,
  issues,
  onAddIssue,
  onDeleteIssue,
  onEditIssue,
  onViewIssue,
  onDeleteColumn,
}: BoardColumnProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        width: 320,
        minHeight: 420,
        p: 2,
        borderRadius: 2,
        backgroundColor: isOver
          ? alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08)
          : isDark
            ? "#161b22"
            : "#f6f8fa",
        border: `1px solid ${
          isOver
            ? theme.palette.primary.main
            : isDark
              ? alpha(theme.palette.common.white, 0.08)
              : alpha(theme.palette.common.black, 0.1)
        }`,
        boxShadow: "none",
        transition: "background-color 160ms ease, border-color 160ms ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
          }}
        >
          {column.title}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            onClick={() => onAddIssue(column.id)}
            size="small"
            sx={{
              borderRadius: 1.5,
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: isDark
                  ? alpha(theme.palette.common.white, 0.08)
                  : alpha(theme.palette.common.black, 0.06),
                color: theme.palette.text.primary,
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => onDeleteColumn(column)}
            size="small"
            sx={{
              borderRadius: 1.5,
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.main, 0.08),
                color: theme.palette.error.main,
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Stack spacing={1.25}>
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onDelete={onDeleteIssue}
            onEdit={onEditIssue}
            onView={onViewIssue}
          />
        ))}
      </Stack>
    </Paper>
  );
}

export default BoardColumn;