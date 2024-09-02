document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const apiHostInput = document.getElementById('apiHost');
  const systemPromptInput = document.getElementById('systemPrompt');
  const targetLanguageInput = document.getElementById('targetLanguage');
  const themeModeToggle = document.getElementById('themeMode');
  const modelInput = document.getElementById('model'); 

  chrome.storage.sync.get(['apiKey', 'apiHost', 'systemPrompt', 'targetLanguage', 'isDark', 'model'], (result) => {
    apiKeyInput.value = result.apiKey || '';
    apiHostInput.value = result.apiHost || 'https://api.openai.com/v1';
    systemPromptInput.value = result.systemPrompt || 'You are a professional, authentic machine translation engine.';
    targetLanguageInput.value = result.targetLanguage || 'English';
    modelInput.value = result.model || 'gpt-4o-mini'; 
    
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = result.isDark !== undefined ? result.isDark : systemDarkMode;
    themeModeToggle.checked = isDark;
    updateTheme(isDark);
  });

  apiKeyInput.addEventListener('input', saveSettings);
  apiHostInput.addEventListener('input', saveSettings);
  systemPromptInput.addEventListener('input', saveSettings);
  targetLanguageInput.addEventListener('input', saveSettings);
  modelInput.addEventListener('input', saveSettings); 
  themeModeToggle.addEventListener('change', () => {
    saveSettings();
    updateTheme(themeModeToggle.checked);
  });

  function saveSettings() {
    const settings = {
      apiKey: apiKeyInput.value,
      apiHost: apiHostInput.value,
      systemPrompt: systemPromptInput.value,
      targetLanguage: targetLanguageInput.value,
      isDark: themeModeToggle.checked,
      model: modelInput.value 
    };
    
    chrome.storage.sync.set(settings, () => {
      console.log('Settings saved');
    });
  }

  function updateTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
  }
});