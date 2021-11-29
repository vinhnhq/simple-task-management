import { IRepo } from 'src/interfaces';
import { API_URL } from 'src/common/constants';

import { get, post, put, del } from './base';

export async function getAllRepos() {
  return get<{ repos: IRepo[] }>(`${API_URL}/repo`);
}

export async function getRepoById(id: string) {
  const path = `${API_URL}/repo/${id}`;
  return get(path);
}

export async function createRepo(payload: { name: string }) {
  const path = `${API_URL}/repo`;
  return post<IRepo>(path, payload);
}

export async function editRepo(payload: { id: string; name: string }) {
  const path = `${API_URL}/repo/${payload.id}`;
  return put<null>(path, payload);
}

export async function deleteRepo(id: string) {
  const path = `${API_URL}/repo/${id}`;
  return del<null>(path);
}

export async function getAllLists(repoId: string) {
  const path = `${API_URL}/repo/${repoId}/list`;
  return get(path);
}

export async function getListById(id: string) {
  const path = `${API_URL}/list/${id}`;
  return get(path);
}

export async function createList(payload: { title: string; repoId: string }) {
  const path = `${API_URL}/repo/${payload.repoId}/list`;
  const extendedOptions = {
    body: JSON.stringify({
      title: payload.title,
    }),
  };

  return post(path, extendedOptions);
}

export async function deleteList(id: string) {
  const path = `${API_URL}/list/${id}`;
  return del(path);
}

export async function editList(payload: { id: string; title: string }) {
  const path = `${API_URL}/list/${payload.id}`;
  const extendedOptions = { body: JSON.stringify(payload) };

  return put(path, extendedOptions);
}

export async function getAllCards(listId: string) {
  const path = `${API_URL}/list/${listId}/card`;
  return get(path);
}

export async function getCardById(id: string) {
  const path = `${API_URL}/card/${id}`;
  return get(path);
}

export async function createCard(payload: { text: string; listId: string }) {
  const path = `${API_URL}/list/${payload.listId}/card`;
  const extendedOptions = {
    body: JSON.stringify({
      text: payload.text,
    }),
  };

  return post(path, extendedOptions);
}

export async function editCard(payload: { id: string; text: string }) {
  const path = `${API_URL}/card/${payload.id}`;
  const extendedOptions = { body: JSON.stringify(payload) };

  return put(path, extendedOptions);
}

export async function deleteCard(id: string) {
  const path = `${API_URL}/card/${id}`;
  return del(path);
}
