// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import simpleGit, {SimpleGit} from 'simple-git';
import { notEqual } from 'assert';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "commit-with-jira-branch-ticket" is now active!');


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('commit-with-jira-branch-ticket.helloWorld', () => {

		
		var currentProjectDirectory:string = String(vscode.workspace.rootPath);
	
		console.log(`Project directory ${currentProjectDirectory}`);	
		console.log(`Current working directory ${process.cwd()}`);
	
		process.chdir(currentProjectDirectory);
		console.log(`Current working directory after chdir ${process.cwd()}`);

		var git = simpleGit();
		var currentBranch = '';
		async function getCurentBranch(){
			currentBranch = (await git.branch()).current;
		}
		getCurentBranch();
		console.log(`Current branch :${currentBranch}..`);
	
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
