# Local work with source code
We use clasp command line tool here. To bound this project with prepared sheet document:

* Login to your dev google account (`clasp login`)
* Create new empty script project attached to this document (`clasp create <scriptTitle> <sheet_id_here>`)
* Review files to be pushed with `clasp status`
* `clasp push`
* Activate onFormSubmit trigger
  * sheet -> Tools -> Script editor -> Edit -> Current project's triggers -> create a new trigger
  * You need to grant permissions to the app under your account. This is called app verification. It will involve this nasty "go to ...(unsafe)" dialog
* Done
