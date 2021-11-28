import { useEffect } from 'react'
import { proxy, useSnapshot } from 'valtio'

import { kanban } from 'src/api'
import { IRepo } from 'src/interfaces'

const store = proxy<{
  repos: IRepo[]
  reposLoading: boolean
  currentRepo: IRepo | null
  reposError: string | null
}>({
  repos: [],
  reposLoading: false,
  reposError: null,
  currentRepo: null,
})

export function useStore() {
  return useSnapshot(store)
}

export async function fetchRepos() {
  try {
    store.reposLoading = true

    const response = await kanban.getAllRepos()
    store.repos = response.parsedBody?.repos || []

    if (store.currentRepo === null) {
      store.currentRepo = store.repos[0]
    }
  } catch (error) {
    if (error instanceof Error) {
      store.reposError = error.message
    }
  } finally {
    store.reposLoading = false
  }
}

export function setCurrentRepo(id: string) {
  store.currentRepo = store.repos.find((repo) => repo.id === id) || null
}

export function useFetchRepos() {
  useEffect(() => {
    fetchRepos()
  }, [])
}

export async function updateCurrentRepo(name: string) {
  if (store.currentRepo === null) {
    return
  }

  try {
    store.reposLoading = true

    const response = await kanban.editRepo({ id: store.currentRepo?.id, name })
    if (response) {
      const repo = store.repos.find((repo) => repo.id === store.currentRepo?.id)
      if (repo) {
        repo.name = name
        store.currentRepo = repo
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      store.reposError = error.message
    }
  } finally {
    store.reposLoading = false
  }
}

export async function createNewRepo(name: string) {
  try {
    store.reposLoading = true

    const response = await kanban.createRepo({ name })
    if (response.parsedBody) {
      store.repos.push(response.parsedBody)
    }
  } catch (error) {
    if (error instanceof Error) {
      store.reposError = error.message
    }
  } finally {
    store.reposLoading = false
  }
}

export async function deleteCurrentRepo() {
  if (store.currentRepo === null) {
    return
  }

  try {
    store.reposLoading = true

    const response = await kanban.deleteRepo(store.currentRepo?.id)
    if (response) {
      const newRepos = store.repos.filter((repo) => repo.id !== store.currentRepo?.id)
      store.repos = newRepos
      store.currentRepo = newRepos[0] || null
    }
  } catch (error) {
    if (error instanceof Error) {
      store.reposError = error.message
    }
  } finally {
    store.reposLoading = false
  }
}
