// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import simpleGit, {SimpleGit} from 'simple-git';
import {getJiraList, JiraTask} from './jira_api';
import {getCurrentBranch, getJiraTicketFromBranch, writeCommit, addedFiles, createBranch} from './git_api';

async function getStringFromPalette(): Promise<string | undefined> {
    let result = await vscode.window.showInputBox({
        placeHolder: "Enter a string"
    });
    return result;
}



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "commit-with-jira-branch-ticket" is now active!');


	const currentProjectDirectory:string = String(vscode.workspace.rootPath);
	const git = simpleGit(currentProjectDirectory);


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableCommit:vscode.Disposable = vscode.commands.registerCommand('commit-with-jira-branch-ticket.commitBranch', async () => {

		
	console.log(`Project directory ${currentProjectDirectory}\n`);	
	let existinsAddFiles:boolean = await addedFiles(git);
		

	if (existinsAddFiles){
		let currentBranch = await getCurrentBranch(git);
		let jiraTicket = getJiraTicketFromBranch(String(currentBranch));
		let commitComment = await getStringFromPalette();

		if (commitComment === undefined || commitComment === "" )
		{
			vscode.window.showErrorMessage("Commit comment it's empty");
		}
		else 
		{
			console.log(`Write comment ${commitComment} to the branch ${currentBranch} for the ticket ${jiraTicket}`);
			await writeCommit(git, jiraTicket, String(commitComment));
		}

	}else{
		vscode.window.showErrorMessage("No files added.");
	}
		
	});

	context.subscriptions.push(disposableCommit);

	let disposableCreateBranch:vscode.Disposable = vscode.commands.registerCommand('commit-with-jira-branch-ticket.createBranch', async () => {

		let selectedItem = await selectJiraTask();

		const taskId: string = selectedItem.label;
		const taksDescription: string = selectedItem.description;

		console.log(`Selected taskid ${taskId} - ${taksDescription}`);
		console.log(`Current task description ${taksDescription}`)

		await createBranch(git, taskId, taksDescription);


	});

	context.subscriptions.push(disposableCreateBranch);


}



async function selectJiraTask(): Promise<vscode.QuickPickItem> {
	console.log('Getting configuration\n');
	var config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('commit-with-jira-branch-ticket');
	const userName: string = config["user_name"];
	const userDomain: string = config["domain"];
	const userToken: string = config["user_token"];

	console.log(`Getting task list user_name:${userName} and domain:${userDomain}`);
	let jiraTasks: JiraTask[] = await getJiraList(userDomain, userName, userToken);
	console.log(jiraTasks);

	const quickPick = vscode.window.createQuickPick();
	quickPick.items = jiraTasks;
	quickPick.placeholder = "Select a jira taks";

	const selected:vscode.QuickPickItem = await new Promise<vscode.QuickPickItem | undefined>((resolve) => {
		quickPick.onDidChangeSelection((items) => {
			if (items.length > 0) {
				resolve(items[0]);
			}
		});
		quickPick.show();
	});
	return selected;
}

// This method is called when your extension is deactivated
export function deactivate() {}
