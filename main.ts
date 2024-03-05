import { Plugin } from "obsidian";
import { CopyBbcodeCommand } from "src/CopyBbcodeCommand";
import { CopyBbcodeSettingTab } from "src/CopyBbcodeSettingTab";
import { DEFAULT_TEMPLATE } from "src/utils/constants";

interface PluginSettings {
	containerTemplate: string;
	customTemplates: { pattern: string; template: string }[];
}

const DEFAULT_SETTINGS: Partial<PluginSettings> = {
	containerTemplate: DEFAULT_TEMPLATE,
	customTemplates: [],
};

export default class BBCodePlugin extends Plugin {
	settings!: PluginSettings;

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
