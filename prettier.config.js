/**
 * Prettier Configuration
 * @see https://prettier.io/docs/en/options.html
 */
export default {
    /**
     * Indentation
     * @see https://prettier.io/docs/en/options.html#tabs
     *
     * tabWidth: 4
     *   - Number of spaces per indentation level
     *   - Matches common industry standard for readability
     *
     * useTabs: false
     *   - Use spaces for indentation (not tab characters)
     *   - Ensures consistent display across different editors and platforms
     */
    tabWidth: 4,
    useTabs: false,

    /**
     * Line Length
     * @see https://prettier.io/docs/en/options.html#print-width
     *
     * printWidth: 100
     *   - Wrap code lines longer than 100 characters
     *   - Balances readability vs. horizontal scrolling
     *   - Fits well on modern editor splits and mobile displays
     */
    printWidth: 100,

    /**
     * Quotes
     * @see https://prettier.io/docs/en/options.html#quotes
     *
     * singleQuote: false
     *   - Use double quotes for strings ("hello") instead of single quotes ('hello')
     *   - Matches common TypeScript/JavaScript conventions
     */
    singleQuote: false,

    /**
     * Semicolons
     * @see https://prettier.io/docs/en/options.html#semicolons
     *
     * semi: true
     *   - Automatically add semicolons at the end of statements
     *   - Prevents potential issues with ASI (Automatic Semicolon Insertion)
     */
    semi: true,

    /**
     * Trailing Commas
     * @see https://prettier.io/docs/en/options.html#trailing-commas
     *
     * trailingComma: "all"
     *   - Add trailing commas wherever possible
     *   - Applies to: arrays, objects, function parameters, etc.
     *   - Benefits:
     *     • Cleaner git diffs when adding/removing items (only 1 line changed vs. 2)
     *     • Reduces merge conflicts in multi-line collections
     */
    trailingComma: "all",

    /**
     * Bracket Spacing
     * @see https://prettier.io/docs/en/options.html#bracket-spacing
     *
     * bracketSpacing: true
     *   - Add spaces inside object literal braces
     *   - Format: { foo: bar } instead of {foo: bar}
     *   - Improves readability of object literals
     */
    bracketSpacing: true,

    /**
     * Arrow Function Parentheses
     * @see https://prettier.io/docs/en/options.html#arrow-function-parentheses
     *
     * arrowParens: "always"
     *   - Always wrap arrow function parameters in parentheses
     *   - Format: (x) => x instead of x => x
     *   - Consistency and clarity, easier to add/modify parameters later
     */
    arrowParens: "always",

    /**
     * Line Endings
     * @see https://prettier.io/docs/en/options.html#end-of-line
     *
     * endOfLine: "lf"
     *   - Use LF (Line Feed, Unix/Linux/macOS) line endings
     *   - Ensures consistent line endings across different OS platforms
     *   - Prevents CRLF (Windows) from being committed to version control
     */
    endOfLine: "lf",

    /**
     * Prose Wrapping
     * @see https://prettier.io/docs/en/options.html#prose-wrap
     *
     * proseWrap: "preserve"
     *   - Preserve existing line breaks in Markdown and text
     *   - Applies to: Markdown files, HTML comments, JSDoc blocks
     *   - Prevents unwanted reflowing of prose content
     */
    proseWrap: "preserve",

    /**
     * Embedded Language Formatting
     * @see https://prettier.io/docs/en/options.html#embedded-language-formatting
     *
     * embeddedLanguageFormatting: "auto"
     *   - Auto-format embedded languages where they appear
     *   - Examples:
     *     • CSS in CSS-in-JS (styled-components, emotion)
     *     • HTML in template literals
     *     • GraphQL in backticks
     *   - "auto" mode is smart: only formats if the tool can reliably parse it
     */
    embeddedLanguageFormatting: "auto",
};
