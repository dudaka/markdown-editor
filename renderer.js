var editor;

window.addEventListener('DOMContentLoaded', () => {
  editor = new SimpleMDE({ element: document.getElementById("editor") });

  window.api.editorEventRegister((arg) => {
    if (arg === 'toggle-bold') {
      editor.toggleBold();
    }

    if (arg === 'save') {
      window.api.sendEventToEditor('save', editor.value());
    }
  });

  window.api.loadEventRegister((content) => {
    editor.value(content);
  });
});


function dropHandler(event) {
  console.log('File(s) dropped');
  
  event.preventDefault();
  
  if (event.dataTransfer.items) {
    for (let i = 0; i < event.dataTransfer.items.length; i++) {
      if (event.dataTransfer.items[i].kind === 'file') {
        const file = event.dataTransfer.items[i].getAsFile();
        if (file.type === 'text/markdown') {
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = event.target.result;
            // window.api.sendEventToEditor('load', content);
            // console.log(event.target.result);
            editor.codemirror.setValue(content);
            
          };
          reader.readAsText(file);
        }
      }
    }
  }
}