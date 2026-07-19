import { create } from "zustand";

interface PredictionState {
  prediction: any | null;
  setPrediction: (data: any) => void;
  clearPrediction: () => void;
}

export const usePredictionStore = create<PredictionState>((set) => ({
  prediction: null,

  setPrediction: (data) =>
    set({
      prediction: data,
    }),

  clearPrediction: () =>
    set({
      prediction: null,
    }),
}));