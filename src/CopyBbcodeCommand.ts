import type BBCodePlugin from "main";
import { marked } from "marked";
import md2bbc from "md2bbc";
import { Command, Editor, MarkdownView } from "obsidian";
import { DEFAULT_TEMPLATE } from "./utils/constants";

const tagRegex = /\[\[((.*?)\|)*?([^|]*?)\]\]/g;
const replaceRegex = /{note(\[.+?\])?}/g;

export class CopyBbcodeCommand implements Command {
	id = "copy-to-bbcode";
	name = "Convert to BBCode & Copy to Clipboard";

	plugin: BBCodePlugin;

	constructor(plugin: BBCodePlugin) {
		this.plugin = plugin;
	}

	editorCallback(editor: Editor, view: MarkdownView) {
		const value = this.getValue(editor);
		const tagless = value.replace(tagRegex, "$3");
		const templatedBbcode = this.findTemplate(view.file.path).replace(
			replaceRegex,
			(_, slice: string) => {
				if (!slice) return this.toBBCode(tagless);
				const range = slice.slice(1, -1);

				const rangeAsInt = parseInt(range, 10);
				if (!slice.includes(":") && !isNaN(rangeAsInt)) {
					// single char, no need to wrap in divs
					return tagless[rangeAsInt];
				}

				const [start, end] = range
					.split(":")
					.map((x) => (x ? parseInt(x, 10) : null));

				if (start && !end) {
					return this.toBBCode(tagless.slice(start));
				} else if (!start && end) {
					return this.toBBCode(tagless.slice(undefined, end));
				} else if (start && end) {
					return this.toBBCode(tagless.slice(start, end));
				} else {
					return this.toBBCode(tagless);
				}
			}
		);
		navigator.clipboard.writeText(templatedBbcode);
	}

	private getValue(editor: Editor) {
		return editor.somethingSelected()
			? editor.getSelection()
			: editor.getValue();
	}

	private findTemplate(path: string) {
		const template =
			this.plugin.settings.customTemplates.find((template) =>
				path.startsWith(template.pattern)
			)?.template ?? this.plugin.settings.containerTemplate;

		return template === "" ? DEFAULT_TEMPLATE : template;
	}

	private toBBCode(value: string) {
		return marked(value, { renderer: new md2bbc() });
	}
}
