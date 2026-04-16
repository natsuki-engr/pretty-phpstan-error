import * as vscode from 'vscode';
import { parse } from 'phpstan-error-parser';

type Word = ReturnType<typeof parse>[number];

const INLINE_CODE_TYPES: ReadonlySet<string> = new Set([
	'function_name',
	'method_name',
	'variable_name',
	'doc_tag',
]);

function buildMarkdownMessage(message: string, words: Word[]): string {
	let result = '';
	let cursor = 0;

	for (const word of words) {
		const start = word.location.startColumn;
		const end = word.location.endColumn;

		// Preserve spaces between tokens from the original message
		if (start > cursor) {
			result += message.slice(cursor, start);
		}

		if (INLINE_CODE_TYPES.has(word.type)) {
			result += `\`${word.value}\``;
		} else {
			result += word.value;
		}

		cursor = end;
	}

	// Append any trailing content from the original message
	if (cursor < message.length) {
		result += message.slice(cursor);
	}

	return result;
}

function formatDiagnosticMessage(message: string): string {
	try {
		const words = parse(message);
		if (words.length === 0) {
			return message;
		}
		return buildMarkdownMessage(message, words);
	} catch {
		return message;
	}
}

export function activate(context: vscode.ExtensionContext) {
	const hoverProvider = vscode.languages.registerHoverProvider('php', {
		provideHover(document, position) {
			const diagnostics = vscode.languages.getDiagnostics(document.uri);

			const phpstanDiagnostics = diagnostics.filter(
				(d) =>
					d.range.contains(position) &&
					d.source?.toLowerCase().includes('phpstan')
			);

			if (phpstanDiagnostics.length === 0) {
				return undefined;
			}

			const contents = phpstanDiagnostics.map((d) => {
				const formatted = formatDiagnosticMessage(d.message);
				return new vscode.MarkdownString(formatted);
			});

			return new vscode.Hover(contents);
		},
	});

	context.subscriptions.push(hoverProvider);
}

export function deactivate() {}
