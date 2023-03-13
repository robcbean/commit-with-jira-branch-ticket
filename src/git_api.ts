import * as vscode from 'vscode';
import simpleGit, {SimpleGit} from 'simple-git';

export async function getCurrentBranch(git: SimpleGit): Promise <string | undefined> {

	let result = await git.branch().then((branch) => 
	{
		return branch.current;
	});
	return result;
}

export function getJiraTicketFromBranch(branch: string): string {
	let ret:string = '';
	const pattern = /([a-z]|[A-Z])+.[0-9]+/;
	const match = branch.match(pattern);
	if (match){
		ret = match[0];
	}
	return ret; 
}


export async function writeCommit(git: SimpleGit, jiraTicket: string, commitComment: string)
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


export async function addedFiles(git: SimpleGit): Promise<boolean>
{

	let ret = await git.status(['-s']).then((statusLines) => {
			let ret = statusLines.staged.length > 0;
			return ret;
		}
	);
	
	return ret;
}


function getBranchName(taskId:string, taksDescription:string): string
{
    const ret:string = `${taskId.toLowerCase()}_${taksDescription.toLowerCase()}`.replace(/[^\s]/g,'_');

    return ret;
}
export function createBranch(git: SimpleGit, taskId:string, takDescription:string)
{
    git.checkoutLocalBranch(getBranchName(taskId,takDescription));
}