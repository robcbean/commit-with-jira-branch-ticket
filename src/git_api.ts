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
    let ret:string = `${taskId.toLowerCase()}_${taksDescription.toLowerCase()}`.replace(/[\s]/g,'_');
	
	ret = ret.replace(/-/g,'_');

    return ret;
}

async function existsBranch(git: SimpleGit, branchName:string):Promise<boolean>
{
	let retExistsBranch: boolean = false;
	let remoteList:string = null;
	await git.listRemote(['--heads'],(error, remote)=> {
			if (error){
				console.log(error);
				return;
			}else{
				remoteList = remote;
			}
		}
	);
	retExistsBranch = remoteList.includes(`refs/heads/${branchName}`);
	return retExistsBranch;
}


export async function createBranch(git: SimpleGit, taskId:string, takDescription:string)
{

	const curretWorkingDirectory: string = vscode.workspace.rootPath;
	const branchName:string = getBranchName(taskId,takDescription);

	console.log(`Current working directory ${curretWorkingDirectory}`);
	console.log(`Branch name ${branchName}`);

	let branchExists:boolean = await existsBranch(git, branchName);

	if (branchExists){
		vscode.window.showErrorMessage(`The branch named ${branchName} already exists`);
	}else{
		await git.branch([branchName]);
		await git.checkout([branchName]);
	}

}