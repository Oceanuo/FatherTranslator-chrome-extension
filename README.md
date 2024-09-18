# OceanuoTranslate Extension

OceanuoTranslate is a browser extension that provides AI-powered translation functionality for selected text on web pages. It leverages advanced AI models to deliver accurate and efficient translations directly within your browser.

## 🚀 Getting Started

Follow these instructions to set up the extension on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed:

- [Google Chrome](https://www.google.com/chrome/) or any Chromium-based browser

### Installation

1. **Clone the repository**:
  You can clone the repository using git:
   ```bash
   git clone https://github.com/oceanuo/OceanuoTranslate-extension
   ```

2. **Download the zip**:
  You can also download the zip from [here](https://codeload.github.com/oceanuo/OceanuoTranslate-extension/zip/refs/heads/main)

3. **Load the extension in your browser**:
   - Open your browser and go to the extensions page (e.g., `chrome://extensions/` for Chrome).
   - Enable "Developer mode" by toggling the switch in the top right corner.
   - Click on "Load unpacked" and select the extension folder.

Then, reload the extension in your browser to see the changes.

## 📂 Project Structure

- **`content.js`**: Handles the logic for detecting selected text and triggering translations.
- **`background.js`**: Manages background tasks like context menu actions.
- **`popup.html`**: The settings interface for configuring API keys, target language, and other options.
- **`styles.css`**: Contains the styles for the translation button and translation box.
- **`manifest.json`**: Defines the extension's permissions, icons, and scripts.

## ✨ Features

- **AI-powered Translation**: Supports multiple AI models (OpenAI).
- **Dark Mode**: Seamless light/dark theme switching for the translation box.
- **Customizable Settings**: Adjust API keys, target language, and model parameters.
- **Context Menu Integration**: Right-click to translate selected text.
- **Keyboard Shortcuts**: Use `Alt + Shift + A` to quickly translate selected text.

## 🛠 Built With

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Core language for the extension.
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/) - For building browser extensions.
- [OpenAI API](https://openai.com/api/) - Provides the AI models for translation.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🙏 Acknowledgments

- **OpenAI** for providing the AI models.
- The **Chrome Extensions** team for their comprehensive API documentation.
