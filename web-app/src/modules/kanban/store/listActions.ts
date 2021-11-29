import { kanban } from 'src/api';

import { store } from './index';

export async function fetchLists() {
  if (!store.repo.selectedItemId) {
    return;
  }

  try {
    store.list.loading = true;

    const response = await kanban.getAllLists(store.repo.selectedItemId);
    store.list.items = response.parsedBody?.lists || [];
  } catch (error) {
    if (error instanceof Error) {
      store.list.error = error.message;
    }
  } finally {
    store.list.loading = false;
  }
}
