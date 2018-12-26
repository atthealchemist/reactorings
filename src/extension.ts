// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from "path";

import Reactor from "./reactor/reactor";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let reactor = new Reactor();

	let disposableCreateReactClass = vscode.commands.registerCommand('extension.createNewReactClass', (clickedFileUri) => reactor.createComponent({
		clickedFilePath: clickedFileUri.fsPath,
		isConst: false,
		explorer: true
	}));
	let disposableNewReactClass = vscode.commands.registerCommand('extension.extractNewReactClass', (clickedFileUri) => reactor.createComponent({
		clickedFilePath: clickedFileUri.fsPath,
		isConst: false,
		explorer: false
	}));
	let disposableNewReactConst = vscode.commands.registerCommand('extension.extractNewReactConst', (clickedFileUri) => reactor.createComponent({
		clickedFilePath: clickedFileUri.fsPath,
		isConst: true,
		explorer: false
	}));

	context.subscriptions.push(disposableCreateReactClass, disposableNewReactClass, disposableNewReactConst);
}

// this method is called when your extension is deactivated
export function deactivate() { }
