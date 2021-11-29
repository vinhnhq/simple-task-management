import { useEffect } from 'react';
import { derive } from 'valtio/utils';
import { proxy, useSnapshot } from 'valtio';

import { kanban } from 'src/api';
import { setInfo } from 'src/store';
import { IList, IRepo } from 'src/interfaces';

const store = proxy<{
  list: {
    items: IList[];
    selectedItemId?: string;
    loading: boolean;
    error: string | null;
  };
  repo: {
    items: IRepo[];
    selectedItemId?: string;
    loading: boolean;
    error: string | null;
  };
}>({
  list: {
    items: [],
    selectedItemId: undefined,
    loading: false,
    error: null,
  },
  repo: {
    items: [],
    selectedItemId: undefined,
    loading: false,
    error: null,
  },
});

const derivedRepo = derive(
  {
    selectedItem: (get) => get(store.repo).items.find((item) => item.id === get(store).list.selectedItemId),
  },
  {
    proxy: store.repo,
  }
);

export function useRepoStore() {
  return useSnapshot(derivedRepo);
}

export function useListStore() {
  return useSnapshot(store.list);
}

export async function fetchRepos() {
  try {
    store.repo.loading = true;

    const response = await kanban.getAllRepos();
    store.repo.items = response.parsedBody?.repos || [];

    if (store.repo.selectedItemId === null) {
      store.repo.selectedItemId = store.repo.items[0].id;
    }

    setInfo('Repos fetched');
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

export async function createNewRepo(name: string) {
  try {
    store.repo.loading = true;

    const response = await kanban.createRepo({ name });
    if (response.parsedBody) {
      store.repo.items.push(response.parsedBody);
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
      store.repo.selectedItemId = newRepos[0].id;
    }
  } catch (error) {
    if (error instanceof Error) {
      store.repo.error = error.message;
    }
  } finally {
    store.repo.loading = false;
  }
}
