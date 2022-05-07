import * as child_process from "child_process";
import { marked } from "marked";
import md2bbc from "md2bbc";
import { Plugin } from "obsidian";

function pbcopy(data: string) {
	const proc = child_process.spawn("pbcopy");
	proc.stdin.write(data);
	proc.stdin.end();
}

export default class BBCode extends Plugin {
	async onload() {
		this.addCommand({
			id: "convert-to-bbcode",
			name: "Convert to BBCode",
			editorCallback: (editor, view) => {
				const value = editor.getValue();
				const tagless = value.replace(
					/\[\[((.*?)\|)*?([^|]*?)\]\]/g,
					"$3"
				);
				pbcopy(
					marked(tagless, {
						renderer: new md2bbc(),
					})
				);
			},
		});
	}
}
