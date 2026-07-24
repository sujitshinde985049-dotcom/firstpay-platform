export class CircuitBreaker {
  private failures = 0;
  private openedAt?: number;
  constructor(
    private threshold = 5,
    private resetMs = 30000,
  ) {}
  canRequest(now = Date.now()) {
    if (this.openedAt === undefined) return true;
    if (now - this.openedAt >= this.resetMs) {
      this.reset();
      return true;
    }
    return false;
  }
  success() {
    this.reset();
  }
  failure(now = Date.now()) {
    this.failures += 1;
    if (this.failures >= this.threshold) this.openedAt = now;
  }
  get state() {
    return this.openedAt !== undefined
      ? "open"
      : this.failures
        ? "closed_degraded"
        : "closed";
  }
  private reset() {
    this.failures = 0;
    this.openedAt = undefined;
  }
}
