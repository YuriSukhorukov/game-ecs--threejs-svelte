import { writable } from "svelte/store";

interface GameSettingsStore {
  betAmountChangeStep: number | null;
  betAmountMultiplierMin: number | null;
  betAmountMultiplierMax: number | null;
  bombsAmountChangeStep: number | null;
  bombsAmountDefault: number | null;
  // bombsAmountIndexDefault: number | null
  // bombsAmounts: Array<number> | null
  bombsAmountMax: number | null;
  bombsAmountMin: number | null;
  deskSize: number | null;
}

const initGameSettingsStore: GameSettingsStore = {
  betAmountChangeStep: null,
  betAmountMultiplierMin: null,
  betAmountMultiplierMax: null,
  bombsAmountChangeStep: null,
  bombsAmountDefault: null,
  // bombsAmountIndexDefault: 0,
  // bombsAmounts: [3, 5, 10, 20],
  bombsAmountMax: null,
  bombsAmountMin: null,
  deskSize: null,
};

export const gameSettingsState = writable(initGameSettingsStore);

export const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export const gameSettingsGet = async () => {
  try {
    const result = await fetch(`${BASE_URL}/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = (await result.json())?.results[0];

    gameSettingsState.update(() => ({
      betAmountChangeStep: json?.bet_amount_change_step,
      betAmountMultiplierMin: json?.bet_amount_multiplier_min,
      betAmountMultiplierMax: json?.bet_amount_multiplier_max,
      bombsAmountChangeStep: json?.bombs_amount_change_step,
      bombsAmountDefault: json?.bombs_amount_default,
      bombsAmountMax: json?.bombs_amount_max,
      bombsAmountMin: json?.bombs_amount_min,
      deskSize: json?.desk_size,
    }));

    return json;
  } catch (e) {
    console.log(e);
  }
};
