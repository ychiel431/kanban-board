import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import type { Issue } from "../types";

interface IssueDetailsDialogProps {
  issue: Issue | null;
  onClose: () => void;
}

function IssueDetailsDialog({ issue, onClose }: IssueDetailsDialogProps) {
  if (!issue) return null;

  return (
    <Dialog open={Boolean(issue)} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{issue.title}</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography color="text.secondary">
            {issue.description}
          </Typography>

          <Typography>
            <strong>Assignee:</strong> {issue.assignee}
          </Typography>

          <Typography>
            <strong>Priority:</strong>{" "}
            <Chip label={issue.priority} size="small" />
          </Typography>

          <Typography>
            <strong>Created at:</strong>{" "}
            {issue.createdAt
              ? new Date(issue.createdAt).toLocaleString()
              : "No date"}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default IssueDetailsDialog;