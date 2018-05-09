# Documentation

This app creates a new user and stores it in the database.

## Routing functions

### .post()
`Router.post('/signup')` : Creates a user using the input username, email, and password (email must be unique). User's password will be stored securely in the database, i.e. not as plaintext.

Possible status codes:
- 200: Successful user profile creation
- 400: Required information missing
- 409: Email already exists in database

`Router.get('/login')` : Finds an existing 

### Installation

To install, run:

    npm install

### Testing

To begin testing, run:

    npm run dbon
    npm test
    
When finished, run:

    npm run dboff
