import React, { DragEvent, KeyboardEvent, ReactElement, useMemo, useState } from 'react';

import { IStage } from 'src/interfaces';

import { useListStore } from '../../store';
import { deleteCard, createCard, updateCard, moveCard } from '../../store/cardActions';

import styles from './board.module.css';

export function Board() {
  const listStore = useListStore();

  const [selectedCard, setSelectedCard] = useState<{ id: string; text: string } | null>(null);

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onDragStart = (event: DragEvent<HTMLDivElement>, id: string, currListId: string) => {
    event.dataTransfer.setData('id', id);
    event.dataTransfer.setData('currListId', currListId);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>, nextListState: IStage) => {
    const id = event.dataTransfer.getData('id');
    const currListId = event.dataTransfer.getData('currListId');

    moveCard(id, currListId, nextListState);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value;

    if (event.key == 'Enter' && value != '') {
      createCard(value);
      element.value = '';
    }
  };

  const handleUpdate = (event: KeyboardEvent<HTMLInputElement>) => {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value;

    if (event.key == 'Enter' && selectedCard != null) {
      updateCard(selectedCard.id, value);
      setSelectedCard(null);
    }
  };

  const renderer = useMemo(() => {
    const stages: { [key in IStage]: ReactElement[] } = {
      Open: [],
      Confirmed: [],
      'False Positive': [],
      Fixed: [],
    };

    listStore.items.forEach((list) => {
      list.cards.forEach((card) => {
        stages[list.title].push(
          <div
            className={styles.itemContainer}
            key={card.id}
            draggable
            onDragStart={(e) => onDragStart(e, card.id, list.id)}
          >
            <div>
              <h5>{card.text}</h5>
              <p>{card.note}</p>

              {card.updatedAt && <p>{card.updatedAt}</p>}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button className="mr-1" onClick={() => setSelectedCard({ id: card.id, text: card.text })}>
                edit
              </button>
              <button onClick={() => deleteCard(card.id)}>del</button>
            </div>
          </div>
        );
      });
    });

    return stages;
  }, [listStore.items]);

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.dropArea} onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'Open')}>
          <h4>Open</h4>
          {renderer.Open}
        </div>

        <div className={styles.dropArea} onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'Confirmed')}>
          <h4>Confirmed</h4>
          {renderer.Confirmed}
        </div>

        <div className={styles.dropArea} onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'False Positive')}>
          <h4>False Positive</h4>
          {renderer['False Positive']}
        </div>

        <div className={styles.dropArea} onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'Fixed')}>
          <h4>Fixed</h4>
          {renderer.Fixed}
        </div>
      </div>

      <div>
        <input
          onKeyPress={handleKeyPress}
          className={styles.input}
          type="text"
          placeholder="type something and enter to create"
        />

        {selectedCard?.id && (
          <input
            value={selectedCard.text}
            onChange={(e) => setSelectedCard({ ...selectedCard, text: e.currentTarget.value })}
            onKeyPress={handleUpdate}
            className={styles.input}
            type="text"
          />
        )}
      </div>
    </div>
  );
}
