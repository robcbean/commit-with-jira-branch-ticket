# commit-with-jira-branch-ticket README

"commit-with-jira-branch-ticket". This extension automates the process of creating a new branch in your Git repository using the JIRA ticket number as the branch name.

## Features

![Extension options](https://github.com/robcbean/commit-with-jira-branch-ticket/raw/main/images/options.png)

1. Create a new branch based on jira ticket, to do this 

    1. Execute the command `Jira GitHub: Commit with branch`
    2. Selected the desired task. 
    3. The branch was created. 

2. Add a commit prefixing the jira ticket 
    1. Execute the command `Jira GitHub: Create a new branch from jira ticket`.
    2. Write the desired commit message.
    3. The commit message is added with the jira ticket prefix.


## Extension Settings


This extension contributes the following settings:

* `commit-with-jira-branch-ticket.user_name`: Jira user name
* `commit-with-jira-branch-ticket.user_token`: Jira user token
* `commit-with-jira-branch-ticket.domain`: Jira domain

## Known Issues

To use the commit is mandatory to have staged files.
## Release Notes

### 1.0.0

Initial release, create a github branch selecting active jira tickets and adds jira ticket to the commit comments.