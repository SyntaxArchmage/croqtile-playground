import { SOURCE_STORAGE_KEY, loadSavedSource, saveSource } from "./sourceStorage";

const STORAGE_KEY = "croqtile-playground-progress";

type ProgressListener = () => void;
const listeners = new Set<ProgressListener>();
let revision = 0;

function notifyProgressListeners(): void {
  revision += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeProgress(listener: ProgressListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProgressRevision(): number {
  return revision;
}

export interface ChallengeProgress {
  status: "not_started" | "attempted" | "passed";
  bestCode?: string;
  attempts: number;
}

export interface Progress {
  tutorialSteps: Record<string, number>;
  challengesPassed: string[];
  challengeProgress: Record<string, ChallengeProgress>;
}

function getDefault(): Progress {
  return { tutorialSteps: {}, challengesPassed: [], challengeProgress: {} };
}

function normalizeChallengeProgress(raw: unknown): ChallengeProgress {
  if (typeof raw !== "object" || raw === null) {
    return { status: "not_started", attempts: 0 };
  }
  const cp = raw as Record<string, unknown>;
  const status =
    cp.status === "passed" || cp.status === "attempted" || cp.status === "not_started"
      ? cp.status
      : "not_started";
  const attempts =
    typeof cp.attempts === "number" && Number.isFinite(cp.attempts)
      ? Math.max(0, Math.floor(cp.attempts))
      : 0;
  const result: ChallengeProgress = { status, attempts };
  if (typeof cp.bestCode === "string") result.bestCode = cp.bestCode;
  return result;
}

function normalizeTutorialSteps(raw: unknown): Record<string, number> {
  if (typeof raw !== "object" || raw === null) return {};
  return Object.fromEntries(
    Object.entries(raw).filter(
      (entry): entry is [string, number] =>
        typeof entry[1] === "number" && Number.isFinite(entry[1]),
    ).map(([k, v]) => [k, Math.floor(v)]),
  );
}

function normalizeChallengeProgressMap(raw: unknown): Record<string, ChallengeProgress> {
  if (typeof raw !== "object" || raw === null) return {};
  return Object.fromEntries(
    Object.entries(raw).map(([id, cp]) => [id, normalizeChallengeProgress(cp)]),
  );
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return getDefault();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefault();
    const parsed = JSON.parse(raw);
    const def = getDefault();
    return {
      tutorialSteps: normalizeTutorialSteps(parsed.tutorialSteps),
      challengesPassed: Array.isArray(parsed.challengesPassed)
        ? parsed.challengesPassed.filter((id: unknown): id is string => typeof id === "string")
        : def.challengesPassed,
      challengeProgress: normalizeChallengeProgressMap(parsed.challengeProgress),
    };
  } catch {
    return getDefault();
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    notifyProgressListeners();
  } catch {
    // localStorage full or unavailable
  }
}

export function markTutorialStep(tutorialId: string, stepIndex: number): void {
  const p = loadProgress();
  const current = p.tutorialSteps[tutorialId] ?? -1;
  if (stepIndex > current) {
    p.tutorialSteps[tutorialId] = stepIndex;
    saveProgress(p);
  }
}

export function markChallengePassed(challengeId: string, code?: string): void {
  const p = loadProgress();
  if (!p.challengesPassed.includes(challengeId)) {
    p.challengesPassed.push(challengeId);
  }
  const cp = p.challengeProgress[challengeId] ?? { status: "not_started", attempts: 0 };
  cp.status = "passed";
  if (code) cp.bestCode = code;
  p.challengeProgress[challengeId] = cp;
  saveProgress(p);
}

export function recordChallengeAttempt(challengeId: string): void {
  const p = loadProgress();
  const cp = p.challengeProgress[challengeId] ?? { status: "not_started", attempts: 0 };
  cp.attempts += 1;
  if (cp.status === "not_started") cp.status = "attempted";
  p.challengeProgress[challengeId] = cp;
  saveProgress(p);
}

export function getChallengeProgress(challengeId: string): ChallengeProgress {
  return loadProgress().challengeProgress[challengeId] ?? { status: "not_started", attempts: 0 };
}

export function getTutorialProgress(tutorialId: string): number {
  return loadProgress().tutorialSteps[tutorialId] ?? -1;
}

export function isChallengePassed(challengeId: string): boolean {
  return loadProgress().challengesPassed.includes(challengeId);
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SOURCE_STORAGE_KEY);
    notifyProgressListeners();
  } catch {
    // noop
  }
}

export function saveLastSource(source: string): void {
  saveSource(source);
}

export function loadLastSource(): string | null {
  return loadSavedSource();
}
