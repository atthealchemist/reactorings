// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from "path";
import * as fs from "fs";

const { defaultExtension, moveComponentToFolder } = vscode.workspace.getConfiguration('reactorings');

function getSelectedText() {
	let activeTextEditor = vscode.window.activeTextEditor;
	const selection = activeTextEditor.selection;
	const range = new vscode.Range(new vscode.Position(selection.start.line, selection.start.character), new vscode.Position(selection.end.line, selection.end.character));
	let selectedText = activeTextEditor.document.getText(range);
	return selectedText;
}

function createComponent(isConst) {

	vscode.window.showInputBox({
		prompt: "Enter name of new component",
		value: "MyComponent"
	}).then(value => {


		let refactoringContent =
			`
	import React, { Component } from 'react';
	
	class ${value} extends Component {
	constructor(props) {
	super(props);
	this.state = {}
	}
	render() {
	return (
		${getSelectedText()}
	);
	}
	}
	
	export default ${value};
	`;

		if (isConst) {
			refactoringContent =
				`
const ${value} = props => { return (${getSelectedText()}); };

export default ${value};
`;
		}

		let fileName = `${value}.${defaultExtension}`;
		let folder = (moveComponentToFolder == true) ? value.toLowerCase() : '';
		
		let filePath = path.join(vscode.workspace.rootPath, folder);
		fs.mkdirSync(filePath);

		let filePathWithName = path.join(filePath, fileName);

		fs.writeFileSync(filePathWithName, refactoringContent, 'utf8');

		// Display a message box to the user
		vscode.window.showInformationMessage(`Extracted HTML into ${fileName}`);

		vscode.workspace.openTextDocument(filePathWithName).then((doc) => {
			let options = vscode.window.activeTextEditor.options;

			vscode.window.showTextDocument(doc, 1, false).then(() =>
				vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', doc.uri, options).then(
					(changes: vscode.TextEdit[]) => {
						let formattedEdit = new vscode.WorkspaceEdit();
						formattedEdit.set(doc.uri, changes);
						vscode.workspace.applyEdit(formattedEdit);
						vscode.window.activeTextEditor.document.save();
					}
				)
			);
		});

	});

}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "reactorings" is now active!');
	console.log(`folder: ${moveComponentToFolder}`);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableNewReactClass = vscode.commands.registerCommand('extension.extractNewReactClass', () => {
		createComponent(false);
	});

	let disposableNewReactConst = vscode.commands.registerCommand('extension.extractNewReactConst', () => {
		createComponent(true)
	});

	context.subscriptions.push(disposableNewReactClass);
	context.subscriptions.push(disposableNewReactConst);
}

// this method is called when your extension is deactivated
export function deactivate() { }
