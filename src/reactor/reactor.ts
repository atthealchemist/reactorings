import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

const { defaultExtension, moveComponentToFolder } = vscode.workspace.getConfiguration('reactorings');

class Reactor {

    getSelectedText() {
        let activeTextEditor = vscode.window.activeTextEditor;
        const selection = activeTextEditor.selection;
        const range = new vscode.Range(new vscode.Position(selection.start.line, selection.start.character), new vscode.Position(selection.end.line, selection.end.character));
        let selectedText = activeTextEditor.document.getText(range);
        return selectedText;
    }

    createComponent(isConst) {

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
            ${this.getSelectedText()}
        );
        }
        }
        
        export default ${value};
        `;
    
            if (isConst) {
                refactoringContent =
                    `
    const ${value} = props => { return (${this.getSelectedText()}); };
    
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
    

}

export default Reactor