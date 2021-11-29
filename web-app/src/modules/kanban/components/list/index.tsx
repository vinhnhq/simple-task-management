import React, { useEffect } from 'react';

import { Board } from './board';

import { useListStore, useRepoStore } from '../../store';
import { fetchLists } from '../../store/listActions';

export function List() {
  const repoStore = useRepoStore();
  const listStore = useListStore();

  useEffect(() => {
    fetchLists();
  }, [repoStore.selectedItemId]);

  if (listStore.loading) {
    return <div>loading...</div>;
  }

  if (listStore.error) {
    return <div>{listStore.error}</div>;
  }

  if (!repoStore.selectedItemId) {
    return <div>please create a repo for working on</div>;
  }

  return (
    <div className="container">
      <p>{`you are working on ${repoStore.selectedItem?.name}`}</p>

      <Board />

      <style jsx>{`
        .container {
          padding: 1rem;
          border: 2px solid #ccc;
        }

        .wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}
