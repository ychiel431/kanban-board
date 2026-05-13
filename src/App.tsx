import { useEffect, useState } from "react";
import { Container, Typography, Box, TextField, Stack, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";

import { useUIStore } from "./store/uiStore";
import {
  getColumns,
  getIssues,
  createIssue,
  createColumn,
  deleteIssue,
  updateIssue,
  updateIssueStatus,
} from "./api/boardApi";

import type { Column, Issue, CreateIssueInput } from "./types";

import BoardColumn from "./components/BoardColumn";
import IssueDialog from "./components/IssueDialog";
import AddColumnDialog from "./components/AddColumnDialog";
import ConfirmDeleteDialog from "./components/ConfirmDeleteDialog";
import IssueDetailsDialog from "./components/IssueDetailsDialog";
import { api } from "./api/client";

function App() {
  const search = useUIStore((state) => state.search);
  const setSearch = useUIStore((state) => state.setSearch);
  const mode = useUIStore((state) => state.mode);
  const toggleMode = useUIStore((state) => state.toggleMode);

  const [columns, setColumns] = useState<Column[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [viewingIssue, setViewingIssue] = useState<Issue | null>(null);

  useEffect(() => {
    async function loadBoard() {
      try {
        const [columnsData, issuesData] = await Promise.all([
          getColumns(),
          getIssues(),
        ]);

        setColumns(columnsData);
        setIssues(issuesData);
      } catch (error) {
        console.error("Failed to load board:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, []);

  function handleOpenIssueDialog(columnId: string) {
    setSelectedStatus(columnId);
    setEditingIssue(null);
    setIsIssueDialogOpen(true);
  }

  function handleEditIssue(issue: Issue) {
    setEditingIssue(issue);
    setSelectedStatus(issue.status);
    setIsIssueDialogOpen(true);
  }

  function handleCloseIssueDialog() {
    setIsIssueDialogOpen(false);
    setEditingIssue(null);
    setSelectedStatus("");
  }

  function handleViewIssue(issue: Issue) {
    setViewingIssue(issue);
  }

  function handleDeleteIssue(issueId: string) {
    setIssueToDelete(issueId);
  }

  async function handleSaveIssue(input: CreateIssueInput, id?: string) {
    try {
      if (id) {
        const updatedIssue = await updateIssue({ id, ...input });

        setIssues((prev) =>
          prev.map((issue) => (issue.id === id ? updatedIssue : issue))
        );
      } else {
        const newIssue = await createIssue(input);
        setIssues((prev) => [...prev, newIssue]);
      }
    } catch (error) {
      console.error("Failed to save issue:", error);
    }
  }



  async function confirmDeleteIssue() {
    if (!issueToDelete) return;

    try {
      await deleteIssue(issueToDelete);

      setIssues((prev) =>
        prev.filter((issue) => issue.id !== issueToDelete)
      );
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIssueToDelete(null);
    }
  }

  async function handleCreateColumn(title: string) {
    try {
      const newColumn = await createColumn(title, columns);
      setColumns((prev) => [...prev, newColumn]);
    } catch (error) {
      console.error("Failed to create column:", error);
    }
  }

  async function handleDeleteColumn(columnId: string) {
    try {
      // שלב 1: עדכון השרת (כדי שהמחיקה תישמר ב-DB)
      await api.delete(`/columns/${columnId}`);
      
      // שלב 2: עדכון ה-State של העמודות
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
      
      // שלב 3: (אופציונלי) מחיקת כל המשימות שהיו שייכות לעמודה הזו מה-State
      setIssues((prev) => prev.filter((issue) => issue.status !== columnId));
      
    } catch (error) {
      console.error("שגיאה במחיקת עמודה:", error);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const issue = event.active.data.current?.issue as Issue | undefined;

    if (issue) {
      setActiveIssue(issue);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveIssue(null);

    if (!over) return;

    const issueId = String(active.id);
    const newStatus = String(over.id);

    const draggedIssue = issues.find((issue) => issue.id === issueId);
    if (!draggedIssue) return;

    if (draggedIssue.status === newStatus) return;

    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );

    try {
      await updateIssueStatus(issueId, newStatus);
    } catch (error) {
      console.error("Drag update failed:", error);

      setIssues((prev) =>
        prev.map((issue) =>
          issue.id === issueId
            ? { ...issue, status: draggedIssue.status }
            : issue
        )
      );
    }
  }

  function handleDragCancel() {
    setActiveIssue(null);
  }

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Kanban Board
          </Typography>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button
              variant="outlined"
              onClick={() => setIsAddColumnDialogOpen(true)}
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              New Column
            </Button>

            <IconButton onClick={toggleMode}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Stack>
        </Stack>

        <TextField
          fullWidth
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
            {columns.map((column) => {
              const priorityOrder = {
                high: 1,
                medium: 2,
                low: 3,
              };

              const columnIssues = issues
                .filter(
                  (issue) =>
                    issue.status === column.id &&
                    issue.title.toLowerCase().includes(search.toLowerCase())
                )
                .sort(
                  (a, b) =>
                    priorityOrder[a.priority] - priorityOrder[b.priority]
                );

              return (
                <BoardColumn
                  key={column.id}
                  column={column}
                  issues={columnIssues}
                  onAddIssue={handleOpenIssueDialog}
                  onDeleteIssue={handleDeleteIssue}
                  onEditIssue={handleEditIssue}
                  onViewIssue={handleViewIssue}
                  onDeleteColumn={() => handleDeleteColumn(column.id)}
                />
              );
            })}
          </Stack>

          <DragOverlay>
            {activeIssue ? (
              <Paper
                elevation={6}
                sx={{
                  width: 280,
                  p: 1.5,
                  borderRadius: 1.5,
                  cursor: "grabbing",
                  opacity: 0.95,
                }}
              >
                <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                  {activeIssue.title}
                </Typography>

                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
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
            ) : null}
          </DragOverlay>
        </DndContext>

        <IssueDialog
          key={editingIssue?.id ?? selectedStatus}
          open={isIssueDialogOpen}
          initialStatus={selectedStatus}
          issue={editingIssue || undefined}
          onClose={handleCloseIssueDialog}
          onSubmit={handleSaveIssue}
        />

        <AddColumnDialog
          open={isAddColumnDialogOpen}
          onClose={() => setIsAddColumnDialogOpen(false)}
          onSubmit={handleCreateColumn}
        />

        <ConfirmDeleteDialog
          open={Boolean(issueToDelete)}
          onClose={() => setIssueToDelete(null)}
          onConfirm={confirmDeleteIssue}
          title="Delete Issue"
          description="Are you sure you want to delete this issue?"
        />

        <IssueDetailsDialog
          issue={viewingIssue}
          onClose={() => setViewingIssue(null)}
        />
      </Box>
    </Container>
  );
}

export default App;