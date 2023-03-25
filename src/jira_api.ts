
import axios from "axios";



function generateCredentialString(userName:string, userToken:string): string 
{
    const credentials:string = `${userName}:${userToken}`;
    const ret:string = Buffer.from(credentials, 'ascii').toString('base64');
    
    return ret;
}

function generateRequestHeader(userName:string, userToken:string): any
{
    let retHeaders: any = {
        headers: {
            "Content-Type" : "application/json",
            "Accept": "application/json",
            "Authorization": `Basic ${generateCredentialString(userName,userToken)}`
        }
    };

    return retHeaders;
}

function generateSearchURL(userDomain:string, searchString:string): string 
{
    let ret:string = `https://${userDomain}/rest/api/3/search?jql=`  + encodeURIComponent(searchString);

    return ret;
}

export type JiraTask = {
    label: string,
    description: string
};


export async function getJiraList(userDomain:string, userName:string, userToken:string): Promise<JiraTask[]>
{
    let ret: JiraTask[] = [];
    let config:any = generateRequestHeader(userName, userToken);

    const response = await axios.get(generateSearchURL(userDomain, 'status!="Done" and  assignee=currentUser()'), config);
    const jsonValue = await response.data;

    jsonValue['issues'].forEach( issue => {
            let task:JiraTask = {label:issue['key'],description:issue['fields']['summary']};
            ret.push(task);
        }
    );
    return ret;
}