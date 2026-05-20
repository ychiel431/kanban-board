import { Container, Box } from "@mui/material";
import { DndContext } from "@dnd-kit/core";

import BoardColumn from "./components/BoardColumn";
import BoardDialogs from "./components/BoardDialogs";
import BoardDragOverlay from "./components/BoardDragOverlay";
import BoardHeader from "./components/BoardHeader";
import { useBoard } from "./hooks/useBoard";
// ייבוא הטיפוסים בצורה שתואמת להגדרות הפרויקט שלך
import type { Column, Issue } from "./types";

function App() {
  // שליפה מסודרת של כל המשתנים מההוק - הוספתי את columnDelete
  const { 
    columns, 
    filteredIssues, 
    activeIssue, 
    dialogs, 
    handlers, 
    issueDelete, 
    columnDelete,
    dndHandlers 
  } = useBoard();

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh" }}>
      <BoardHeader onAddColumn={handlers.openAddColumn} />

      <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 2, alignItems: "flex-start" }}>
        <DndContext onDragStart={dndHandlers.onDragStart} onDragEnd={dndHandlers.onDragEnd}>
          {columns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              issues={filteredIssues.filter((i) => i.status === column.id)}
              onAddIssue={() => handlers.openIssueDialog(column.id)}
              onEditIssue={(issue: Issue) => handlers.openIssueDialog(column.id, issue)}
              
              // פתרון שגיאת onDeleteIssue - שימוש בטיפוס Issue
              onDeleteIssue={(issueId: string) => {
                const issueToDelete = filteredIssues.find((i: Issue) => i.id === issueId);
                if (issueToDelete) issueDelete.openDeleteDialog(issueToDelete);
              }}

              // פתרון שגיאת onDeleteColumn - שימוש בטיפוס Column
              onDeleteColumn={(col: Column) => {
                columnDelete.openDeleteDialog(col);
              }}
              
              onViewIssue={handlers.openViewIssue}
            />
          ))}
          <BoardDragOverlay activeIssue={activeIssue} />
        </DndContext>
      </Box>

      <BoardDialogs 
        dialogs={dialogs} 
        handlers={handlers} 
        issueDelete={issueDelete} 
        columnDelete={columnDelete}
      />
    </Container>
  );
}

export default App;