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

### 1. Subscriptions

#### 1.1. Create

- URL: /subscriptions
- Method: POST
- Body: 
  - `email`: Email address, string mandatory
  - `address`: Ethereum address, string not mandatory
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "id": 4,
        "email": "bla@gmail.com",
        "address": "0xd5931f0a36FE76845a5330f6D0cd7a378401e34d",
        "updatedAt":"2019-12-19T16:00:18.208Z",
        "createdAt":"2019-12-19T16:00:18.208Z"
      }
    ```

#### 1.2. All

- URL: /subscriptions
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
        "subscriptions":[
          {
            "id": 9,
            "email": "juan@aragon.one",
            "address": "0xd5931f0a36FE76845a5330f6D0cd7a378401",
            "createdAt": "2019-12-25T14:58:58.705Z",
            "updatedAt":"2019-12-25T14:58:58.705Z"
          },
          {
            "id": 8,
            "email": "delfi@aragon.one",
            "address": "0xd5931f0a36FE76845a5330f6D0cd7a378401",
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
          "juror": "0xd5931f0a36FE76845a5330f6D0cd7a378401",
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
          "juror": "0xd5931f0a36FE76845a5330f6D0cd7a378401",
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
            "juror": "0xd5931f0a36FE76845a5330f6D0cd7a378401",
            "voteId": "0", 
            "disputeId": "0", 
            "roundNumber": "0",
            "outcome": "4",
            "salt": "0x609a2445eb34bc29b4d87aea2cae24fba90a1583b14df2d765ae1f89d32b4beb",
            "revealed": false,
            "tries": 3,
            "errorId": 41,
            "createdAt": "2019-12-25T14:58:58.705Z",
            "updatedAt":"2019-12-25T14:58:58.705Z"
          }
        ],
        "total": 1
      }
    ```

### 3. Settlements

#### 3.1. All

- URL: /settlements
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
        "settlements":[
          {
            "id": 3,
            "disputeId": "0",
            "blockNumber": "5643593",
            "settled": true,
            "tries": 1,
            "errorId": null,
            "createdAt": "2019-12-24T20:15:42.844Z",
            "updatedAt": "2019-12-27T13:11:32.415Z",
            "error": null
          }
        ],
        "total": 1
      }
    ```

### 4. Admins

#### 4.1. Login

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
    

#### 4.2. Me

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

#### 4.3. All

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
            "juror": "0xd5931f0a36FE76845a5330f6D0cd7a378401",
            "voteId": "0", 
            "disputeId": "0", 
            "roundNumber": "0",
            "outcome": "4",
            "salt": "0x609a2445eb34bc29b4d87aea2cae24fba90a1583b14df2d765ae1f89d32b4beb",
            "revealed": false,
            "tries": 3,
            "createdAt": "2019-12-25T14:58:58.705Z",
            "updatedAt":"2019-12-25T14:58:58.705Z",
            "error": {
              "id": 41,
              "context": "Worker 'reveal' job #1 revealing vote ID 0 for juror 0xd5931f0a36fe76845a5330f6d0cd7a378401e34d",
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

#### 4.4. Create

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

#### 4.5. Delete

- URL: /admins/:id
- Method: DELETE
- Query: 
  - `token`: JSON web token 
- Response: 
  - Code: 200
  - Content example: empty

### 5. Errors

#### 5.1. Show

- URL: /error/:id
- Method: GET
- Query: 
  - `token`: JSON web token
- Response: 
  - Code: 200
  - Content example: 
    ```json
      {
        "error": {
          "id": 45,
          "context": "Worker 'settlements' job #2 settling dispute #0",
          "message": "fetch is not defined", 
          "stack": "ReferenceError: fetch is not defined\n    at TruffleEnvironment.query (~/court-backend/packages/shared/models/evironments/Environment.js:19:22)\n    at module.exports.getJurors (~/court-backend/packages/shared/models/Court.js:95:43)\n    at module.exports.settle (~/court-backend/packages/shared/models/Court.js:346:33)\n    at process._tickCallback (internal/process/next_tick.js:68:7)",
          "createdAt": "2019-12-27T13:09:04.204Z",
          "updatedAt": "2019-12-27T13:09:04.204Z"
        }
      }
    ```

#### 5.2. All

- URL: /errors
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
        "errors": [
          {
            "id": 45,
            "context": "Worker 'settlements' job #2 settling dispute #0",
            "message": "fetch is not defined", 
            "stack": "ReferenceError: fetch is not defined\n    at TruffleEnvironment.query (~/court-backend/packages/shared/models/evironments/Environment.js:19:22)\n    at module.exports.getJurors (~/court-backend/packages/shared/models/Court.js:95:43)\n    at module.exports.settle (~/court-backend/packages/shared/models/Court.js:346:33)\n    at process._tickCallback (internal/process/next_tick.js:68:7)",
            "createdAt": "2019-12-27T13:09:04.204Z",
            "updatedAt": "2019-12-27T13:09:04.204Z"
          },
          {
            "id": 44,
            "context": "Worker 'settlements' job #1 settling dispute #0",
            "message": "Cannot read property 'rounds' of undefined",
            "stack": "TypeError: Cannot read property 'rounds' of undefined\n    at module.exports.getJurors (~/court-backend/packages/shared/models/Court.js:100:27)\n    at module.exports.settle (~/court-backend/packages/shared/models/Court.js:346:33)\n    at process._tickCallback (internal/process/next_tick.js:68:7)",
            "createdAt": "2019-12-27T13:00:34.091Z",
            "updatedAt": "2019-12-27T13:00:34.091Z"
          }
        ],
        "total": 45
      }
    ```
