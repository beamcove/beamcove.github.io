import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";

// Node 22+ exposes a non-functional `localStorage` global (requires
// `--localstorage-file`), which shadows jsdom's working implementation. Install
// an in-memory Storage polyfill so tests can rely on the real Web Storage API.
function createMemoryStorage(): Storage {
    const map = new Map<string, string>();
    return {
        get length() {
            return map.size;
        },
        clear: () => map.clear(),
        getItem: (key) => (map.has(key) ? map.get(key)! : null),
        key: (i) => Array.from(map.keys())[i] ?? null,
        removeItem: (key) => {
            map.delete(key);
        },
        setItem: (key, value) => {
            map.set(key, String(value));
        },
    };
}

const memoryLocalStorage = createMemoryStorage();
const memorySessionStorage = createMemoryStorage();

Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: memoryLocalStorage,
});
Object.defineProperty(window, "sessionStorage", {
    configurable: true,
    value: memorySessionStorage,
});

beforeEach(() => {
    memoryLocalStorage.clear();
    memorySessionStorage.clear();
});

afterEach(() => {
    cleanup();
});
