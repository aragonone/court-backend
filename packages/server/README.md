# Court Backend server

This server aims to provide different kind of services to complement the logic implemented at the smart contracts level.

## Setup

First clone this repo and install dependencies:

````bash
git clone https://github.com/aragonone/court-backend/
cd court-backend
npm i
npx lerna bootstrap
cd packages/server
````

To run the server simply create your own `.env` file, feel free to follow the provided `.env.sample` template.
Once you have done that, make sure you have postgres installed and running and simply run the following commands:

```bash
npx sequelize db:create
npx sequelize db:migrate
npm start
```

Remember to append `NODE_ENV=production` if needed.

## Endpoints

All the provided endpoints are `Content-Type: application/json`

### 1. Subscriptions

#### 1.1. Create

- URL: /subscriptions
- Method: POST
- Body: 
  - email: Email address, string mandatory
  - address: Ethereum address, string not mandatory
  - amount: Amount of ANJ converted, string not mandatory
- Response: 
  - Code: 200
  - Content: 
    ```json
      {
        "id": 4,
        "email": "bla@gmail.com",
        "address": "0xd5931f0a36FE76845a5330f6D0cd7a378401e34d",
        "amount": "10000000",
        "updatedAt":"2019-12-19T16:00:18.208Z",
        "createdAt":"2019-12-19T16:00:18.208Z"
      }
    ```
