import type { PaymentProviderAdapter } from "./provider-interface";
import type { PaymentProvider, ProviderCapability } from "./types";
export class ProviderRegistry {
  private adapters = new Map<PaymentProvider, PaymentProviderAdapter>();
  private enabled = new Set<PaymentProvider>();
  register(adapter: PaymentProviderAdapter, enabled = false) {
    this.adapters.set(adapter.config.provider, adapter);
    if (enabled) this.enabled.add(adapter.config.provider);
  }
  enable(p: PaymentProvider) {
    if (!this.adapters.has(p))
      throw new Error(`Provider ${p} is not registered.`);
    this.enabled.add(p);
  }
  disable(p: PaymentProvider) {
    this.enabled.delete(p);
  }
  get(p: PaymentProvider) {
    const a = this.adapters.get(p);
    if (!a) throw new Error(`Provider ${p} is not registered.`);
    return a;
  }
  isEnabled(p: PaymentProvider) {
    return this.enabled.has(p);
  }
  supports(p: PaymentProvider, c: ProviderCapability) {
    return this.isEnabled(p) && this.get(p).capabilities.has(c);
  }
  list() {
    return [...this.adapters.values()];
  }
}
