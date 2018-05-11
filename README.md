# Documentation

## Account routing functions

These functions can add, retrieve, and remove a user instance to/from the database.

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

These functions can add, retrieve, and remove a pet instance to/from the database. The pets can belong to a single user.

### .post()
`Router.post('/pets')` : Creates a new pet on the user's account. User must pass in the pet's name and type.

Possible status codes:
- 200: Successful pet creation
- 400: Required information missing
- 401: Unauthorized

### .get()
`Router.get('/pets/:id')` : Returns a pet associated with the user's account. User must pass in the pet's id.

Possible status codes:
- 200: Successful retrieval of pet
- 400: Required information missing
- 401: Not authorized
- 404: Pet not found

## Image Routing Functions

These functions can add and remove an image from an AWS Bucket. It can also retrieve information about the image from the database.

### .post()
`Router.post('/images')` : Uploads an image to the AWS database.

Possible status codes:
- 200: Successful image post
- 400: Required information missing
- 401: Unauthorized

### .get()
`Router.get('/images/:id')` : Returns image data from the database

Possible status codes:
- 200: Successful retrieval of image information
- 401: Not authorized
- 404: Image not found

### .delete()
`Router.delete('/images/:id')` : Deletes image at specified id.

Possible status codes:
- 204: Successful image delete
- 401: Not authorized
- 404: Image not found

### Installation

To install, run:

    npm install

### Testing

To begin testing, run:

    npm run dbon
    npm test
    
When finished, run:

    npm run dboff
