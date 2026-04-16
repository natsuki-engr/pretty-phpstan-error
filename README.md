# pretty-phpstan-error

A VSCode extension that formats PHPStan error messages with Markdown styling on hover.

## Features

- Displays PHPStan errors in a readable, formatted tooltip when hovering over PHP code
- Highlights function names, method names, variable names, and PHPDoc tags as `inline code`
- Preserves the original error message structure while improving readability
- Falls back to the raw error message if parsing fails

## Requirements

- A PHPStan diagnostics provider (e.g. [phpstan-vscode](https://marketplace.visualstudio.com/items?itemName=SanderRonde.phpstan-vscode)) must be installed and active to supply diagnostics

## How It Works

When you hover over a PHP file, the extension checks for PHPStan diagnostics at the cursor position. It parses the error message using [phpstan-error-parser](https://www.npmjs.com/package/phpstan-error-parser) and renders key tokens — such as function names, method names, variables, and doc tags — as inline code in a Markdown tooltip.

## License

MIT
