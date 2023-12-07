import type BBCodePlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";

export class CopyBbcodeSettingTab extends PluginSettingTab {
	plugin: BBCodePlugin;

	constructor(app: App, plugin: BBCodePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Container Template")
			.setDesc(
				"Provide a template with which to wrap all of the notes. " +
					"Occurrences of `{note}` will be replaced with the note's content."
			)
			.addText((text) =>
				text
					.setPlaceholder("{note}")
					.setValue(this.plugin.settings.containerTemplate)
					.onChange(async (value) => {
						this.plugin.settings.containerTemplate = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
