/**
 * The site is written against React's API and runs on Preact (preact/compat):
 * the same components at a fraction of the size (about 9 KB against React's 60
 * KB, compressed). Vite and Vitest both resolve React imports through these.
 */
export const PREACT_ALIAS = [
    { find: /^react-dom\/client$/, replacement: "preact/compat/client" },
    { find: /^react-dom\/server$/, replacement: "preact/compat/server" },
    { find: /^react-dom\/test-utils$/, replacement: "preact/test-utils" },
    { find: /^react-dom$/, replacement: "preact/compat" },
    { find: /^react\/jsx-runtime$/, replacement: "preact/jsx-runtime" },
    { find: /^react\/jsx-dev-runtime$/, replacement: "preact/jsx-dev-runtime" },
    { find: /^react$/, replacement: "preact/compat" },
];
