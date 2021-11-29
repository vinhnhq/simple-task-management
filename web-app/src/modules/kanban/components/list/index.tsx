import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';

import { Board } from './board';

import { useListStore, useRepoStore, fetchLists } from '../../store';

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
    return <div>please select a repo to continue</div>;
  }

  return (
    <div className="container">
      {listStore.items.length > 0 && (
        <div className="wrapper mb-1">
          <div>
            <select name="list" value={listStore.selectedItemId} className="mr-1">
              {listStore.items.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

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
