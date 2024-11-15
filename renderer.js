window.addEventListener('DOMContentLoaded', () => {
  const editor = new SimpleMDE({ element: document.getElementById("editor") });

  window.api.editorEventRegister((arg) => {
    if (arg === 'toggle-bold') {
      editor.toggleBold();
    }

    if (arg === 'save') {
      window.api.sendEventToEditor('save', editor.value());
    }
  });
});