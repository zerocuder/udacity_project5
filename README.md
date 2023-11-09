# Project: Cloud Capstone Project - PHOTOs

This application will allow creating/removing/updating/fetching Photo items. Each Photo item can optionally have an attachment image. Each user only has access to Photo items that he/she has created.

# Photo items

The application should store Photo items, and each Photo item contains the following fields:

* `photoId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `caption` (string) - caption of photo
* `photoUrl` (string) (optional) - a URL pointing to an image attached to a Photo item


## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 14.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=3.36.0). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@3.36.0
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

# How to run the application

## Deploy Backend
To deploy an application run the following commands (already have aws credentials configured)

```bash
cd backend
npm install
sls deploy -v
```

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

## Update frontend configuration
```ts
const apiId = 'bsqquh9a13'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-61spvqghc6me1ges.us.auth0.com',            // Auth0 domain
  clientId: 'CvpiRZo5GOl9jyjnpJbDC3ubtqQ9IALU',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
```
# Current Deplyment details
### dashboard: 
https://app.serverless.com/zerocuder/apps/capstone-serverless-photo-app/capstone-serverless-photo-service/dev/us-east-1

### endpoints:
https://bsqquh9a13.execute-api.us-east-1.amazonaws.com/dev/photos

# Project captures:
### Dashboard
![dashboard](/images/capstone_home_page.png?raw=true "dashboard")

### Deploy serverless
![deploy serverless](/images/capstone_deploy_serverless.png?raw=true "deploy serverless")