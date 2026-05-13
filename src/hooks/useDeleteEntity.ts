import { useState } from 'react';

// T מייצג את סוג הישות (Issue או Column) - חייב להיות להם id
export function useDeleteEntity<T extends { id: string }>(
  deleteApiFn: (id: string) => Promise<void>,
  onSuccess: (id: string) => void
) {
  const [entityToDelete, setEntityToDelete] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteDialog = (entity: T) => setEntityToDelete(entity);
  const closeDeleteDialog = () => setEntityToDelete(null);

  const confirmDelete = async () => {
    if (!entityToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteApiFn(entityToDelete.id);
      onSuccess(entityToDelete.id); // עדכון הסטייט ב-App
      closeDeleteDialog();
    } catch (error) {
      console.error("מחיקה נכשלה:", error);
      alert("חלה שגיאה במחיקת הפריט.");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    entityToDelete,
    isOpen: !!entityToDelete,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
    isDeleting,
  };
}