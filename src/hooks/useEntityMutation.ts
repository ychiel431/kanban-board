import { useState } from 'react';

// T = מה שחוזר מהשרת (למשל Issue)
// K = מה שנשלח לשרת (למשל CreateIssueInput)
export function useEntityMutation<T extends { id: string }, K>(
  onSuccess: (updatedEntity: T, isNew: boolean) => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutate = async (
    apiFn: (data: K) => Promise<T>, // כאן התיקון: K במקום any
    data: K,
    isNew: boolean = true
  ) => {
    setIsSubmitting(true);
    try {
      const result = await apiFn(data);
      onSuccess(result, isNew);
      return result;
    } catch (error) {
      console.error("Mutation failed:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { mutate, isSubmitting };
}