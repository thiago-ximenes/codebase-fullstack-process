import { defineStore } from "pinia";
import type { MetricsType } from "@/types/metrics.type";

export const useMetricsStore = defineStore('metrics', () => {
  const metrics = {} as MetricsType;

  const setMetrics = (newMetrics: MetricsType) => {
    Object.assign(metrics, newMetrics);
  }

  return { metrics, setMetrics };
})
