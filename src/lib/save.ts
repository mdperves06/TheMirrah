// src/lib/save.ts
// LocalStorage persistence layer for progress, mastery, quiz answers, and save slots

import { QuizTopic } from '../data/quizzes';

export interface UserMasteryData {
  overallPercentage: number;
  topicMastery: Record<QuizTopic, { attempts: number; correct: number; percentage: number }>;
  completedQuizIds: string[];
  bestDelegateScores: number[];
  averageDelegateScore: number;
  campaignClears: {
    kharaan: boolean;
    zahari: boolean;
    concord: boolean;
  };
  totalActionsTaken: number;
  lastPlayed: number;
}

const STORAGE_KEY = 'mirrah_diplomatic_atlas_mastery_v1';

export const INITIAL_MASTERY_DATA: UserMasteryData = {
  overallPercentage: 0,
  topicMastery: {
    history: { attempts: 0, correct: 0, percentage: 0 },
    parties: { attempts: 0, correct: 0, percentage: 0 },
    geography: { attempts: 0, correct: 0, percentage: 0 },
    resources: { attempts: 0, correct: 0, percentage: 0 },
    routes: { attempts: 0, correct: 0, percentage: 0 },
    ashenHand: { attempts: 0, correct: 0, percentage: 0 },
    sanctions: { attempts: 0, correct: 0, percentage: 0 },
    crisis: { attempts: 0, correct: 0, percentage: 0 },
  },
  completedQuizIds: [],
  bestDelegateScores: [],
  averageDelegateScore: 0,
  campaignClears: {
    kharaan: false,
    zahari: false,
    concord: false,
  },
  totalActionsTaken: 0,
  lastPlayed: Date.now(),
};

export function loadMastery(): UserMasteryData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_MASTERY_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_MASTERY_DATA,
      ...parsed,
      topicMastery: {
        ...INITIAL_MASTERY_DATA.topicMastery,
        ...(parsed.topicMastery || {}),
      },
    };
  } catch (err) {
    console.error('Failed to load mastery data from localStorage:', err);
    return INITIAL_MASTERY_DATA;
  }
}

export function saveMastery(data: UserMasteryData): void {
  try {
    data.lastPlayed = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save mastery data to localStorage:', err);
  }
}

export function recordQuizAttempt(
  topic: QuizTopic,
  quizId: string,
  isCorrect: boolean
): UserMasteryData {
  const data = loadMastery();
  const tm = data.topicMastery[topic] || { attempts: 0, correct: 0, percentage: 0 };
  
  tm.attempts += 1;
  if (isCorrect) tm.correct += 1;
  tm.percentage = Math.round((tm.correct / tm.attempts) * 100);
  data.topicMastery[topic] = tm;

  if (isCorrect && !data.completedQuizIds.includes(quizId)) {
    data.completedQuizIds.push(quizId);
  }

  // Recalculate overall percentage
  const topics = Object.keys(data.topicMastery) as QuizTopic[];
  const activeTopics = topics.filter(t => data.topicMastery[t].attempts > 0);
  if (activeTopics.length > 0) {
    const sum = activeTopics.reduce((acc, t) => acc + data.topicMastery[t].percentage, 0);
    const quizAvg = sum / activeTopics.length;
    // Blend with coach average score if present
    if (data.bestDelegateScores.length > 0) {
      data.overallPercentage = Math.round((quizAvg * 0.6) + (data.averageDelegateScore * 0.4));
    } else {
      data.overallPercentage = Math.round(quizAvg);
    }
  }

  saveMastery(data);
  return data;
}

export function recordCoachScore(score: number): UserMasteryData {
  const data = loadMastery();
  data.bestDelegateScores.push(score);
  const total = data.bestDelegateScores.reduce((a, b) => a + b, 0);
  data.averageDelegateScore = Math.round(total / data.bestDelegateScores.length);

  // Recalculate overall percentage
  const topics = Object.keys(data.topicMastery) as QuizTopic[];
  const activeTopics = topics.filter(t => data.topicMastery[t].attempts > 0);
  const quizAvg = activeTopics.length > 0
    ? activeTopics.reduce((acc, t) => acc + data.topicMastery[t].percentage, 0) / activeTopics.length
    : 50;

  data.overallPercentage = Math.round((quizAvg * 0.5) + (data.averageDelegateScore * 0.5));
  saveMastery(data);
  return data;
}

export function recordCampaignVictory(seat: 'kharaan' | 'zahari' | 'concord'): UserMasteryData {
  const data = loadMastery();
  data.campaignClears[seat] = true;
  saveMastery(data);
  return data;
}

export function getWeakestTopic(data: UserMasteryData): { topic: QuizTopic; percentage: number } {
  const topics = Object.keys(data.topicMastery) as QuizTopic[];
  let minTopic = topics[0];
  let minScore = 999;

  for (const t of topics) {
    const score = data.topicMastery[t].attempts === 0 ? 0 : data.topicMastery[t].percentage;
    if (score < minScore) {
      minScore = score;
      minTopic = t;
    }
  }

  return { topic: minTopic, percentage: minScore === 999 ? 0 : minScore };
}
