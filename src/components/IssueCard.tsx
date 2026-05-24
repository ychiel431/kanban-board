import { Paper, Typography, Box, IconButton } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDraggable } from "@dnd-kit/core";
import type { Issue } from "../types";

interface IssueCardProps {
  issue: Issue;
  onDelete: (issue: Issue) => void;
  onEdit: (issue: Issue) => void;
  onView: (issue: Issue) => void;
}

function IssueCard({ issue, onDelete, onEdit, onView }: IssueCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: issue.id,
      data: { issue },
    });

  function getPriorityStyles() {
    if (isDark) {
      switch (issue.priority) {
        case "low":
          return {
            backgroundColor: "rgba(34, 197, 94, 0.10)",
            borderColor: "rgba(34, 197, 94, 0.22)",
          };
        case "medium":
          return {
            backgroundColor: "rgba(245, 158, 11, 0.12)",
            borderColor: "rgba(245, 158, 11, 0.24)",
          };
        case "high":
          return {
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            borderColor: "rgba(239, 68, 68, 0.24)",
          };
        default:
          return {
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            borderColor: alpha(theme.palette.common.white, 0.08),
          };
      }
    }

    switch (issue.priority) {
      case "low":
        return { backgroundColor: "#f0fff4", borderColor: "#9ae6b4" };
      case "medium":
        return { backgroundColor: "#fffbeb", borderColor: "#f6c453" };
      case "high":
        return { backgroundColor: "#fff5f5", borderColor: "#fc8181" };
      default:
        return { backgroundColor: "#ffffff", borderColor: "#d0d7de" };
    }
  }

  const priorityStyles = getPriorityStyles();

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        backgroundColor: priorityStyles.backgroundColor,
        border: `1px solid ${priorityStyles.borderColor}`,
        boxShadow: "none",
        cursor: isDragging ? "grabbing" : "default",
        opacity: isDragging ? 0.5 : 1,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        touchAction: "none",
        "&:hover .issue-actions": {
          opacity: 1,
        },
      }}
    >
      {/* 🔹 אזור draggable בלבד */}
      <Box
        {...attributes}
        {...listeners}
        sx={{
          cursor: "grab",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            lineHeight: 1.3,
            mb: 0.5,
          }}
        >
          {issue.title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          {issue.assignee}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            color: theme.palette.text.secondary,
            textTransform: "capitalize",
            fontWeight: 600,
          }}
        >
          {issue.priority}
        </Typography>
      </Box>

      {/* 🔹 אייקונים */}
      <Box
        className="issue-actions"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 0.5,
          mt: 1,
          opacity: 0,
          transition: "opacity 120ms ease",
        }}
      >
        {/* 👁️ View */}
        <IconButton
          size="small"
          onClick={() => onView(issue)}
          sx={{
            width: 24,
            height: 24,
            color: theme.palette.text.secondary,
            "& svg": { fontSize: 16 },
            "&:hover": {
              color: theme.palette.info.main,
              backgroundColor: alpha(theme.palette.info.main, 0.08),
            },
          }}
        >
          <VisibilityIcon />
        </IconButton>

        {/* ✏️ Edit */}
        <IconButton
          size="small"
          onClick={() => onEdit(issue)}
          sx={{
            width: 24,
            height: 24,
            color: theme.palette.text.secondary,
            "& svg": { fontSize: 16 },
            "&:hover": {
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          <EditIcon />
        </IconButton>

        {/* 🗑️ Delete */}
        <IconButton
          size="small"
          onClick={() => onDelete(issue)}
          sx={{
            width: 24,
            height: 24,
            color: theme.palette.text.secondary,
            "& svg": { fontSize: 16 },
            "&:hover": {
              color: theme.palette.error.main,
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default IssueCard;