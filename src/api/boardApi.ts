import { api } from "./client";
import type { Column, Issue, CreateIssueInput, UpdateIssueInput } from "../types";

export async function getColumns(): Promise<Column[]> {
  const response = await api.get("/columns?_sort=order&_order=asc");
  return response.data;
}

export async function getIssues(): Promise<Issue[]> {
  const response = await api.get("/issues");
  return response.data;
}

function getNextIssueId(issues: Issue[]): string {
  const numbers = issues
    .map((issue) => issue.id)
    .filter((id) => id.startsWith("issue-"))
    .map((id) => Number(id.replace("issue-", "")))
    .filter((n) => !Number.isNaN(n));

  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `issue-${next}`;
}

function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

export async function createColumn(title: string, currentColumns: Column[]): Promise<Column> {
  const order = currentColumns.length ? Math.max(...currentColumns.map((col) => col.order)) + 1 : 1;
  const id = `col-${createSlug(title)}`;

  const response = await api.post("/columns", { id, title, order });
  return response.data;
}

export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  const existingIssues = await getIssues();
  const id = getNextIssueId(existingIssues);

  const response = await api.post("/issues", {
    id,
    ...input,
    createdAt: new Date().toISOString()
  });

  return response.data;
}

export async function updateIssue(input: UpdateIssueInput): Promise<Issue> {
  const response = await api.put(`/issues/${input.id}`, input);
  return response.data;
}

export async function updateIssueStatus(issueId: string, status: string): Promise<Issue> {
  const response = await api.patch(`/issues/${issueId}`, { status });
  return response.data;
}

export async function deleteIssue(issueId: string): Promise<void> {
  await api.delete(`/issues/${issueId}`);
}

export async function deleteColumn(columnId: string): Promise<void> {
  await api.delete(`/columns/${columnId}`);
}