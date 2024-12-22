import store, { rootReducer, RootState } from '../services/store';
import { expect, test, describe, jest } from '@jest/globals';

describe('rootReducer initiale', () => {
  it('should initiate the state correctly', () => {
    const initAction = { type: '@@INIT' };
    const initialState = store.getState();
    const state = rootReducer(undefined, initAction);
    expect(state).toEqual(initialState);
  });
});
