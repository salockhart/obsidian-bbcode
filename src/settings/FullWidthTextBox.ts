import { Notice, Setting, setIcon } from "obsidian";

export function addFullWidthTextBox(
	setting: Setting,
	cb: (fullWidthTextBox: FullWidthTextBox) => void
) {
	const fullWidthTextBox = new FullWidthTextBox(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		setting.settingEl.parentElement!
	);
	cb(fullWidthTextBox);
}

class FullWidthTextBox {
	inputContainerEl!: HTMLDivElement;
	inputEl!: HTMLTextAreaElement;
	copyEl!: HTMLDivElement;
	copyIconEl!: HTMLSpanElement;

	constructor(public containerEl: HTMLElement) {
		this.display();
	}

	display() {
		const settingEl = this.containerEl.createDiv();

		this.inputContainerEl = settingEl.createDiv("bbcode relative");
		this.inputContainerEl.onmouseover = () => {
			if (this.getValue().trim() != "") {
				this.copyEl.removeClass("hidden");
			}
		};
		this.inputContainerEl.onmouseleave = () => {
			this.copyEl.addClass("hidden");
		};
		this.inputEl = this.inputContainerEl.createEl("textarea", {
			cls: "bbcode-settings min-h-40 w-full",
		});
		this.inputEl.spellcheck = false;

		this.copyEl = this.inputContainerEl.createDiv({
			cls: "bbcode-settings absolute top-3 right-3 hidden",
			attr: { "aria-label": "copy" },
		});
		this.copyIconEl = this.copyEl.createSpan();
		setIcon(this.copyIconEl, "clipboard");
		this.copyIconEl.onclick = () => {
			this.handleCopy(this.copyIconEl);
		};
	}

	setPlaceholder(placeholder: string): this {
		this.inputEl.placeholder = placeholder;
		return this;
	}

	getValue(): string {
		return this.inputEl.value;
	}

	setValue(value: string): this {
		this.inputEl.value = value;
		return this;
	}

	onChange(cb: (value: string) => void): this {
		this.inputEl.oninput = () => {
			cb(this.getValue());
		};
		return this;
	}

	handleCopy(copyEl: HTMLSpanElement) {
		navigator.clipboard.writeText(this.getValue()).then(
			() => {
				setIcon(copyEl, "clipboard-check");
				setTimeout(() => {
					setIcon(copyEl, "clipboard");
				}, 1500);
			},
			() => {
				new Notice("Failed to copy to clipboard");
			}
		);
	}
}
