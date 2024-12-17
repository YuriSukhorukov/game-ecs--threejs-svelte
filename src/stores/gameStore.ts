import { writable } from "svelte/store";

export enum GameMode {
  AUTO = "AUTO",
  MANUAL = "MANUAL",
}

interface GameState {
  mode: GameMode;
  betAmount: number | null;
  bombsAmount: number | null;
  info: Array<number> | null;
}

const initGameState: GameState = {
  mode: GameMode.MANUAL,
  betAmount: null,
  bombsAmount: null,
  info: null,
};

export const gameState = writable(initGameState);

export const setGameMode = (mode: GameMode) => {
  gameState.update((state) => ({ ...state, mode }));
};

export const addBetAmount = (step: number) => {
  gameState.update((state) => ({
    ...state,
    betAmount: isNaN(state.betAmount) ? step : state.betAmount + step,
  }));
};

export const subBetAmount = (step: number) => {
  gameState.update((state) => ({
    ...state,
    betAmount:
      !isNaN(state.betAmount) && state.betAmount - step >= 0
        ? state.betAmount - step
        : 0,
  }));
};

export const setMaxBetAmount = (amount: number) => {
  gameState.update((state) => ({ ...state, betAmount: amount }));
};

export const setMinBetAmount = (amount: number) => {
  gameState.update((state) => ({ ...state, betAmount: amount }));
};

export const setBetAmount = (amount: number) => {
  gameState.update((state) => ({ ...state, betAmount: amount }));
};

export const setBombsAmount = ({ amount }: { amount: number }) => {
  gameState.update((state) => ({
    ...state,
    bombsAmount: amount,
  }));
};

export const addBombsAmount = ({
  step,
  max,
}: {
  step: number;
  max: number;
}) => {
  gameState.update((state) => ({
    ...state,
    bombsAmount:
      state.bombsAmount + step <= max ? state.bombsAmount + step : max,
  }));
};

export const subBombsAmount = ({
  step,
  min,
}: {
  step: number;
  min: number;
}) => {
  gameState.update((state) => ({
    ...state,
    bombsAmount:
      state.bombsAmount - step >= min ? state.bombsAmount - step : min,
  }));
};
