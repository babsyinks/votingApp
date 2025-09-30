import { store } from '../rootReducer';

describe('Redux store (rootReducer setup)', () => {
  it('should include expected state slices', () => {
    const state = store.getState();
    expect(state).toHaveProperty('loader');
    expect(state).toHaveProperty('userInfo');
    expect(state).toHaveProperty('userAuth');
    expect(state).toHaveProperty('timer');
    expect(state).toHaveProperty('election');
    expect(state).toHaveProperty('verificationStatus');
  });

  it('should allow redux-persist actions without error', () => {
    expect(() => {
      store.dispatch({ type: 'persist/PERSIST' });
    }).not.toThrow();
  });
});
