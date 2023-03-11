

function generateCredentialString(user_name:string, user_token:string): string 
{
    const credentials:string = `${user_name}:${user_token}`;
    const ret:string = Buffer.from(credentials, 'ascii').toString('base64');
    
    return ret;
}

function generateRequestHeader(user_name:string, user_token:string): Headers
{
    
    let retHeaders: Headers = new Headers();

    retHeaders.append("Content-Type", "application/json");
    retHeaders.append("Accept", "application/json");
    retHeaders.append("Authorization", `Basic ${generateCredentialString(user_name,user_token)}`);


    return retHeaders;
}

function generateSearchURL(user_domain:string, search_string:string): string 
{
    let ret:string = `https://${user_domain}/rest/api/3/search?jql=`  + encodeURIComponent(search_string);

    return ret;
}

async function getJiraList(user_domain:string, user_name:string, user_token:string): Promise<{[key: string]: string}[]>
{
    let ret:{[key: string]: string}[] = [];
    const requestOptions: RequestInit = {
        method: "GET",
        headers: generateRequestHeader(user_name, user_token)
    };

    const response = await fetch(
        generateSearchURL(user_domain, 'status!="Done" '),requestOptions
    );

    const json_value = await response.json();


    json_value['issues'].forEach( issue => {
            ret[issue['key']] = issue['fields']['summary'];
        }
    );
    return ret;
}
    
