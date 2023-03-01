# Udacity_store_project

## Connections
* Server port: 3000
* Database port: 5432 

## Development setup
* 1- run [npm install] for packages installation
* 2- small note: you don't have to create any databases yourself, the scripts in package.json will create them for you, just follow the instructions 
* 2- change environmental variables in .env file (note: it's better to not change DATABASE and DATABASE_TEST variables but if you want to, then you have to do this additional step: 3)
* 3- go to package.json, update the following scripts:
*   -test: replace the (udacity_store_test) database with your own test_DB name
*   -create_DB_test: replace (udacity_store_test) database with your own test_DB name
*   -create_DB: replace (udacity_store) with your own DB name

* 4-now you should be ready to go:
*   -run [npm run tsc] to build all files to js files (if it failed for any reason please create it yoursefl)
*   -create the dev database in postgres
*   -run [npm run migrations] to apply all migrations to your dev database
*   -run [npm run watch] to run to app on port 3000, databases will run on port 5432

## Test setup
* 1- first make sure you have already made the development setup steps
* 2- create your test database in postgres
* 3- run [npm run test]
* note: after running the test, test_DB will be dropped automatically. so you need to create the test_DB every time before running a test


## ENV Variables (for reviewing purpose)

# this file should be ignored, but included for reviewing purposes 
* HOST=localhost
* DB_USERNAME=YOUR_DB_NAME 
* PASSWORD=YOUR_PASSWORD
* DATABASE=udacity_store
* DATABASE_TEST=udacity_store_test

* SALT_ROUNDS=10
* PEPPER=used_pepper

* TOKEN_SECRET_KEY=this_is_token_secret_key
* ENV=DEV


## Notes
* After creating the databases for the first time by yourself, you can use [npm run create_DB] and [npm run create_DB_test] if they were dropped for any reason.
