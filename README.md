# Documentation 
[![Build Status](https://travis-ci.org/sjgeyer/16-19-auth.svg?branch=master)](https://travis-ci.org/sjgeyer/16-19-auth)

The below functions should call to the following link:

[https://back-end-deployment-sgeyer.herokuapp.com/](https://back-end-deployment-sgeyer.herokuapp.com/)

## Routes available

### /signup

#### `.post('/signup')`
Creates a user using the input username, email, and password (email must be unique). User's password will be stored securely in the database, i.e. not as plaintext.

Requests must be sent in the following form: 

    {  
       username: 'johndoe',
       password: 'examplepassword',
       email: 'john@doe.com'
    }
    
The database will respond with a unique token that the user can then use as their authorization to access other routes.

Example response from a `.post('/signup')` route

    {  
        "token": "jwdAxL1y2eL4T2Lui3lE2TBS7wAqK..."
    }

Possible status codes:
- 200: Successful user profile creation
- 400: Required information missing
- 409: Email already exists in database

### /login

#### `.get('/login')`
Logs the user into the app and returns a unique token. User must pass in their username and password.

Requests must be sent in the following form:

    {  
       username: 'johndoe',
       password: 'examplepassword'
    }


Example response from a `.get('/login')` route

    {  
       "token": "jwdAxL1y2eL4T2Lui3lE2TBS7wAqK..."
    }
   
Possible status codes:
- 200: Successful login
- 400: Login unsuccessful

### /pets

#### `.post('/pets')`
 Creates a new pet on the user's account with user token authorization. User must pass in the pet's name and type in the following form:
 
     {  
        name: 'Linus',
        type: 'Cat'
     }

The request will return a JSON object of the newly instantiated pet.

     {  
        "name": "Linus",
        "type": "Cat",
        "dateAdopted": "2018-05-10T23:46:45.680Z",
        "account": "89390843849232323",
        "_id": "5af4d9e59285605b08aeb40f",
        "__v": 0,
     }

Possible status codes:
- 200: Successful pet creation
- 400: Required information missing
- 401: Unauthorized

#### `.get('/pets/:id')`
Returns a JSON object of the pet associated with the user's account, similar to `.post('/pets')` User must pass in the pet's id and their unique token.

Possible status codes:
- 200: Successful retrieval of pet
- 400: Required information missing
- 401: Not authorized
- 404: Pet not found

### /images

#### `.post('/images')`
Uploads an image to the AWS S3 bucket and creates an image instance in the database. User must pass in the local filepath and image name.

Possible status codes:
- 200: Successful image post
- 400: Required information missing
- 401: Unauthorized

#### `.get('/images/:id')`
Returns image data from the database.

     {  
        "name": "Nightlife",
        "url": "http://lorempixel.com/640/480/nightlife",
        "createdOn": "2018-05-10T23:46:45.680Z",
        "account": "5af4d9e59285605b08aeb40e",
        "key": "483201439284938593204023.nightlife.jpg",
        "_id": "5af4d9e59285605b08aeb40f",
        "__v": 0
     }

Possible status codes:
- 200: Successful retrieval of image information
- 401: Not authorized
- 404: Image not found

#### `.delete('/images/:id')`
Deletes image at specified id.

Possible status codes:
- 204: Successful image delete
- 401: Not authorized
- 404: Image not found

### Installation and use

To install:

    npm install

To build:

    npm run build

To start server locally:

    npm run start

### Testing

To begin testing, run:

    npm run dbon
    npm test
    
When finished, run:

    npm run dboff
