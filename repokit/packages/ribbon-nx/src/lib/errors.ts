export type Result<T> = RibbonError | T;

export class RibbonError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "RibbonError";
  }
}
