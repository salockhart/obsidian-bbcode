import { Plugin } from "obsidian";
import { CopyBbcodeCommand } from "src/CopyBbcodeCommand";
import { CopyBbcodeSettingTab } from "src/CopyBbcodeSettingTab";

interface PluginSettings {
	containerTemplate: string;
}

const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	containerTemplate: "{note}",
};

export default class BBCodePlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new CopyBbcodeSettingTab(this.app, this));
		this.addCommand(new CopyBbcodeCommand(this));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
