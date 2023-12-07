import type BBCodePlugin from "main";
import { marked } from "marked";
import md2bbc from "md2bbc";
import { Command, Editor } from "obsidian";

export class CopyBbcodeCommand implements Command {
	id = "copy-to-bbcode";
	name = "Convert to BBCode & Copy to Clipboard";

	plugin: BBCodePlugin;

	constructor(plugin: BBCodePlugin) {
		this.plugin = plugin;
	}

	editorCallback(editor: Editor) {
		const value = editor.getValue();
		const tagless = value.replace(/\[\[((.*?)\|)*?([^|]*?)\]\]/g, "$3");

		const bbcode = marked(tagless, {
			renderer: new md2bbc(),
		});

		const templatedBbcode = this.plugin.settings.containerTemplate.replace(
			"{note}",
			bbcode
		);

		navigator.clipboard.writeText(templatedBbcode);
	}
}
