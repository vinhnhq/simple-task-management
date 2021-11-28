import React, { useEffect, useState, useCallback, ChangeEvent } from 'react'

import {
  useStore,
  useFetchRepos,
  setCurrentRepo,
  updateCurrentRepo,
  createNewRepo,
  deleteCurrentRepo,
} from '../../store'

export function Repo() {
  const { repos, currentRepo, reposLoading, reposError } = useStore()

  const [currentName, setCurrentName] = useState<string>('')
  const [newRepoName, setNewRepoName] = useState<string>('')

  useFetchRepos()

  useEffect(() => {
    if (currentRepo?.name) {
      setCurrentName(currentRepo?.name)
    }
  }, [currentRepo?.name])

  useEffect(() => {
    setNewRepoName('')
  }, [repos])

  const handleEditChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCurrentName(event.target.value)
  }, [])

  const handleNewChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setNewRepoName(event.target.value)
  }, [])

  const handleUpdate = useCallback(() => {
    if (currentName) {
      updateCurrentRepo(currentName)
    }
  }, [currentName])

  const handleCreate = useCallback(() => {
    if (newRepoName && newRepoName?.length > 0) {
      createNewRepo(newRepoName)
    }
  }, [newRepoName])

  if (reposLoading) {
    return <div>Loading...</div>
  }

  if (reposError) {
    return <div>{reposError}</div>
  }

  return (
    <div className="container">
      {repos.length > 0 && (
        <div className="wrapper mb-1">
          <div>
            <select
              name="repo"
              value={currentRepo?.id}
              onChange={(event) => setCurrentRepo(event.target.value)}
              className="mr-1"
            >
              {repos.map((repo) => (
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

        .mr-1 {
          margin-right: 0.5em;
        }

        .mb-1 {
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  )
}
