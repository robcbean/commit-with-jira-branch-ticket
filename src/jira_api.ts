
import axios from "axios";
import { config } from "process";


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

async function getJiraList(userDomain:string, userName:string, userToken:string): Promise<{[key: string]: string}[]>
{
    let ret:{[key: string]: string}[] = [];
    let config:any = generateRequestHeader(userName, userToken);

    const response = await axios.get(generateSearchURL(userDomain, 'status!="Done" '), config);
    const jsonValue = await response.data;

    jsonValue['issues'].forEach( issue => {
            ret[issue['key']] = issue['fields']['summary'];
        }
    );
    return ret;
}
    

const USER_DOMAIN:string = "robertobean.atlassian.net";
const USER_NAME:string = "robcbean@gmail.com";
const JIRA_TOKEN:string = process.env.JIRA_TOKEN;

getJiraList(USER_DOMAIN, USER_NAME, JIRA_TOKEN).then(jiraTasks =>{
    console.log(jiraTasks);
}).catch( error => {
    console.log(console.error());
});
