import React, { DragEvent, KeyboardEvent, ReactElement, useState } from 'react';

import { setError } from 'src/store';

import styles from './board.module.css';

type IStage = 'Open' | 'Confirmed' | 'False Positive' | 'Fixed';

export const isValidToTransit = (currStage: IStage, nextState: IStage) => {
  if (currStage === 'Open') {
    return true;
  }

  if (currStage === 'Confirmed' && nextState === 'Fixed') {
    return true;
  }

  return false;
};

export function Board() {
  const [tasks, setTasks] = useState<{ id: string; name: string; category: IStage }[]>([
    { id: '1', name: 'Task 1', category: 'Open' },
  ]);

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onDragStart = (event: DragEvent<HTMLDivElement>, name: string) => {
    event.dataTransfer.setData('id', name);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>, nextCategory: IStage) => {
    const id = event.dataTransfer.getData('id');
    let isTransited = false;

    let nextTasks = tasks.filter((task) => {
      if (task.name === id) {
        if (isValidToTransit(task.category, nextCategory)) {
          isTransited = true;
          task.category = nextCategory;
        } else {
          setError(`Cannot transit from ${task.category} to ${nextCategory}`);
        }
      }

      return task;
    });

    if (isTransited) {
      setTasks(nextTasks);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value;

    if (event.key == 'Enter' && value != '') {
      setTasks([...tasks, { id: 'value', name: value, category: 'Open' }]);
      element.value = '';
    }
  };

  const stages: { [key in IStage]: ReactElement[] } = { Open: [], Confirmed: [], 'False Positive': [], Fixed: [] };

  tasks.forEach((task) => {
    stages[task.category].push(
      <div className={styles.itemContainer} key={task.name} draggable onDragStart={(e) => onDragStart(e, task.name)}>
        {task.name}
      </div>
    );
  });

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.dropArea} onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'Open')}>
          <h4>Open</h4>
          {stages.Open}
        </div>

        <div className={styles.dropArea} onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'Confirmed')}>
          <h4>Confirmed</h4>
          {stages.Confirmed}
        </div>

        <div className={styles.dropArea} onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'False Positive')}>
          <h4>False Positive</h4>
          {stages['False Positive']}
        </div>

        <div className={styles.dropArea} onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'Fixed')}>
          <h4>Fixed</h4>
          {stages.Fixed}
        </div>
      </div>

      <div>
        <input onKeyPress={handleKeyPress} className={styles.input} type="text" placeholder="type something" />
      </div>
    </div>
  );
}
