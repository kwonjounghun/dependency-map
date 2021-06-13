// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const runDependencyAnalysis = require('./src/dependencyAnalysis');
const { RelativeFilePath, getFileName } = require('./src/file');
const { openGraph } = require('./src/GraphView');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "react-dependency-map" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(
		'react-dependency-map.helloWorld',
		async function (file) {
			// The code you place here will be executed every time your command is executed
			const filePath =
				RelativeFilePath.fromFile(file) ||
				RelativeFilePath.fromActiveTextEditor();


			const options = vscode.workspace.getConfiguration(
				'react-dependency-map'
			);

			if (filePath) {
				process.chdir(vscode.workspace.rootPath); // node.js의 process의 현재 작업 디렉토리를 변경하거나 찾을 수 없을 경우 예외를 발생시킵니다.
				const graph = await runDependencyAnalysis(filePath, options);

				const fileName = getFileName(filePath);
				return openGraph({
					vscode,
					fileName,
					graph: graph.toString(),
					context,
				});
			} else {
				vscode.window.showWarningMessage(
					'No Active Editor tabs, please select a file first'
				)
			}
		});

	context.subscriptions.push(disposable);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
