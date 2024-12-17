import { get, writable } from "svelte/store";

// interface Place {
//   roundId: string
//   index: number
// }
export enum ROUND_STATUS {
  NOT_STARTED = "NOT_STARTED",
  STARTED = "STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
  // WIN = 'WIN',
  // LOSE = 'LOSE',
}
interface RoundState {
  id: string | null;
  active: boolean | null;
  betAmount: string | null;
  bombsAmount: number | null;
  status: ROUND_STATUS | null;
}

const initRoundState: RoundState = {
  id: null,
  active: null,
  betAmount: null,
  bombsAmount: null,
  status: ROUND_STATUS.NOT_STARTED,
};

export const roundState = writable(initRoundState);

export const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

export const roundStatusSet = ({ status }: { status: ROUND_STATUS }) => {
  roundState.update((state) => ({
    ...state,
    status,
  }));
};

export const roundApi = {
  // api: {
  rounds: {
    get: async ({ playerId }: { playerId: string } | undefined) => {
      try {
        const result = await fetch(`${BASE_URL}/players/${playerId}/rounds`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        const json = await result.json();

        !json?.error &&
          json?.results?.length > 0 &&
          roundState.update((state) => ({
            ...state,
            status: ROUND_STATUS.STARTED,
            active: json.results[0].active,
            id: json.results[0].id,
            betAmount: json.results[0].bet_amount,
            bombsAmount: json.results[0].bombs_amount,
          }));
        return json;
      } catch (e) {
        console.log(e);
      }
      return null;
    },
    create: async (data: {
      playerId: string;
      balanceId: string;
      betAmount: string;
      bombsAmount: string;
    }) => {
      try {
        const result = await fetch(
          `${BASE_URL}/players/${data?.playerId}/rounds`,
          {
            method: "POST",
            body: JSON.stringify({
              player_id: data.playerId,
              balance_id: data.balanceId,
              bet_amount: data.betAmount,
              bombs_amount: data.bombsAmount,
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        );

        const json = await result.json();

        !json.error &&
          json.results?.length > 0 &&
          roundState.update((state) => ({
            ...state,
            status: ROUND_STATUS.STARTED,
            id: json.results[0]?.id,
            active: json.results[0]?.active,
            betAmount: json.results[0]?.bet_amount,
            bombsAmount: json.results[0]?.bombs_amount,
          }));
        return json;
      } catch (e) {
        console.log(e);
      }
      return null;
    },
    cancel: async (params: { playerId: string; roundId: string }) => {
      try {
        const result = await fetch(
          `${BASE_URL}/players/${params.playerId}/rounds/${params.roundId}/cancel`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        );

        const json = await result.json();

        !json.error &&
          roundState.update((state) => ({
            ...state,
            status: ROUND_STATUS.NOT_STARTED,
            active: null,
            id: null,
            betAmount: null,
            bombsAmount: null,
          }));
        return null;
      } catch (e) {
        console.log(e);
      }
    },
    reset: () => {
      roundState.update((state) => ({
        ...state,
        status: ROUND_STATUS.NOT_STARTED,
        active: null,
        id: null,
        betAmount: null,
        bombsAmount: null,
      }));
    },
    cashOut: async (params: { playerId: string; roundId: string }) => {
      const result = await fetch(
        `${BASE_URL}/players/${params.playerId}/rounds/${params.roundId}/cash-out`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      const json = await result.json();

      !json.error &&
        roundState.update((state) => ({
          ...state,
          status: ROUND_STATUS.NOT_STARTED,
          active: null,
          id: null,
          betAmount: null,
          bombsAmount: null,
        }));
      return json.results;
    },
    places: {
      GET: async ({ round_id }: { round_id: string } | undefined) => {
        return null;
      },
      POST: async ({
        round_id,
        index,
      }: {
        round_id: string;
        index: number;
      }) => {
        return null;
      },
    },
  },
  // },
};

// export const methods = {
//   rounds: {
//     GET: async ({ round_id }: { round_id: string } | undefined) => {
//       return null
//     },
//     POST: async ({
//       betAmount,
//       bombsAmount,
//     }: {
//       betAmount: string
//       bombsAmount: number
//     }) => {
//       console.log(betAmount, bombsAmount)
//       return null
//     },
//     places: {
//       GET: async ({ round_id }: { round_id: string } | undefined) => {
//         return null
//       },
//       POST: async ({
//         round_id,
//         index,
//       }: {
//         round_id: string
//         index: number
//       }) => {
//         return null
//       },
//     },
//   },
// }

// export const roundGET = async () => {
//   return null
// }
// export const roundsGET = async () => {
//   return null
// }
// export const roundPOST = async () => {
//   return null
// }
// export const roundPlacePOST = async () => {
//   return null
// }
// export const roundCashOutPOST = async () => {
//   return null
// }
