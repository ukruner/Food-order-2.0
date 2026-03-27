import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, afterAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";

const originalFetch = global.fetch;

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };

  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
  };

  HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return {
      width: 120,
      height: 48,
      top: 0,
      left: 0,
      right: 120,
      bottom: 48,
      x: 0,
      y: 0,
      toJSON() {
        return {};
      },
    };
  };
});

afterEach(() => {
  cleanup();
  if (vi.isFakeTimers()) {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  }
  vi.restoreAllMocks();
  if (originalFetch) {
    global.fetch = originalFetch;
  } else {
    delete global.fetch;
  }
  document.body.innerHTML = "";
});

afterAll(() => {
  if (originalFetch) {
    global.fetch = originalFetch;
  } else {
    delete global.fetch;
  }
});
