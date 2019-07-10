# House Records Demo

> A simple demo shows how to use SIMBA API to post and get info to/from a private blockchain(Circle of Life).An Ethereum account is auto generated and Ethers are auto deposited, if no wallet is detected on user's browser under this domain. This demo auto signs the transaction with your Ethereum account when a post being made.


## Build Setup

``` bash
# install dependencies
npm install

# create and configure an app on Simba Dashboard
# with the `supply-logistics-demo.sol` smart contract
# at https://app.simbachain.com/

# generate APIKEYs on `App-View` page for SIMBA-API and Configuration(management) API

# open src/components/gateways/simba-api.js, replace `baseURL` and `APIKEY` with yours

# open src/components/gateways/manage-api.js, replace `APIKEY` with yours

# serve with hot reload at localhost:8080
npm run dev
```

## About This demo
* This version of the demo has a working home page with a map that contains pins and info windows for all registered houses.
* If you go to the link on a house's info window, you will be able to see a list of all transactions for that house.
* On the register page, any person can type in an address and add the house to the list of registered houses.
* There is a sign up and a log in page.
* Once logged in as a specific role (Real estate agent, insurance agent, inspector, or home owner) the user can add the make their corresponding transaction to any registered house.
* Additional features include:
..* Google Maps Autocomplete on the home and register pages
..* Google Maps Static in both map and street view on each house's page
..* Not allowing the user to select a date in the future, or a date before the house was built for any non-registering transactions
..* General protection against form misuse
..* And of course: all files stored on SIMBA's Circle-of-Life Ethereum blockchain, ensuring security and reliability
