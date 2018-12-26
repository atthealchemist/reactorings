import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

const { defaultExtension, moveComponentToFolder, replaceSelectionBlockWithComponent } = vscode.workspace.getConfiguration('reactorings');

class Reactor {

    getSelectedText() {
        let activeTextEditor = vscode.window.activeTextEditor;
        const selection = activeTextEditor.selection;
        const range = new vscode.Range(new vscode.Position(selection.start.line, selection.start.character), new vscode.Position(selection.end.line, selection.end.character));
        let selectedText = activeTextEditor.document.getText(range);
        return selectedText;
    }

    replaceSelectedTextWith(text) {
        let activeTextEditor = vscode.window.activeTextEditor;
        const selection = activeTextEditor.selection;
        const range = new vscode.Range(new vscode.Position(selection.start.line, selection.start.character), new vscode.Position(selection.end.line, selection.end.character));
        activeTextEditor.edit((change) => {
            change.replace(range, text);
        });
    }

    createComponent(options) {
        let activeFilePath = options.clickedFilePath;
        let selectedText = this.getSelectedText() != '' ? this.getSelectedText() : '<div></div>';
            
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
            ${selectedText}
        );
        }
        }
        
        export default ${value};
        `;
    
            if (options.isConst == true && options.explorer == false) {
                refactoringContent =
`
const ${value} = props => { return (
    ${selectedText}
); };
    
export default ${value};
`;
            }
    
            let fileName = `${value}.${defaultExtension}`;
            let folder = (moveComponentToFolder == true) ? value.toLowerCase() : '';
            
            let filePath = path.join(activeFilePath, folder);
            fs.mkdirSync(filePath);
    
            let filePathWithName = path.join(filePath, fileName);
            fs.writeFileSync(filePathWithName, refactoringContent, 'utf8');

            if(options.explorer == false && replaceSelectionBlockWithComponent == true) {
                this.replaceSelectedTextWith(`<${value} />`);
            }
            
            let uri = vscode.Uri.file(filePathWithName);
    
            vscode.workspace.openTextDocument(uri).then((doc) => {
                let options = vscode.window.activeTextEditor.options;
                vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', doc.uri, options).then(
                    (changes: vscode.TextEdit[]) => {
                        let formattedEdit = new vscode.WorkspaceEdit();
                        formattedEdit.set(uri, changes);
                        vscode.workspace.applyEdit(formattedEdit);
                    }
                );
                 vscode.window.showTextDocument(doc, 1, false);
            });

            vscode.window.showInformationMessage(`Extracted HTML into ${fileName}`);
    
        });
    
    }
    

}

export default Reactor