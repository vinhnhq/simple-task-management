import { useEffect } from 'react';

import { kanban } from 'src/api';

import { store } from './index';

export async function fetchRepos() {
  try {
    store.repo.loading = true;

    const response = await kanban.getAllRepos();
    store.repo.items = response.parsedBody?.repos || [];

    if (!store.repo.selectedItemId && store.repo.items.length > 0) {
      store.repo.selectedItemId = store.repo.items[0].id;
    }
  } catch (error) {
    if (error instanceof Error) {
      store.repo.error = error.message;
    }
  } finally {
    store.repo.loading = false;
  }
}

export function setCurrentRepo(id: string) {
  store.repo.selectedItemId = store.repo.items.find((repo) => repo.id === id)?.id;
}

export function useFetchRepos() {
  useEffect(() => {
    fetchRepos();
  }, []);
}

export async function updateCurrentRepo(name: string) {
  if (!store.repo.selectedItemId) {
    return;
  }

  try {
    store.repo.loading = true;

    const response = await kanban.editRepo({ id: store.repo.selectedItemId, name });
    if (response) {
      const repo = store.repo.items.find((repo) => repo.id === store.repo.selectedItemId);
      if (repo) {
        repo.name = name;
        store.repo.selectedItemId = repo.id;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      store.repo.error = error.message;
    }
  } finally {
    store.repo.loading = false;
  }
}

// create new repo and create 4 default stages to keep cards organized later
export async function createNewRepo(name: string) {
  try {
    store.repo.loading = true;

    const response = await kanban.createRepo({ name });
    if (response.parsedBody) {
      await kanban.createList({ repoId: response.parsedBody.id, title: 'Open' });
      await kanban.createList({ repoId: response.parsedBody.id, title: 'Confirmed' });
      await kanban.createList({ repoId: response.parsedBody.id, title: 'False Positive' });
      await kanban.createList({ repoId: response.parsedBody.id, title: 'Fixed' });

      const currRepoResponse = await kanban.getRepoById(response.parsedBody.id);

      if (currRepoResponse.parsedBody) {
        store.repo.items.push(currRepoResponse.parsedBody);

        if (!store.repo.selectedItemId) {
          store.repo.selectedItemId = currRepoResponse.parsedBody.id;
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      store.repo.error = error.message;
    }
  } finally {
    store.repo.loading = false;
  }
}

export async function deleteCurrentRepo() {
  if (!store.repo.selectedItemId) {
    return;
  }

  try {
    store.repo.loading = true;

    const response = await kanban.deleteRepo(store.repo.selectedItemId);
    if (response.ok) {
      const newRepos = store.repo.items.filter((repo) => repo.id !== store.repo.selectedItemId);

      store.repo.items = newRepos;
      store.repo.selectedItemId = undefined;

      if (newRepos.length > 0) {
        store.repo.selectedItemId = newRepos[0].id;
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      store.repo.error = error.message;
    }
  } finally {
    store.repo.loading = false;
  }
}
