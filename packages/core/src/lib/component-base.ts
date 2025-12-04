/**
 * Base component interfaces and classes for shared functionality
 */

export type ComponentConfig = {
  name: string;
  version: string;
  dependencies: string[];
};

export type BaseComponent = {
  config: ComponentConfig;
  initialize(): Promise<void>;
  dispose(): void;
};
