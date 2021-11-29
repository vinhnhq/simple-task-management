import { kanban } from 'src/api';
import { setError } from 'src/store';
import { IStage } from 'src/interfaces';

import { store } from './index';
import { fetchLists } from './listActions';

export async function deleteCard(cardId: string) {
  try {
    store.card.loading = true;

    const response = await kanban.deleteCard(cardId);
    if (response.ok) {
      for (let list of store.list.items) {
        const cardIndex = list.cards.findIndex((card) => card.id === cardId);
        if (cardIndex >= 0) {
          list.cards.splice(cardIndex, 1);
          break;
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      store.card.error = error.message;
    }
  } finally {
    store.card.loading = false;
  }
}

// assumes that the card is created will be added to the first list aka Open stage
export async function createCard(text: string) {
  const openListId = store.list.items.find((list) => list.title === 'Open')?.id;

  if (!openListId) {
    return;
  }

  try {
    store.card.loading = true;

    const response = await kanban.createCard({ listId: openListId, text });
    if (response.parsedBody) {
      for (let list of store.list.items) {
        if (list.id === openListId) {
          list.cards.push(response.parsedBody);
          break;
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      store.card.error = error.message;
    }
  } finally {
    store.card.loading = false;
  }
}

export async function updateCard(cardId: string, text: string) {
  try {
    store.card.loading = true;

    const response = await kanban.editCard({ id: cardId, text });
    if (response.ok) {
      for (let list of store.list.items) {
        for (let card of list.cards) {
          if (card.id === cardId) {
            card.text = text;
            break;
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      store.card.error = error.message;
    }
  } finally {
    store.card.loading = false;
  }
}

export const isValidToTransit = (currStage: IStage, nextState: IStage) => {
  if (currStage === 'Open') {
    return true;
  }

  if (currStage === 'Confirmed' && nextState === 'Fixed') {
    return true;
  }

  return false;
};

// assumes that the card will be removed and created in the next stage list because there are no api for moving cards
export async function moveCard(cardId: string, currListId: string, nextListStage: IStage) {
  try {
    store.card.loading = true;

    const currCard = store.list.items.find((list) => list.id === currListId)?.cards.find((card) => card.id === cardId);
    const currListTitle = store.list.items.find((list) => list.id === currListId)?.title;
    const nextList = store.list.items.find((list) => list.title === nextListStage);

    if (!currListTitle || !nextList?.title || !isValidToTransit(currListTitle, nextList.title)) {
      setError(`Cannot transit from ${currListTitle} to ${nextList?.title}`);
      return;
    }

    await kanban.deleteCard(cardId);
    await kanban.createCard({ listId: nextList.id, text: currCard?.text || '' });
    await fetchLists();
  } catch (error) {
    if (error instanceof Error) {
      store.card.error = error.message;
    }
  } finally {
    store.card.loading = false;
  }
}
