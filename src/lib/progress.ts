const STORAGE_KEY = "croqtile-playground-progress";
const LAST_SOURCE_KEY = "croqtile-playground-last-source";

export interface Progress {
  tutorialSteps: Record<string, number>;
  challengesPassed: string[];
}

function getDefault(): Progress {
  return { tutorialSteps: {}, challengesPassed: [] };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return getDefault();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefault();
    return { ...getDefault(), ...JSON.parse(raw) };
  } catch {
    return getDefault();
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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

export function markChallengePassed(challengeId: string): void {
  const p = loadProgress();
  if (!p.challengesPassed.includes(challengeId)) {
    p.challengesPassed.push(challengeId);
    saveProgress(p);
  }
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
    localStorage.removeItem(LAST_SOURCE_KEY);
  } catch {
    // noop
  }
}

export function saveLastSource(source: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_SOURCE_KEY, source);
  } catch {
    // noop
  }
}

export function loadLastSource(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(LAST_SOURCE_KEY);
  } catch {
    return null;
  }
}
