import React, { useEffect, useState, useCallback, ChangeEvent } from 'react';

import {
  useRepoStore,
  useFetchRepos,
  setCurrentRepo,
  updateCurrentRepo,
  createNewRepo,
  deleteCurrentRepo,
} from '../../store';

export function Repo() {
  const { items, selectedItem, loading, error, selectedItemId } = useRepoStore();

  const [currentName, setCurrentName] = useState<string>('');
  const [newRepoName, setNewRepoName] = useState<string>('');

  useFetchRepos();

  useEffect(() => {
    if (selectedItem?.name) {
      setCurrentName(selectedItem?.name);
    }
  }, [selectedItem?.name]);

  useEffect(() => {
    setNewRepoName('');
  }, [items]);

  const handleEditChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentName(event.target.value);
  };

  const handleNewChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewRepoName(event.target.value);
  };

  const handleUpdate = () => {
    const isValidToUpdate = currentName && currentName.length > 0 && currentName !== selectedItem?.name;

    if (isValidToUpdate) {
      updateCurrentRepo(currentName);
    }
  };

  const handleCreate = () => {
    const isValidToCreate = newRepoName && newRepoName.length > 0;

    if (isValidToCreate) {
      createNewRepo(newRepoName);
    }
  };

  const handleSelectRepoChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentRepo(event.target.value);
  };

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      {items.length > 0 && (
        <div className="wrapper mb-1">
          <div>
            <select name="repo" value={selectedItemId} onChange={handleSelectRepoChange} className="mr-1">
              {items.map((repo) => (
                <option key={repo.id} value={repo.id}>
                  {repo.name}
                </option>
              ))}
            </select>

            <button onClick={deleteCurrentRepo}>delete current repo</button>
          </div>

          <div>
            <input className="mr-1" value={currentName} onChange={handleEditChange} />
            <button onClick={handleUpdate}>update current repo</button>
          </div>
        </div>
      )}

      <div className="wrapper">
        <div />

        <div>
          <input className="mr-1" value={newRepoName} onChange={handleNewChange} />
          <button onClick={handleCreate}>create new repo</button>
        </div>
      </div>

      <style jsx>{`
        .container {
          padding: 1rem;
          margin-bottom: 1rem;
          border: 2px solid #ccc;
        }

        .wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        input {
          width: 15rem;
        }

        button {
          width: 10rem;
        }
      `}</style>
    </div>
  );
}
