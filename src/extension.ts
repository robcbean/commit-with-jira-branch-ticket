// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import simpleGit, {SimpleGit} from 'simple-git';
import { notEqual } from 'assert';

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

function constainsAddTag(inputLines: string): boolean
{
	let ret: boolean = false;

	const pattern = /^A.*(\nA.*)*/;
	const match = inputLines.match(pattern);
	if (match){
		let ret = true;
	}
	return ret;
}

async function addedFiles(git: SimpleGit): Promise<boolean>
{
	let ret: boolean = false;

	let result = git.status(['-s']).then((statusLines) => {
			return constainsAddTag(String(statusLines));
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

		
		var currentProjectDirectory:string = String(vscode.workspace.rootPath);
		console.log(`Project directory ${currentProjectDirectory}`);	
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

// This method is called when your extension is deactivated
export function deactivate() {}
