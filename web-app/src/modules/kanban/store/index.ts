import { derive } from 'valtio/utils';
import { proxy, useSnapshot } from 'valtio';

import { IList, IRepo } from 'src/interfaces';

export const store = proxy<{
  repo: {
    items: IRepo[];
    selectedItemId?: string;
    loading: boolean;
    error: string | null;
  };
  list: {
    items: IList[];
    selectedItemId?: string;
    loading: boolean;
    error: string | null;
  };
  card: {
    loading: boolean;
    error: string | null;
  };
}>({
  repo: {
    items: [],
    selectedItemId: undefined,
    loading: false,
    error: null,
  },
  list: {
    items: [],
    loading: false,
    error: null,
  },
  card: {
    loading: false,
    error: null,
  },
});

const derivedRepo = derive(
  {
    selectedItem: (get) => {
      if (get(store.repo).items.length === 0) {
        return null;
      }

      return get(store.repo).items.find((item) => item.id === get(store).repo.selectedItemId);
    },
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

export function useCardStore() {
  return useSnapshot(store.card);
}
