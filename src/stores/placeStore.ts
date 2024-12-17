import { writable } from "svelte/store";

export enum PLACE_STATUS {
  BOMB = 0,
  ITEM = 1,
  HIDDEN = 2,
}

interface Place {
  index: number;
  status: PLACE_STATUS;
  reward: string;
}

interface PlaceState {
  roundId: string | null;
  places: Record<number, Place>;
  creationIndex: number;
  reward: string | null;
  status: PLACE_STATUS | null;
}

const initPlaceState: PlaceState = {
  roundId: null,
  places: {},
  creationIndex: null,
  reward: null,
  status: null,
};

export const placeState = writable(initPlaceState);

export const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export const placeApi = {
  place: {
    create: async ({
      playerId,
      roundId,
      index,
    }: {
      playerId: string;
      roundId: string;
      index: number;
    }) => {
      try {
        const result = await fetch(
          `${BASE_URL}/players/${playerId}/rounds/${roundId}/places`,
          {
            method: "POST",
            body: JSON.stringify({
              round_id: roundId,
              index: index,
            }),
          },
        );
        const json = await result.json();
        console.log(json.results);

        !json.error &&
          placeState.update((state) => ({
            ...state,
            roundId: json.results[0].round_id,
            reward: json.results[0].reward,
            creationIndex: json.results[0].creation_index,
            status: json.results[0].status,
            places: {
              ...state.places,
              [json.results[0].index]: {
                status: json.results[0].status,
                index: json.results[0].index,
                reward: json.results[0].reward,
                // roundId: json.results[0].round_id,
              },
            },
          }));
        return json;
      } catch (e) {
        console.log(e);
      }
    },
    list: async ({
      playerId,
      roundId,
    }: {
      playerId: string;
      roundId: string;
    }) => {
      try {
        const result = await fetch(
          `${BASE_URL}/players/${playerId}/rounds/${roundId}/places`,
          {
            method: "GET",
          },
        );
        const json = await result.json();

        !json.error &&
          json.results?.length > 0 &&
          placeState.update((state) => ({
            ...state,
            roundId: json.results[0].round_id,
            reward: json.results[json.results.length - 1].reward,
            creationIndex: json.results[json.results.length - 1].creation_index,

            places: json.results?.reduce((prev, curr) => {
              return {
                ...prev,
                [curr?.index]: {
                  ...curr,
                },
              };
            }, {}),
          }));
        return json;
      } catch (e) {
        console.log(e);
      }
    },
    clear: () => {
      placeState.update(() => ({
        roundId: null,
        places: {},
        reward: null,
        creationIndex: null,
      }));
    },
  },
};
