function injectCSS() {
  const style = document.createElement('style');
  style.textContent = `
    select, [role="listbox"], [role="menu"], [role="dialog"] {
      z-index: 2147483648 !important;
    }
  `;
  document.head.appendChild(style);
}

injectCSS();

let translateButton;
let selectedText; 

document.addEventListener('mouseup', () => {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    showTranslateButton(selection);
  } else {
    hideTranslateButton();
  }
});

function showTranslateButton(text) {
  selectedText = text; 
  if (!translateButton) {
    translateButton = document.createElement('div');
    translateButton.innerHTML = `
      <img src="${chrome.runtime.getURL('fathertranslator.png')}" alt="Translate" width="30" height="30">
    `;
    translateButton.className = 'translate-button';
    document.body.appendChild(translateButton);
    
    translateButton.addEventListener('click', () => {
      translateText(selectedText); 
    });
  }
  
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  const buttonRect = translateButton.getBoundingClientRect();
  const topPosition = window.scrollY + rect.top - buttonRect.height - 5;
  const leftPosition = window.scrollX + rect.left + (rect.width / 2) - (buttonRect.width / 2);

  translateButton.style.top = `${topPosition}px`;
  translateButton.style.left = `${leftPosition}px`;
  translateButton.style.display = 'block';
}

function hideTranslateButton() {
  if (translateButton) {
    translateButton.style.display = 'none';
  }
}

async function translateText(text) {
  chrome.storage.sync.get(['apiKey', 'apiHost', 'systemPrompt', 'targetLanguage', 'model'], async (settings) => {
    const apiKey = settings.apiKey;
    const apiHost = settings.apiHost || 'https://api.openai.com';
    const systemPrompt = settings.systemPrompt || 'You are a professional, authentic machine translation engine.';
    const targetLanguage = settings.targetLanguage || 'English';
    const model = settings.model || 'gpt-4o-mini';
    
    if (!apiKey) {
      alert('Please set your API key in the FatherTranslator options');
      return;
    }
    
    const translationBox = showTranslation('Translating...');
    
    try {
      const response = await fetch(`${apiHost}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model, 
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Translate the following source text to ${targetLanguage}. Output translation directly without any additional text.\nSource Text: ${text}\n\nTranslated Text:` }
          ],
          stream: true
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = '';
      let isFirstContent = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            const jsonData = JSON.parse(line.slice(6));
            const content = jsonData.choices[0].delta.content;
            if (content) {
              if (isFirstContent) {
                updateTranslation(translationBox, content, true);
                isFirstContent = false;
              } else {
                updateTranslation(translationBox, content);
              }
            }
          }
        }
      }
      const textElement = translationBox.querySelector('p');
      textElement.textContent = textElement.textContent.replace(/\.\.\.$/, '');
    } catch (error) {
      console.error('Translation error:', error);
      updateTranslation(translationBox, 'Translation failed. Please check your API key and try again.', true);
    }
  });
}

function showTranslation(initialText) {
  removeExistingTranslationBoxes();

  const translationBox = document.createElement('div');
  translationBox.className = 'translation-box';
  translationBox.innerHTML = `
    <div class="translation-header">
      <button class="close-button">&times;</button>
    </div>
    <p>${initialText}</p>
  `;
  
  chrome.storage.sync.get(['isDark'], (result) => {
    updateTranslationBoxTheme(translationBox, result.isDark);
  });
  
  document.body.appendChild(translationBox);
  
  const rect = translationBox.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  if (rect.bottom > viewportHeight) {
    translationBox.style.top = 'auto';
    translationBox.style.bottom = '10px';
  }
  
  if (rect.right > viewportWidth) {
    translationBox.style.left = 'auto';
    translationBox.style.right = '10px';
  }
  
  const closeButton = translationBox.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    document.body.removeChild(translationBox);
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && 'isDark' in changes) {
      updateTranslationBoxTheme(translationBox, changes.isDark.newValue);
    }
  });

  return translationBox;
}

function updateTranslationBoxTheme(translationBox, isDark) {
  if (isDark) {
    translationBox.classList.remove('light-mode');
    translationBox.classList.add('dark-mode');
  } else {
    translationBox.classList.remove('dark-mode');
    translationBox.classList.add('light-mode');
  }
}

function updateTranslation(translationBox, newContent, isReplacing = false) {
  const textElement = translationBox.querySelector('p');
  if (isReplacing) {
    textElement.textContent = newContent;
  } else {
    textElement.textContent = textElement.textContent.replace(/\.\.\.$/, '') + newContent + '...';
  }
}

function removeExistingTranslationBoxes() {
  const existingBoxes = document.querySelectorAll('.translation-box');
  existingBoxes.forEach(box => box.remove());
}