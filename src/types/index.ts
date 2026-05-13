export interface Column {
  id: string;
  title: string;
  order: number;
}

export type Priority = "low" | "medium" | "high";

export interface Issue {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: string;
  priority: Priority;
  createdAt: string;
}

export interface CreateIssueInput {
  title: string;
  description: string;
  assignee: string;
  status: string;
  priority: Priority;
}

export interface UpdateIssueInput extends CreateIssueInput {
  id: string;
}