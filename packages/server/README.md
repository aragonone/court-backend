# Court Backend server

This server aims to provide different kind of services to complement the logic implemented at the smart contracts level.

### Setup

To work locally, simply go to the root directory, and make sure you have set up a propoer `.env` file following the `.env.sample` file.
Once you have done that, spin up a docker container with:
```bash
docker-compose build
docker-compose up -d
```

### Endpoints

All the provided endpoints are `Content-Type: application/json`

#### 1. Users

##### 1.1. Create

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

##### 1.2. Exists

- URL: /user/:address
- Method: GET
- Response: 
  - Code: 200
  - Content example: 
    ```json
        {
          "exists": true
        }
    ```

##### 1.3. All

- URL: /users
- Method: GET
- Header:
  - Cookie: `aragonCourtSID=<SID>`
- Query: 
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

#### 2. Reveals

##### 2.1. Create

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

##### 2.2. Show

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

##### 2.3. All

- URL: /reveals
- Method: GET
- Header:
  - Cookie: `aragonCourtSID=<SID>`
- Query: 
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
            "updatedAt":"2019-12-25T14:58:58.705Z"
          }
        ],
        "total": 1
      }
    ```

#### 3. Admins

##### 3.1. Login

- URL: /login
- Method: POST
- Body: 
  - `email`: Admin email
  - `password`: Admin password
- Response: 
  - Code: 200
  - Header:
    - Set-Cookie: `aragonCourtSID=<SID>; Path; Expires; HttpOnly`
  - Content example: 
    ```json
      {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ImZhY3VAYXJhZ29uLm9uZSIsImlhdCI6MTU3ODA4MTI5NCwiZXhwIjoxNTc4MDg0ODk0fQ.lmcJOE0eblD_maqXqyK0_H2swXnvG9lfEm1aJRGiAVw"
      }
    ```
    

##### 3.2. Me

- URL: /me
- Method: GET
- Header:
  - Cookie: `aragonCourtSID=<SID>`
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

##### 3.3. All

- URL: /admins
- Method: GET
- Header:
  - Cookie: `aragonCourtSID=<SID>`
- Query: 
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
            "updatedAt":"2019-12-25T14:58:58.705Z"
          }
        ],
        "total": 1
      }
    ```

##### 3.4. Create

- URL: /admins
- Method: POST
- Header:
  - Cookie: `aragonCourtSID=<SID>`
- Body: 
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

##### 3.5. Delete

- URL: /admins/:id
- Method: DELETE
- Header:
  - Cookie: `aragonCourtSID=<SID>` 
- Response: 
  - Code: 200
  - Content example: empty

### Keys

This repo needs the private key to be defined as a envrionment variable `PRIVATE_KEY`. 
