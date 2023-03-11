

function generateCredentialString(userName:string, userToken:string): string 
{
    const credentials:string = `${userName}:${userToken}`;
    const ret:string = Buffer.from(credentials, 'ascii').toString('base64');
    
    return ret;
}

function generateRequestHeader(userName:string, userToken:string): Headers
{
    
    let retHeaders: Headers = new Headers();

    retHeaders.append("Content-Type", "application/json");
    retHeaders.append("Accept", "application/json");
    retHeaders.append("Authorization", `Basic ${generateCredentialString(userName,userToken)}`);


    return retHeaders;
}

function generateSearchURL(userDomain:string, searchString:string): string 
{
    let ret:string = `https://${userDomain}/rest/api/3/search?jql=`  + encodeURIComponent(searchString);

    return ret;
}

export async function getJiraList(userDomain:string, userName:string, userToken:string): Promise<{[key: string]: string}[]>
{
    let ret:{[key: string]: string}[] = [];
    const requestOptions: RequestInit = {
        method: "GET",
        headers: generateRequestHeader(userName, userToken)
    };




    const response = await fetch(
        generateSearchURL(userDomain, 'status!="Done" '),requestOptions
    );

    const jsonValue = await response.json();


    jsonValue['issues'].forEach( issue => {
            ret[issue['key']] = issue['fields']['summary'];
        }
    );
    return ret;
}
    
