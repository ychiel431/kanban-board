import { useState, useEffect } from "react";
import { 
  getColumns, getIssues, createIssue, updateIssue, 
  deleteIssue, createColumn, deleteColumn, updateIssueStatus 
} from "../api/boardApi";
import { useDeleteEntity, type UseDeleteEntityReturn } from "./useDeleteEntity";
import { useEntityMutation } from "./useEntityMutation";
import type { Column, Issue, CreateIssueInput, UpdateIssueInput } from "../types";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useUIStore } from "../store/uiStore";

const PRIORITY_WEIGHT = { high: 1, medium: 2, low: 3 };

function sortByPriority(a: Issue, b: Issue) {
  return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
}

export function useBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [viewingIssue, setViewingIssue] = useState<Issue | null>(null);

  const search = useUIStore((state) => state.search);

  // 1. פונקציות עזר לדיאלוגים (חייבות להופיע למעלה!)
  const handleCloseIssueDialog = () => {
    setIsIssueDialogOpen(false);
    setEditingIssue(null);
  };

  const handleOpenIssueDialog = (status: string, issue?: Issue) => {
    setSelectedStatus(status);
    setEditingIssue(issue || null);
    setIsIssueDialogOpen(true);
  };

  // 2. טעינה ראשונית
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cols, iss] = await Promise.all([getColumns(), getIssues()]);
        setColumns(cols);
        setIssues(iss);
      } catch (error) { 
        console.error("Failed to fetch board data:", error); 
      }
    };
    fetchData();
  }, []);

  // 3. מחיקות
  const issueDelete: UseDeleteEntityReturn<Issue> = useDeleteEntity(deleteIssue, (id) => 
    setIssues(prev => prev.filter(i => i.id !== id)));

  const columnDelete: UseDeleteEntityReturn<Column> = useDeleteEntity(deleteColumn, (id) => 
    setColumns(prev => prev.filter(c => c.id !== id)));

  // 4. מוטציות (שמירה ועריכה)
  const issueMutation = useEntityMutation<Issue, CreateIssueInput | UpdateIssueInput>((res, isNew) => {
    setIssues(prev => isNew ? [...prev, res] : prev.map(i => i.id === res.id ? res : i));
    handleCloseIssueDialog();
  });

  const handleCreateColumn = async (title: string) => {
    const newColumn = await createColumn(title, columns);
    setColumns((prev) => [...prev, newColumn]);
  };

  const handleSaveIssue = async (data: CreateIssueInput | UpdateIssueInput) => {
    const isNew = !editingIssue;
    const apiFn = isNew ? createIssue : updateIssue;
    await issueMutation.mutate(apiFn as (d: CreateIssueInput | UpdateIssueInput) => Promise<Issue>, data, isNew);
  };

  // 5. גרירה (Drag and Drop)
  const handleDragStart = (event: DragStartEvent) => {
    const issue = issues.find(i => i.id === event.active.id);
    if (issue) setActiveIssue(issue);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveIssue(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const issueId = active.id as string;
      const newStatus = over.id as string;
      
      const originalIssues = [...issues];
      setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: newStatus } : i));
      
      try { 
        await updateIssueStatus(issueId, newStatus); 
      } catch (error) { 
        console.error("Failed to update status:", error);
        setIssues(originalIssues);
      }
    }
  };


  const q = search.trim().toLowerCase();

  const filteredIssues = issues
    .filter((issue) => {
      if (q.length < 2) return true;

      return (
        issue.title.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        issue.assignee.toLowerCase().includes(q)
      );
    })
    .sort(sortByPriority);

  return {
    columns,
    issues,
    filteredIssues,
    activeIssue,
    dialogs: {
      isIssueOpen: isIssueDialogOpen,
      isAddColumnOpen: isAddColumnDialogOpen,
      editingIssue,
      selectedStatus,
      viewingIssue,
    },
    handlers: {
      openIssueDialog: handleOpenIssueDialog,
      closeIssue: handleCloseIssueDialog,
      openAddColumn: () => setIsAddColumnDialogOpen(true),
      closeAddColumn: () => setIsAddColumnDialogOpen(false),
      openViewIssue: setViewingIssue,
      closeViewing: () => setViewingIssue(null),
      saveIssue: handleSaveIssue,
      createColumn: handleCreateColumn,
      deleteIssue:issueDelete.openDeleteDialog,
      deleteColumn: columnDelete.openDeleteDialog,
    },
    issueDelete,
    columnDelete,
    dndHandlers: {
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
    }
  };
}