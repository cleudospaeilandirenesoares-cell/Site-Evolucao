import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import StudyPage from '@/pages/Study';
import { storage } from '@/lib/storage';

describe('Study page (integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.importData('{}');
  });

  it('shows dynamic study stats derived from storage', () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];

    // Add sessions
    storage.addPomodoroSession({ focusTime: 25, breakTime: 5, sessionsCompleted: 1, totalTime: 30 });
    storage.addPomodoroSession({ focusTime: 45, breakTime: 10, sessionsCompleted: 1, totalTime: 45 });
    // yesterday
    // emulate a session with a manual date by directly pushing into storage for the test
    const session = storage.addPomodoroSession({ focusTime: 25, breakTime: 5, sessionsCompleted: 1, totalTime: 25 });
    // mutate date for that session to yesterday
    const all = storage.getPomodoroSessions();
    const idx = all.findIndex(s => s.id === session.id);
    (all[idx] as any).date = yStr;
    // Re-write storage for test
    storage.importData(JSON.stringify({ study: { pomodoroSessions: all, flashcards: [] } }));

    // Add flashcards due today
    storage.addFlashcard({ question: 'Q1', answer: 'A1', category: 'Geral', difficulty: 'medium' });
    storage.addFlashcard({ question: 'Q2', answer: 'A2', category: 'Geral', difficulty: 'medium' });

    render(<MemoryRouter><StudyPage /></MemoryRouter>);

    // time today: 30 + 45 = 75 => 1h 15m
    expect(screen.getByTestId('study-time-today')).toHaveTextContent('1h 15m');
    expect(screen.getByTestId('study-flashcards-due')).toHaveTextContent('2');
    expect(screen.getByTestId('study-streak')).toHaveTextContent('2');
    expect(screen.getByTestId('study-xp')).toHaveTextContent(/100 XP/);
  });

  it('flashcard selects are transparent and grouping works', async () => {
    const user = userEvent.setup();

    // add flashcards of different categories
    storage.addFlashcard({ question: 'A1', answer: 'a', category: 'A', difficulty: 'easy' });
    storage.addFlashcard({ question: 'A2', answer: 'a', category: 'A', difficulty: 'easy' });
    storage.addFlashcard({ question: 'B1', answer: 'b', category: 'B', difficulty: 'medium' });

    render(<MemoryRouter><StudyPage /></MemoryRouter>);

    const filter = screen.getByTestId('flashcard-filter-category') as HTMLSelectElement;
    expect(filter).toBeInTheDocument();
    expect(filter).toHaveClass('bg-transparent');

    // enable grouping
    const groupSelect = screen.getByTestId('flashcard-groupby') as HTMLSelectElement;
    await user.selectOptions(groupSelect, 'category');

    const groups = await screen.findByTestId('flashcard-groups');
    expect(groups).toBeInTheDocument();
    expect(screen.getByTestId('flashcard-group-A')).toHaveTextContent('A (2)');
    expect(screen.getByTestId('flashcard-group-B')).toHaveTextContent('B (1)');
  });

  it('library selects are transparent', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><StudyPage /></MemoryRouter>);

    const libFilter = screen.getByTestId('library-filter-select');
    expect(libFilter).toBeInTheDocument();
    expect(libFilter).toHaveClass('bg-transparent');

    // Open 'Adicionar Livro' form to reveal status select
    const newBookBtn = screen.getByRole('button', { name: /Adicionar Livro/i });
    await user.click(newBookBtn);

    const libStatus = await screen.findByTestId('library-status-select');
    expect(libStatus).toBeInTheDocument();
    expect(libStatus).toHaveClass('bg-transparent');
  });
});