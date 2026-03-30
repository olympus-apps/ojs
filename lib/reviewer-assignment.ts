import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), ".data");
const ASSIGNMENT_FILE = path.join(DATA_DIR, "reviewer-assignments.json");

type AssignmentMap = Record<string, string>;

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(ASSIGNMENT_FILE);
  } catch {
    await fs.writeFile(ASSIGNMENT_FILE, "{}", "utf8");
  }
}

async function readAssignments(): Promise<AssignmentMap> {
  await ensureStore();
  const raw = await fs.readFile(ASSIGNMENT_FILE, "utf8");
  try {
    return JSON.parse(raw) as AssignmentMap;
  } catch {
    return {};
  }
}

async function writeAssignments(assignments: AssignmentMap): Promise<void> {
  await ensureStore();
  await fs.writeFile(ASSIGNMENT_FILE, JSON.stringify(assignments, null, 2), "utf8");
}

export async function setSubmissionReviewer(
  submissionId: string,
  reviewerId: string,
): Promise<void> {
  const assignments = await readAssignments();
  assignments[submissionId] = reviewerId;
  await writeAssignments(assignments);
}

export async function getSubmissionReviewer(
  submissionId: string,
): Promise<string | null> {
  const assignments = await readAssignments();
  return assignments[submissionId] ?? null;
}

export async function clearSubmissionReviewer(submissionId: string): Promise<void> {
  const assignments = await readAssignments();
  delete assignments[submissionId];
  await writeAssignments(assignments);
}
