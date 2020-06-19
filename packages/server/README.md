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

##### 1.1. Check existing subscription details

  Request:

  - Method: `GET`
  - Path: `/users/<address>`
  - Body: None

  Successful response: 

  - Code: `200 OK`
  - Body:

  ```
  {
    "emailExists": true || false,
    "emailVerified": true || false,
    "addressVerified": true || false,
    "notificationsDisabled": true || false
  }
  ```

##### 1.2. Create session

  This request will authenticate the session with address signature and respond with the appropriate session `Set-Cookie` header. In addition, it will set `"addressVerified": true` using the provided signature.

  All following requests should have the returned `Cookie` HTTP header in order to be authenticated.

  Request:

  - Method: `POST`
  - Path: `/users/<address>/sessions`
  - Body:

  ```json
  {
    "signature": "0xa8afa92...8b1e52a",
    "timestamp": 123456
  }
  ```

  Successful response:

  - Code: `200 OK`
  - Body:

  ```json
  {
    "authenticated": true
  }
  ```

  Error responses: invalid signature / timestamp

  - Code: `400 Bad Request`
  - Body:

  ```
  {
    "errors": [
      { "signature": "Given signature is invalid" }
      ...
      { "timestamp": "Given timestamp is invalid" }
    ]
  }
  ```

##### 1.3. Delete session

  Request:

  - Method: `DELETE`
  - Path: `/users/<address>/sessions:current`
  - Body: None

  Successful response:

  - Code: `200 OK`
  - Body:

  ```json
  {
    "deleted": true
  }
  ```

##### 1.4. Delete sessions on all user devices

  Request:

  - Method: `DELETE`
  - Path: `/users/<address>/sessions`
  - Body: None

  Successful response:

  - Code: `200 OK`
  - Body:

  ```json
  {
    "deleted": true
  }
  ```

##### 1.5. Get current email

  Request:

  - Method: `GET`
  - Path: `/users/<address>/email`
  - Body: None

  Successful response:

  - Code: `200 OK`
  - Body:

  ```
  {
    "email": "new-juror@aragoncourt.com" || null
  }
  ```

##### 1.6. Subscribe juror / Change juror email

  Note: this will also automatically send verification email

  Request:

  - Method: `PUT`
  - Path: `/users/<address>/email`
  - Body:

  ```json
  {
    "email": "juror@aragoncourt.com"
  }
  ```

  Successful response:

  - Code: `200 OK`
  - Body:

  ```json
  {
    "email": "juror@aragoncourt.com",
    "sent": true
  }
  ```

  Error response: email already set / bad format

  - Code: `400 Bad Request`
  - Body:

  ```
  {
    "errors": [
      { "email": "Given email is already set" }
      ...
      { "email": "Given email address is not valid" }
    ]
  }
  ```

  Error response: Could not send email

  - Code: `500 Internal Server Error`
  - Body:

  ```json
  {
    "errors": [
      { "email": "Could not send email." }
    ]
  }
  ```

##### 1.7. Verify juror email

  Note: this endpoint is unauthenticated

  Request:

  - Method: `POST`
  - Path: `/users/<address>/email:verify`
  - Body:

  ```json
  {
    "token": "V5Z6drJdytlNa98asfnOs13Gf90K9vZFVdSQ"
  }
  ```

  Successful response:

  - Code: `200 OK`
  - Body:

  ```json
  {
    "verified": true
  }
  ```

  Error response: user email / token errors

  - Code: `400 Bad Request`
  - Body:

  ```
  {
    "errors": [
      { "email": "No associated email found" }
      ...
      { "email": "Email is already verified" }
      ...
      { "token": "A token must be given" }
      ...
      { "token": "Given token is invalid" }
      ...
      { "token": "Given token has expired" }
    ]
  }
  ```

##### 1.8. Re-send verification email

  Request:

  - Method: `POST`
  - Path: `/users/<address>/email:resend`
  - Body: None

  Successful response:

  - Code: `200 OK`
  - Body:

  ```json
  {
    "sent": true
  }
  ```

  Error response: email errors

  - Code: `400 Bad Request`
  - Body:

  ```
  {
    "errors": [
      { "email": "No associated email found" }
      ...
      { "email": "Email is already verified" }
    ]
  }
  ```

  Error response: Could not send email

  - Code: `500 Internal Server Error`
  - Body:

  ```json
  {
    "errors": [
      { "email": "Could not send email." }
    ]
  }
  ```

##### 1.9. Delete email / Cancel sign up process

  Request:

  - Method: `DELETE`
  - Path: `/users/<address>/email`
  - Body: None

  Successful response:

  - Code: `200 OK`
  - Body:

  ```json
  {
    "deleted": true
  }
  ```

##### 1.10. Switch notifications off/back on

  Request:

  - Method: `PUT`
  - Path: `/users/<address>/notifications`
  - Body:

  ```
  {
    "disabled": true || false
  }
  ```

  Successful response:

  - Code: `200 OK`
  - Body:

  ```
  {
    "disabled": true || false
  }
  ```

  Error response: missing option

  - Code: `400 Bad Request`
  - Body:

  ```json
  {
    "errors": [
      { "disabled": "request must contain a boolean \"disabled\" property" }
    ]
  }
  ```


##### 1.A1. Session error responses

  Error response: missing user

  - Code: `404 Not Found`
  - Body:

  ```json
  {
    "errors": [
      { "address": "User <address> not found." }
    ]
  }
  ```

  Error response: no session found

  - Code: `401 Unauthorized`
  - Body:

  ```json
  {
    "errors": [
      { "access": "Unauthorized, please authenticate at /users/<address>/sessions" }
    ]
  }
  ```

  Error response: session found for another user

  - Code: `403 Forbidden`
  - Body:

  ```json
  {
    "errors": [
      { "access": "You don't have permission to edit user <address>" }
    ]
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

- URL: /reveals/:juror/:voteId
- Method: GET
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
  - Cookie: `aragonCourtSessionID=<SID>`
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
    - Set-Cookie: `aragonCourtSessionID=<SID>; Path; Expires; HttpOnly`
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
  - Cookie: `aragonCourtSessionID=<SID>`
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
  - Cookie: `aragonCourtSessionID=<SID>`
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
  - Cookie: `aragonCourtSessionID=<SID>`
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
  - Cookie: `aragonCourtSessionID=<SID>` 
- Response: 
  - Code: 200
  - Content example: empty

### Keys

This repo needs the private key to be defined as a envrionment variable `PRIVATE_KEY`. 

Also email verification requires JWT private key `EMAIL_JWT_PRIVATE_KEY`.
This can be generated with `node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`
