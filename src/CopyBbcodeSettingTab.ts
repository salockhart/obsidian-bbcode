import type BBCodePlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { addFullWidthTextBox } from "./settings/FullWidthTextBox";
import { DEFAULT_TEMPLATE } from "./utils/constants";

export class CopyBbcodeSettingTab extends PluginSettingTab {
	plugin: BBCodePlugin;

	constructor(app: App, plugin: BBCodePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	async saveSettings() {
		await this.plugin.saveSettings();
	}

	async saveSettingsAndReload() {
		await this.plugin.saveSettings();
		this.display();
	}

	private moveElement<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
		const element = arr[fromIndex];
		const clone = [...arr];
		clone.splice(fromIndex, 1);
		clone.splice(toIndex, 0, element);
		return clone;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.addClass("bbcode-settings");

		new Setting(containerEl)
			.setName("Container Template")
			.setDesc(
				`Provide a template to wrap all converted notes with. Any occurrence ` +
					`of ${DEFAULT_TEMPLATE} will be replaced with the transformed content of your ` +
					`selection.`
			)
			.then((setting) =>
				addFullWidthTextBox(setting, (fullWidthTextBox) =>
					fullWidthTextBox
						.setPlaceholder(DEFAULT_TEMPLATE)
						.setValue(this.plugin.settings.containerTemplate)
						.onChange(async (value) => {
							this.plugin.settings.containerTemplate = value;
							await this.saveSettings();
						})
				)
			);

		new Setting(containerEl)
			.setName("Custom Templates")
			.setDesc(
				"Add custom templates to override the default for certain folders " +
					"or notes. A custom pattern will be used when it is a prefix of " +
					"the path to the current file. Please note that the first match " +
					"will be used."
			)
			.addButton((button) =>
				button.setIcon("plus").onClick(async () => {
					this.plugin.settings.customTemplates = [
						...this.plugin.settings.customTemplates,
						{ pattern: "", template: "" },
					];
					await this.saveSettingsAndReload();
				})
			);

		this.plugin.settings.customTemplates.forEach(
			({ pattern, template }, i) => {
				new Setting(containerEl)
					.addText((text) =>
						text
							.setPlaceholder("Pattern")
							.setValue(pattern)
							.onChange(async (value) => {
								this.plugin.settings.customTemplates[
									i
								].pattern = value;
								await this.saveSettings();
							})
					)
					.addButton((button) =>
						button
							.setButtonText("Move Up")
							.setIcon("chevron-up")
							.setDisabled(i === 0)
							.onClick(async () => {
								this.plugin.settings.customTemplates =
									this.moveElement(
										this.plugin.settings.customTemplates,
										i,
										i - 1
									);
								await this.saveSettingsAndReload();
							})
					)
					.addButton((button) =>
						button
							.setButtonText("Move Down")
							.setIcon("chevron-down")
							.setDisabled(
								i ===
									this.plugin.settings.customTemplates
										.length -
										1
							)
							.onClick(async () => {
								this.plugin.settings.customTemplates =
									this.moveElement(
										this.plugin.settings.customTemplates,
										i,
										i + 1
									);
								await this.saveSettingsAndReload();
							})
					)
					.addButton((button) =>
						button
							.setButtonText("Remove")
							.setIcon("trash")
							.onClick(async () => {
								this.plugin.settings.customTemplates =
									this.plugin.settings.customTemplates.filter(
										(_, index) => index !== i
									);
								await this.saveSettingsAndReload();
							})
					)
					.then((setting) =>
						addFullWidthTextBox(setting, (fullWidthTextBox) =>
							fullWidthTextBox
								.setPlaceholder(DEFAULT_TEMPLATE)
								.setValue(template)
								.onChange(async (value) => {
									this.plugin.settings.customTemplates[
										i
									].template = value;
									await this.saveSettings();
								})
						)
					);
			}
		);
	}
}
