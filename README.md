## Obsidian BBCode Converter

Converts your Markdown files to BBCode, for pasting into forums

#### Contributing

1. Clone this repo
2. Create a new test vault
3. Link this directory to the test vault's `.obsidian/plugins` directory: `ln -s `pwd` Test\ Vault/.obsidian/plugins/obsidian-bbcode`.
4. Build with `npm run dev`
5. When you're all done, commit your changes.

#### Releasing a New Version

Releases are handled by the **Release Obsidian plugin** GitHub Actions workflow. To cut a release:

1. Go to **Actions → Release Obsidian plugin → Run workflow** on GitHub.
2. Choose a bump type from the dropdown: `patch`, `minor`, or `major`.
3. Click **Run workflow**.

The workflow will run `npm version`, push the commit and tag, and create a draft GitHub release with the built assets attached. Publish the draft when you're ready.

#### Usage

1. Open a file in the Obsidian Editor
2. In the Command Palette, select "Convert to BBCode & Copy to Clipboard"
3. Done!

#### Attribution

Special thanks to:

-   [markedjs/marked](https://github.com/markedjs/marked)
-   [holi0317/md2bbc.js](https://github.com/holi0317/md2bbc.js)
