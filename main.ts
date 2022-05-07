import { marked } from "marked";
import md2bbc from "md2bbc";
import { Plugin } from "obsidian";

export default class BBCode extends Plugin {
	async onload() {
		this.addCommand({
			id: "copy-to-bbcode",
			name: "Convert to BBCode & Copy to Clipboard",
			editorCallback: (editor, view) => {
				const value = editor.getValue();
				const tagless = value.replace(
					/\[\[((.*?)\|)*?([^|]*?)\]\]/g,
					"$3"
				);

				const bbcode = marked(tagless, {
					renderer: new md2bbc(),
				});

				navigator.clipboard.writeText(bbcode);
			},
		});
	}
}
