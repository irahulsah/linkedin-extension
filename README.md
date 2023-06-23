LinkedIn Extension

- in content.js, replace value of constants variable
   const mondayApiUrl = "https://api.monday.com/v2";
   const apiKey ="";
   const boardId = 4661502644; // Replace with your board ID
   const groupId = "topics"; // Replace with your group ID

- load the extension into the browser 
- open linkedin, go to any profile save, A save button will appear. Click on save
- a popup will open with pre fetched name, url, company, u can make changes.
- after submit, u can check in monday.com dashboard, the item is create with descriptio 
   (description is also pre-fetched from user abaout us content from linkedin profile)



Server setup

- webhook must be done at first (it can be achived from this - https://developer.monday.com/api-reference/docs/webhooks#create-a-webhook)
   1. create item - api/v1/monday-task/  (whenever a item is added the corresponding webhook will be triggerd to create a item in database)
   2. update item - api/v1/monday-task/update-item  (whenever a any changes in column is made in item board is added the corresponding webhook will be triggerd to update a item in database based on user_id, board_id, item_id)
   3. update item description - api/v1/monday-task/update-item-description  (whenever a description chat is created in item board is added the corresponding webhook will be triggerd to update desciption in item in database based on user_id, board_id, item_id)

- configure .env file as like example.env
- Npm i for package installation
- Npm run start (to start server)