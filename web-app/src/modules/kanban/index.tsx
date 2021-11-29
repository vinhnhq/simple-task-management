import React from 'react';

import { Repo } from './components/repo';
import { List } from './components/list';

export function Kanban() {
  return (
    <div>
      <h4>Kanban Board</h4>

      <Repo />
      <List />
    </div>
  );
}
