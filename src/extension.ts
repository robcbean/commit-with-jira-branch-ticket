// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import simpleGit, {SimpleGit} from 'simple-git';
import {getJiraList, JiraTask} from './jira_api';

async function getStringFromPalette(): Promise<string | undefined> {
    let result = await vscode.window.showInputBox({
        placeHolder: "Enter a string"
    });
    return result;
}


async function getCurrentBranch(git: SimpleGit): Promise <string | undefined> {

	let result = await git.branch().then((branch) => 
	{
		return branch.current;
	});
	return result;
}

function getJiraTicketFromBranch(branch: string): string {
	let ret:string = '';
	const pattern = /([a-z]|[A-Z])+.[0-9]+/;
	const match = branch.match(pattern);
	if (match){
		ret = match[0];
	}
	return ret; 
}


async function writeCommit(git: SimpleGit, jiraTicket: string, commitComment: string)
{
	try{
		await git.commit(`[${jiraTicket}] ${commitComment}`);
		console.log("Commit sucessfully creaded");
	}
	catch(err)
	{
		vscode.window.showErrorMessage(String(err));
	}
}


async function addedFiles(git: SimpleGit): Promise<boolean>
{

	let ret = await git.status(['-s']).then((statusLines) => {
			let ret = statusLines.staged.length > 0;
			return ret;
		}
	);
	
	return ret;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "commit-with-jira-branch-ticket" is now active!');



	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('commit-with-jira-branch-ticket.commitBranch', async () => {

	let selectedTask:vscode.QuickPickItem =	await selectJiraTask();
		
				
	const currentProjectDirectory:string = String(vscode.workspace.rootPath);
	console.log(`Project directory ${currentProjectDirectory}\n`);	

	const git = simpleGit(currentProjectDirectory);
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

	context.subscriptions.push(disposable);
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
