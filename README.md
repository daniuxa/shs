# How to deploy website
## Deployment on Azure
### Backend deployment

To deploy your backend on Azure you must follow these steps:

**Create Web App**

On Azure select App Service and you should to create Web App

![image](https://github.com/daniuxa/shs/assets/83185827/3dc61993-ef25-49cf-8b94-fe0ad9af98ec)

![image](https://github.com/daniuxa/shs/assets/83185827/b9842d6a-9c1b-4b3c-8d76-3a86e7bc9076)

Then click review and create

When web app is created, go to the deployment center and select your repository and branch. Then click save.

![image](https://github.com/daniuxa/shs/assets/83185827/05cde61c-92f2-44fd-bfa6-1c50843268fa)

In your repository on GitHub is generated .yml file with the script to deploy your backend on Azure. On the Actions page you can find the workflow that indicate status of deploying your app to Azure.

![image](https://github.com/daniuxa/shs/assets/83185827/53055d41-0952-40d8-b924-dfbf6e006016)

### Frontend deployment

To deploy your backend on Azure you must follow these steps:

**Create Static Web App**

On Azure select App Service and you should to create Static Web App.

On the creation page, select your GitHub account, repository and app location, where is located your frontend application. Then create it.

![image](https://github.com/daniuxa/shs/assets/83185827/292f2353-72fb-4692-99fa-066e4c38e0a4)

When static web app is created, go to your repository on GitHub, there you can find .yml file with the script to deploy your frontend on Azure. On the Actions page you can find the workflow that indicate status of deploying your app to Azure.

**Now you can use your website**

### Configure environment variables

If you want to use environment variables (e.g. API url) you can provide it by two ways:

- Provide variable on Azure in your Static Web APP page. You just need to select environment, enter variable and click apply

  ![image](https://github.com/daniuxa/shs/assets/83185827/29d2fd33-266c-4321-a5d7-80cdb537ac4e)

- Provide environment variable in .yml file. You should update script and add env section with name of variable and value. In example, we can see that variable is taken from the secrets on GitHub.

  ![image](https://github.com/daniuxa/shs/assets/83185827/63395c27-c7db-4436-a4b7-c5228db08f16)
