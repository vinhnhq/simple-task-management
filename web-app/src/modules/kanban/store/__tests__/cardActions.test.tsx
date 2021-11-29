import { StrictMode } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import { IStage } from 'src/interfaces';

import { useRepoStore } from '../index';
import { setCurrentRepo } from '../repoActions';
import { isValidToTransit } from '../cardActions';

describe('cardActions', () => {
  test('isValidToTransit', () => {
    const currStageInputs: IStage[] = ['Fixed', 'Open', 'Confirmed', 'False Positive'];
    const nextStageInputs: IStage[] = ['Open', 'Confirmed', 'False Positive', 'Fixed'];

    const outputs = [false, true, false, false];

    for (let i = 0; i < currStageInputs.length; i++) {
      expect(isValidToTransit(currStageInputs[i], nextStageInputs[i])).toBe(outputs[i]);
    }
  });
});

describe('store', () => {
  test('setCurrentRepo', async () => {
    const Comp = () => {
      const snap = useRepoStore();

      return (
        <div>
          <div>id: {snap.selectedItemId}</div>
          <button onClick={() => setCurrentRepo('1')}>button</button>
        </div>
      );
    };

    render(
      <StrictMode>
        <Comp />
      </StrictMode>
    );

    await screen.findByText('id:');

    fireEvent.click(screen.getByText('button'));
    await screen.findByText('id:');
  });
});
