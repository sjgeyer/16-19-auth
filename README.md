# Documentation

This app creates a new user and stores it in the database.

## Account routing functions
### .post()
`Router.post('/signup')` : Creates a user using the input username, email, and password (email must be unique). User's password will be stored securely in the database, i.e. not as plaintext.

Possible status codes:
- 200: Successful user profile creation
- 400: Required information missing
- 409: Email already exists in database

### .get()
`Router.get('/login')` : Logs the user into the app. User must pass in their username and password.

Possible status codes:
- 200: Successful login
- 400: Login unsuccessful

## Pet routing functions
### .post()
`Router.post('/pets')` : Creates a new pet on the user's account. User must pass in the pet's name and type.

Possible status codes:
- 200: Successful pet creation
- 400: Required information missing
- 401: Unauthorized

### .get()
`Router.get('/pets')` : Returns a pet associated with the user's account. User must pass in the pet's id.

Possible status codes:
- 200: Successful retrieval of pet
- 400: Required information missing
- 401: Not authorized
- 404: Pet not found

### Installation

To install, run:

    npm install

### Testing

To begin testing, run:

    npm run dbon
    npm test
    
When finished, run:

    npm run dboff
