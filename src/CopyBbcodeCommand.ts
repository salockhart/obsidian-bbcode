import type BBCodePlugin from "main";
import { marked } from "marked";
import md2bbc from "md2bbc";
import { Command, Editor, MarkdownView } from "obsidian";
import { DEFAULT_TEMPLATE } from "./utils/constants";

export class CopyBbcodeCommand implements Command {
	id = "copy-to-bbcode";
	name = "Convert to BBCode & Copy to Clipboard";

	plugin: BBCodePlugin;

	constructor(plugin: BBCodePlugin) {
		this.plugin = plugin;
	}

	editorCallback(editor: Editor, view: MarkdownView) {
		const value = this.getValue(editor);
		const tagless = value.replace(/\[\[((.*?)\|)*?([^|]*?)\]\]/g, "$3");
		const bbcode = marked(tagless, { renderer: new md2bbc() });
		const templatedBbcode = this.findTemplate(view.file.path).replace(
			DEFAULT_TEMPLATE,
			bbcode
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
}
