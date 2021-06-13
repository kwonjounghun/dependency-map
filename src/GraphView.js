const { openFile } = require('./file');
const fs = require('fs');
const path = require('path');

const buildView = (title, graph, main) => {
    return `
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title${title}</title>
            </head>
            <body>
                ${graph}
            </body>
        </html>
        `
}

const webViewListener = (message) => {
    switch (message.command) {
        case 'open':
            openFile(message.url);
            return;
    }
}

const createPanel = (vscode, context, title) => {
    return vscode.window.createWebviewPanel(
        `dependency-analysis-${Date.now()}`,
        title,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(
                    path.join(
                        context.extensionPath || './',
                        'src/webViewContext'
                    )
                ),
            ],
        }
    );
};

module.exports = {
    openGraph: async function ({ vscode, fileName, graph, context }) {
        const title = `${fileName} Dependencies`
        const panel = createPanel(vscode, context, title)

        panel.webview.onDidReceiveMessage(
            webViewListener,
            undefined,
            context.subscriptions
        )

        const onDiskPath = vscode.Uri.file(
            path.join(
                context.extensionPath || './',
                'src/webViewContext',
                'main.js'
            )
        );


        const main = panel.webview.asWebviewUri(onDiskPath);
        const htmlInGraph = buildView(title, graph, main);
        // svg 파일 생성 로직 추가
        try {
            await fs.writeFile(`${vscode.workspace.rootPath}/dependency.svg`, graph, err => {
                if (err) {
                    vscode.window.showErrorMessage("Maker cant write to file.");
                }
            });
        } catch(error) {
            console.log(error)
        }
        panel.webview.html = htmlInGraph;

        return panel;
    },
    webViewListener,
};
