import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@mui/material";

interface AddColumnDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
}

function AddColumnDialog({
  open,
  onClose,
  onSubmit
}: AddColumnDialogProps) {
  const [title, setTitle] = useState("");

  const handleClose = () => {
    setTitle("");
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }

    onSubmit(title.trim());
    setTitle("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Add Column</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Column title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddColumnDialog;