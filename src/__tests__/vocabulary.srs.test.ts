import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '@/lib/storage';

describe('Vocabulary SRS scheduling', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.importData('{}');
  });

  it('schedules next review on success and resets on failure', () => {
    const w = storage.addVocabularyWord({ word: 'Teste', definition: 'Def', exampleSentence: 'Ex', category: 'geral', difficulty: 'easy' });

    const ok = storage.markVocabularyReviewed(w.id, true);
    expect(ok).toBe(true);

    const after = storage.getVocabulary().find(x => x.id === w.id)!;
    expect(after.reviewCount).toBe(1);
    expect(after.nextReviewAt).toBeTruthy();
    expect(after.intervalDays).toBeGreaterThanOrEqual(1);

    // now mark as failed and ensure interval resets
    const ok2 = storage.markVocabularyReviewed(w.id, false);
    expect(ok2).toBe(true);
    const after2 = storage.getVocabulary().find(x => x.id === w.id)!;
    expect(after2.intervalDays).toBe(1);
  });
});