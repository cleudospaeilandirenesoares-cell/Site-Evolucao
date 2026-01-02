import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Quiz from '@/pages/Quiz';
import { storage } from '@/lib/storage';

describe('Quiz admin UI', () => {
  beforeEach(() => {
    localStorage.clear();
    storage.importData('{}');
    vi.setSystemTime(new Date('2026-01-02T12:00:00Z'));
  });

  it('allows adding, editing and deleting questions', async () => { // increased timeout if needed
    const user = userEvent.setup();
    render(<MemoryRouter><Quiz /></MemoryRouter>);

    // add
    await user.type(screen.getByLabelText(/Pergunta/i), 'Qual a cor do céu?');
    await user.type(screen.getByLabelText(/Opções/i), 'azul,verde');
    await user.click(screen.getByRole('button', { name: /Adicionar Pergunta/i }));

    // wait for the question to appear
    const addedQuestion = await screen.findByText(/Qual a cor do céu\?/i);
    expect(addedQuestion).toBeInTheDocument();

    // edit: choose the first Edit button (scoped to the added question)
    const editBtn = screen.getAllByRole('button', { name: /Editar/i })[0];
    await user.click(editBtn);

    const editInput = await screen.findByDisplayValue(/Qual a cor do céu\?/i);
    await user.clear(editInput);
    await user.type(editInput, 'Qual a cor do mar?');

    const saveBtn = await screen.findByRole('button', { name: /Salvar/i });
    await user.click(saveBtn);

    const editedQuestion = await screen.findByText(/Qual a cor do mar\?/i);
    expect(editedQuestion).toBeInTheDocument();

    // delete: find the delete button within the question's container for deterministic targeting
    let node = editedQuestion.closest('div');
    while (node && within(node).queryByRole('button', { name: /Excluir/i }) == null) {
      node = node.parentElement;
    }
    if (!node) throw new Error('Could not find container with delete button');
    const del = within(node).getByRole('button', { name: /Excluir/i });
    await user.click(del);

    await waitFor(() => expect(screen.queryByText(/Qual a cor do mar\?/i)).not.toBeInTheDocument(), { timeout: 10000 });
  });
});