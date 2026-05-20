import React from 'react';
import IssueDialog from "./IssueDialog";
import AddColumnDialog from "./AddColumnDialog";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import IssueDetailsDialog from "./IssueDetailsDialog";
import type { Issue, CreateIssueInput, UpdateIssueInput, Column } from "../types";
import {type UseDeleteEntityReturn } from "../hooks/useDeleteEntity"; // נצטרך לייצא את הטיפוס הזה מההוק

interface BoardDialogsProps {
  dialogs: {
    isIssueOpen: boolean;
    isAddColumnOpen: boolean;
    editingIssue: Issue | null;
    selectedStatus: string;
    viewingIssue: Issue | null;
    
  };
  handlers: {
    closeIssue: () => void;
    closeAddColumn: () => void;
    closeViewing: () => void;
    saveIssue: (data: CreateIssueInput | UpdateIssueInput) => Promise<void>;
    createColumn: (title: string) => Promise<void>;
  };
  issueDelete: UseDeleteEntityReturn<Issue>;
  columnDelete: UseDeleteEntityReturn<Column>;
  // טיפוס מדויק במקום any
}

const BoardDialogs: React.FC<BoardDialogsProps> = ({ dialogs, handlers, issueDelete, columnDelete }) => {
  return (
    <>
      {/* דיאלוג יצירה/עריכה של משימה */}
      <IssueDialog
        key={dialogs.editingIssue?.id ?? dialogs.selectedStatus}
        open={dialogs.isIssueOpen}
        initialStatus={dialogs.selectedStatus}
        issue={dialogs.editingIssue || undefined}
        onClose={handlers.closeIssue}
        onSubmit={handlers.saveIssue}
      />

      {/* דיאלוג הוספת עמודה */}
      <AddColumnDialog
        open={dialogs.isAddColumnOpen}
        onClose={handlers.closeAddColumn}
        onSubmit={handlers.createColumn}
      />

      {/* דיאלוג אישור מחיקה - משתמש בהוק הגנרי */}
      <ConfirmDeleteDialog
        open={issueDelete.isOpen}
        onClose={issueDelete.closeDeleteDialog}
        onConfirm={issueDelete.confirmDelete}
        title="Delete Issue"
        description={`Are you sure you want to delete "${issueDelete.entityToDelete?.title}"?`}
      />

      <ConfirmDeleteDialog
        open={columnDelete.isOpen}
        onClose={columnDelete.closeDeleteDialog}
        onConfirm={columnDelete.confirmDelete}
        title="Delete Column"
        description={`Are you sure you want to delete "${columnDelete.entityToDelete?.title}"?`}
      />

      {/* דיאלוג צפייה בפרטים */}
      <IssueDetailsDialog 
        issue={dialogs.viewingIssue} 
        onClose={handlers.closeViewing} 
      />
    </>
  );
};

export default BoardDialogs;