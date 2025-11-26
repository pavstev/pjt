/**
 * Performance monitoring utilities
 */

import { measureExecutionTime } from "./utils";

export type PerformanceMonitor = {
  measure: <T>(name: string, fn: () => T) => T;
  recordMetric: (name: string, value: number) => void;
  getAverage: (name: string) => number;
  getMetrics: () => Record<
    string,
    { count: number; average: number; min: number; max: number }
  >;
};

/**
 * Create a performance monitor
 */
export const createPerformanceMonitor = (): PerformanceMonitor => {
  const metrics: Map<string, number[]> = new Map();

  const recordMetric = (name: string, value: number): void => {
    let values = metrics.get(name);
    if (!values) {
      values = [];
      metrics.set(name, values);
    }

    values.push(value);
  };

  const getAverage = (name: string): number => {
    const values = metrics.get(name);
    if (!values || values.length === 0) return 0;

    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  return {
    measure: <T>(name: string, fn: () => T): T => {
      const { result, duration } = measureExecutionTime(fn);
      recordMetric(name, duration);
      return result;
    },

    recordMetric,

    getAverage,

    getMetrics: (): Record<
      string,
      { count: number; average: number; min: number; max: number }
    > => {
      const result: Record<
        string,
        { count: number; average: number; min: number; max: number }
      > = {};
      for (const [name, values] of metrics) {
        result[name] = {
          count: values.length,
          average: getAverage(name),
          min: Math.min(...values),
          max: Math.max(...values),
        };
      }
      return result;
    },
  };
};
