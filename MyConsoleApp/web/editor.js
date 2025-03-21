require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' } });

require(['vs/editor/editor.main'], function () {
    console.log("✅ Monaco Editor Loaded Successfully"); // Debug log

    const editor = monaco.editor.create(document.getElementById('container'), {
        value: '', // Initially empty, will be filled dynamically
        language: 'csharp',
        theme: 'vs-dark',
        readOnly: false
    });

    // Load Program.cs into Monaco Editor
    fetch('Program.cs')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load Program.cs: ${response.statusText}`);
            }
            return response.text();
        })
        .then(content => {
            console.log("✅ Program.cs Loaded Successfully"); // Debug log
            editor.setValue(content); // Set content in the editor
        })
        .catch(err => {
            console.error("❌ Error Loading Program.cs:", err);
        });

    // Fetch Error Metadata and Highlight Errors
    fetch('ErrorMetadata.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ErrorMetadata.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(metadata => {
            console.log("✅ Error Metadata Loaded:", metadata); // Debug log
            const decorations = metadata.map(error => {
                return {
                    range: new monaco.Range(error.LineNumber, 1, error.LineNumber, 1),
                    options: {
                        isWholeLine: true,
                        className: 'my-error-line',
                        hoverMessage: { value: `**Error**: ${error.Message}\n💡 ${error.Tooltip}` }
                    }
                };
            });

            // Apply error highlighting in the editor
            editor.deltaDecorations([], decorations);
            console.log("✅ Errors Highlighted in Monaco Editor"); // Debug log
        })
        .catch(err => {
            console.error("❌ Error Loading ErrorMetadata.json:", err);
        });
});