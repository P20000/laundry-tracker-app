# AGENT rules: 

- on every push to the github, the agent must and always check through render CLI if the latest commit deployment correctly went live or not. if that fails the agent has to recursively look into the logs of the failed deployment and look for the root cause of the failure and fix it autonomously. 
