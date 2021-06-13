const vscode = require('vscode');
const path = require('path');

const getRelativePath = (path) => {
    return path.replace(`${vscode.workspace.rootPath}/`, '');
};

const openFile = (relativePath) => {
    var openPath = vscode.Uri.file(
        `${vscode.workspace.rootPath}/${relativePath}`
    )
    vscode.workspace.openTextDocument(openPath).then((doc) => {
        vscode.window.showTextDocument(doc)
    })
};

const RelativeFilePath = {
    fromFile(file) {
        if (file) {
            return getRelativePath(file.fsPath)
        }
    },
    fromActiveTextEditor() {
        // 현재 활성화된 파일 의 정보를 반환하는 method;
        if (vscode.window.activeTextEditor) {
            return getRelativePath(
                vscode.window.activeTextEditor.document.uri.fsPath
            )
        }
    },
}

module.exports = {
    openFile,
    RelativeFilePath,
    getFileName(filePath) {
        return path.basename(filePath, path.extname(filePath))
    },
}