import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack
} from "@mui/material";
import type { CreateIssueInput,UpdateIssueInput, Issue, Priority } from "../types";

interface IssueDialogProps {
  open: boolean;
  initialStatus: string;
  issue?: Issue;
  onClose: () => void;
  onSubmit: (input: CreateIssueInput | UpdateIssueInput) => Promise<void>;
}

function IssueDialog({
  open,
  initialStatus,
  issue,
  onClose,
  onSubmit
}: IssueDialogProps) {
  const isEdit = Boolean(issue);

  const [title, setTitle] = useState(issue?.title ?? "");
  const [description, setDescription] = useState(issue?.description ?? "");
  const [assignee, setAssignee] = useState(issue?.assignee ?? "");
  const [priority, setPriority] = useState<Priority>(issue?.priority ?? "medium");

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !assignee.trim()) {
      return;
    }

    const input = {
      title: title.trim(),
      description: description.trim(),
      assignee: assignee.trim(),
      status: issue ? issue.status : initialStatus,
      priority,
    };

    if (issue) {
      await onSubmit({ id: issue.id, ...input });
    } else {
      await onSubmit(input);
}

    
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit Issue" : "New Issue"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />

          <TextField
            label="Assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            fullWidth
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default IssueDialog;