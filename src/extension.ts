// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import Reactor from "./reactor/reactor";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let reactor = new Reactor();

	let disposableNewReactClass = vscode.commands.registerCommand('extension.extractNewReactClass', () => reactor.createComponent(false));
	let disposableNewReactConst = vscode.commands.registerCommand('extension.extractNewReactConst', () => reactor.createComponent(true));

	context.subscriptions.push(disposableNewReactClass, disposableNewReactConst);
}

// this method is called when your extension is deactivated
export function deactivate() { }
