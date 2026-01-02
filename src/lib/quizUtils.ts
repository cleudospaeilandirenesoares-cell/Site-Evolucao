import { QuizQuestion } from '@/types';

// Returns the next question index given current index and whether the last answer was correct
export function chooseNextQuestionIndex(questions: QuizQuestion[], currentIndex: number, gotCorrect: boolean): number {
  if (!questions || questions.length === 0) return -1;

  const difficultyOrder = ['easy', 'medium', 'hard'];
  const current = questions[currentIndex];
  const currentDifficultyIdx = difficultyOrder.indexOf(current?.difficulty || 'medium');

  let targetIdx = currentIndex + 1;

  // If got it correct, preferably move to same or harder difficulty
  if (gotCorrect) {
    for (let d = currentDifficultyIdx; d < difficultyOrder.length; d++) {
      const candidates = questions
        .map((q, idx) => ({ q, idx }))
        .filter(({ q }) => q.difficulty === (difficultyOrder[d] as any) && questions.indexOf(q) !== currentIndex);
      if (candidates.length > 0) return candidates[0].idx;
    }
  } else {
    // If incorrect, try easier difficulty first
    for (let d = currentDifficultyIdx - 1; d >= 0; d--) {
      const candidates = questions
        .map((q, idx) => ({ q, idx }))
        .filter(({ q }) => q.difficulty === (difficultyOrder[d] as any) && questions.indexOf(q) !== currentIndex);
      if (candidates.length > 0) return candidates[0].idx;
    }
  }

  // fallback to next sequential or loop to start
  if (currentIndex < questions.length - 1) return currentIndex + 1;
  return 0;
}
