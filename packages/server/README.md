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

To run the server simply create your own `.env` file, feel free to follow the template provided in `.env.sample`.
Once you have done that, spin up a docker container with:
```bash
docker-compose up -d
```

If you had run it before, make sure to remove it first:
```bash
docker-compose down
```


and simply run the following commands:

```bash
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
npm start
```

Remember to append `NODE_ENV=production` if needed.

## Endpoints

All the provided endpoints are `Content-Type: application/json`

### 1. Users

#### 1.1. Create

- URL: /users
- Method: POST
- Body: 
  - `email`: Email address, string mandatory
  - `address`: Ethereum address, string mandatory
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "id": 4,
        "email": "bla@gmail.com",
        "address": "0x4ecc4fe717d70abee26e7e524b2e6caf29b6217d",
        "updatedAt":"2019-12-19T16:00:18.208Z",
        "createdAt":"2019-12-19T16:00:18.208Z"
      }
    ```

#### 1.2. Exists

- URL: /user
- Method: GET
- Query: 
  - `email`: Email address, string mandatory
  - `address`: Ethereum address, string mandatory
- Response: 
  - Code: 200
  - Content example: empty

#### 1.3. All

- URL: /users
- Method: GET
- Query: 
  - `token`: JSON web token
  - `limit`: Number of items to be fetched
  - `page`: Page number to be used for the items to be fetched based on the limit requested
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "users":[
          {
            "id": 9,
            "email": "someone@aragon.one",
            "address": "0x4ecc4fe717d70abee26e7e524b2e6caf29b6217d",
            "createdAt": "2019-12-25T14:58:58.705Z",
            "updatedAt":"2019-12-25T14:58:58.705Z"
          },
          {
            "id": 8,
            "email": "anotherone@aragon.one",
            "address": "0x4ecc4fe717d70abee26e7e524b2e6caf29b6217d",
            "createdAt": "2019-12-25T14:58:52.433Z",
            "updatedAt": "2019-12-25T14:58:52.433Z"
          }
        ],
        "total": 9
      }
    ```

### 2. Reveals

#### 2.1. Create

- URL: /reveals
- Method: POST
- Body: 
  - `juror`: Ethereum address of the juror requesting for the reveal 
  - `voteId`: Vote ID to be revealed for the given juror
  - `outcome`: Outcome voted in favor of
  - `salt`: Salt used for the committed vote to be revealed
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "reveal": {
          "id": 1,
          "juror": "0x4ecc4fe717d70abee26e7e524b2e6caf29b6217d",
          "voteId": "0", 
          "disputeId": "0", 
          "roundNumber": "0",
          "createdAt": "2019-12-25T14:58:58.705Z",
          "updatedAt":"2019-12-25T14:58:58.705Z"
        }
      }
    ```

#### 2.2. Show

- URL: /reveal
- Method: GET
- Body: 
  - `juror`: Ethereum address of the juror requesting for the reveal 
  - `voteId`: Vote ID to be revealed for the given juror
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "reveal": {
          "id": 1,
          "juror": "0x4ecc4fe717d70abee26e7e524b2e6caf29b6217d",
          "voteId": "0", 
          "disputeId": "0", 
          "roundNumber": "0",
          "createdAt": "2019-12-25T14:58:58.705Z",
          "updatedAt":"2019-12-25T14:58:58.705Z"
        }
      }
    ```

#### 2.3. All

- URL: /reveals
- Method: GET
- Query: 
  - `token`: JSON web token
  - `limit`: Number of items to be fetched
  - `page`: Page number to be used for the items to be fetched based on the limit requested
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "reveals":[
          {
            "id": 9,
            "juror": "0x4ecc4fe717d70abee26e7e524b2e6caf29b6217d",
            "voteId": "0", 
            "disputeId": "0", 
            "roundNumber": "0",
            "outcome": "4",
            "salt": "0x609a2445eb34bc29b4d87aea2cae24fba90a1583b14df2d765ae1f89d32b4beb",
            "revealed": false,
            "errorId": 41,
            "createdAt": "2019-12-25T14:58:58.705Z",
            "updatedAt":"2019-12-25T14:58:58.705Z"
          }
        ],
        "total": 1
      }
    ```

### 3. Admins

#### 3.1. Login

- URL: /login
- Method: POST
- Body: 
  - `email`: Admin email
  - `password`: Admin password
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ImZhY3VAYXJhZ29uLm9uZSIsImlhdCI6MTU3ODA4MTI5NCwiZXhwIjoxNTc4MDg0ODk0fQ.lmcJOE0eblD_maqXqyK0_H2swXnvG9lfEm1aJRGiAVw"
      }
    ```
    

#### 3.2. Me

- URL: /me
- Method: GET
- Query: 
  - `token`: JSON web token
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "admin": {
          "id": 1,
          "email": "admin@aragon.one"
        }
      }
    ```

#### 3.3. All

- URL: /admins
- Method: GET
- Query: 
  - `token`: JSON web token
  - `limit`: Number of items to be fetched
  - `page`: Page number to be used for the items to be fetched based on the limit requested
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "reveals":[
          {
            "id": 9,
            "juror": "0x4ecc4fe717d70abee26e7e524b2e6caf29b6217d",
            "voteId": "0", 
            "disputeId": "0", 
            "roundNumber": "0",
            "outcome": "4",
            "salt": "0x609a2445eb34bc29b4d87aea2cae24fba90a1583b14df2d765ae1f89d32b4beb",
            "revealed": false,
            "createdAt": "2019-12-25T14:58:58.705Z",
            "updatedAt":"2019-12-25T14:58:58.705Z",
            "error": {
              "id": 41,
              "context": "Worker 'reveal' job #1 revealing vote ID 0 for juror 0x4ecc4fe717d70abee26e7e524b2e6caf29b6217d",
              "message": "Transaction: 0x8752864b6fd59ec6365855fe17bbfc2382632e27e9d9e92e8d817e626582a757 exited with an error (status 0). Reason given: DM_INVALID_ADJUDICATION_STATE.\n     Please check that the transaction:\n     - satisfies all conditions set by Solidity `require` statements.\n     - does not trigger a Solidity `revert` statement.\n",
              "stack": "Error: Transaction: 0x8752864b6fd59ec6365855fe17bbfc2382632e27e9d9e92e8d817e626582a757 exited with an error (status 0). Reason given: DM_INVALID_ADJUDICATION_STATE.    at PromiEvent (~/court-backend/packages/shared/node_modules/@truffle/contract/lib/promievent.js:9:30)\n    at TruffleContract.reveal (~/court-backend/packages/shared/node_modules/@truffle/contract/lib/execute.js:169:26)\n    at module.exports.revealFor (~/court-backend/packages/shared/models/Court.js:261:19)\n    at process._tickCallback (internal/process/next_tick.js:68:7)",
              "createdAt": "2019-12-25T16:06:42.304Z",
              "updatedAt": "2019-12-25T16:06:42.304Z"
            }
          }
        ],
        "total": 1
      }
    ```

#### 3.4. Create

- URL: /admins
- Method: POST
- Body: 
  - `token`: JSON web token
  - `email`: Admin email 
  - `password`: Admin password
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "admin": {
          "id": 2,
          "email": "admin@aragon.one"
        }
      }
    ```

#### 3.5. Delete

- URL: /admins/:id
- Method: DELETE
- Query: 
  - `token`: JSON web token 
- Response: 
  - Code: 200
  - Content example: empty
