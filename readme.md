# React: Authentication with JWTs

## Learning Objectives (5 min / 0:05)
- Describe JSON web tokens (JWTs)
- Identify parts of JWTs
- Add JWT authentication with Passport to a MERN app

## Framing (20 min / 0:25)

### What is a JSON Web Token?

[Official definition](https://tools.ietf.org/html/rfc7519): compact, URL-safe means of representing claims to be transferred between two parties. 

In other words: A JSON web token is JSON-formatted data sent securely between the server and the browser via HTTP requests. 

### Authentication with JWTs

The problem that JWTs seek to overcome: HTTP is stateless, but we need a way to tell the server that a user is logged in.

When making requests or performing actions that are only for authorized users, there needs to be a way to keep track of whether a user is logged in, since that information isn't stored in HTTP by nature. 

For instance, when we implemented Passport for user authentication, we used sessions to remind the server of "logged-in status" with every request made to the server. A session is a place to store data on the browser during one request which can be read during later requests. The session is a JS object that allows us to keep track of this information. When a new user signs into an application, we create a new session in the server, and a cookie for this session is sent in a response back to the browser. In future HTTP requests from the browser, the client sends a session cookie to the server to retrieve the user from the database to then authenticate the authorized interaction with the database (e.g. saving a post, editing data).

Another approach to keeping track of a user being logged in is to use JWTs with Passport. With JWTs, the user info is embedded in a token. Upon initial log in, the server creates a JSON "token" to store the user info. These tokens are "signed" by the server, and only the server holds the private key to read the token.

#### How It Works

![JWT vs. Sessions Diagram](https://cdn-images-1.medium.com/max/1600/1*d6YcPvq7TeU0DTamj629xw.png)

1. Client browser makes a request sending user login credentials and password (only has to do this once)
2. Server validates the credentials and sends a JSON response to the client that encodes user login data
3. Client stores this JSON web token
4. When the client sends a request to a route that requires authentication, it will send this token to the API to present its authorization for access

#### Advantages of using JWTs:

- JWTs are self-contained
    - You have all the information about the user within the token. After inital request from browser, the server doesn't need to interact with the database to know who the user is. Using JWTs limit database lookups.
- JWTs are compact, and transmission through HTTP actions is fast.
- JWTs work the same for browser clients and native mobile apps.

### What does a JWT look like?

A string with three parts, each separated by dots (`.`):

    - header
    - payload
    - signature

#### Header

**Header** is a JSON object consisting of two parts: the type of token (typ) and the hashing algorithm being used on the token (alg).

> Example...
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### Payload

**Payload** is a JSON object containing claims. Claims refer to statements about an entity (e.g. user data). You can put as many claims into the payload as you want, though you want to be cognizant of keeping the JWT compact so as not to impact performance of HTTP actions.

> Example...
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "userId": "5z-9328477bz",
  "admin": true
}
```

There are three different types of claims: public claims, private claims, and registered claims.

Registered claims refer to claims that have predetermined key names - e.g. common fields like issuer ("iss"), subject ("sub"), and expiration time ("exp").

Public claims are claims that we create - e.g. "name", "userId", and "admin" above.

Private claims are used when JWTs are sent between two parties. Only these two parties know what the claims respresent.

#### Signature
**Signature** is encoded header and payload signed with a secret key.

The header is encoded, and the payload is encoded. They are joined together with a `.` in between. This string is then hashed with the server's secret key, using header's hashing algorithm. This produces a new string, which is added onto the `<header>.<payload>` string with another `.` between.

The signature allows the receiver to ensure that the JWT was sent from an authentic source (the holder of the secret key). This encoding does not serve to encrypt the data, but to transform the data.

> Note: [Refresher on difference between encoding, encrypting, and hashing.](https://danielmiessler.com/study/encoding-encryption-hashing-obfuscation/)

#### Final product

Encoded string vs. decoded JSON:

![JWT: encoded string vs. decoded JSON](https://cdn-images-1.medium.com/max/2000/1*LAo6s2tlszZdk2x-uE1lqA.png)

### Using JWTs with Passport in a MERN app

Passport allows you to store the user object in requests instead of in session cookies. Upon the log-in request, the server will create a token and pass it to the browser in the HTTP response. The token is saved to local storage in the browser.

When the user wants to access a route that requires authorization, the client will send a JWT with the request to the server. Since the server has the secret key to decode the JWT, it can (a) verify that the JWT has the right signature to ensure that the JWT originally came from that server, and (b) verify the user and then perform the action that needed authorization.

### Additional Resources on JWTs:
- https://medium.com/vandium-software/5-easy-steps-to-understanding-json-web-tokens-jwt-1164c0adfcec
- https://jwt.io/introduction/

## We Do: Implementing Authentication with JWT

### Starter Code

Start out by cloning the repo:

```sh
$ git clone https://github.com/ship-of-the-desert/week_11_day_03_authorization_react_nodejs.git

$ npm install
$ cd frontend 
$ npm install
```

Take 10 min to review the starter code. Look for:

- models
- controllers
- CRUD functionality?

# Break

### Config Directory

```sh
$ open config/passport.js
```

The config directory is where we are going to put all the code to build out passport and our JWTs. It will look a little bit different than the passport we built out before.

To start, we need to install a few dependencies:

```sh
$ npm install jsonwebtoken passport-jwt --save
```

In `.env`, we'll create a secret key for our JWTs:

```env

JWTSecret = JwtS3cr3tK3Y

```

Then, we will build out passport.

In `passport.js`...

```js
...
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
  },
  function (jwtPayload, cb) {

    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return User.findById(jwtPayload._id)
      .then(user => {
        return cb(null, user);
      })
      .catch(err => {
        return cb(err);
      });
  }
));
...
```

### User Controller

In order to log in (or sign up), we'll need to make post requests to the server to find (or create) the user in the database and create a JWT to represent the user is logged in. We can manage these requests in a user controller.


Then, we'll make a user controller file in the command line:

```sh
$ touch routes/user.routes.js
```

In `server.js`...

```js
//Auth Routes
server.use('/api/auth', require('./routes/auth.routes'))

//user routes
server.use('/api/users', passport.authenticate('jwt', {session: false}), require('./routes/users.routes'))

//game routes
server.use('/api/games', passport.authenticate('jwt', {session: false}),gameRoutes)
```

In `auth.routes.js`, we will start out like we would with a typical controller...

```js
const express = require('express')
const router = express.Router()


module.exports = router
```


In order to query the database for users and create new users, we'll need to require the User schema built out in the models folder...

```js
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const saltRounds = 10

const userSchema = new Schema({
 email : { type: String, required: true, unique : true},
 username : { type: String, required: true, unique : true},
 password : { type: String, required: true},
 games : [{ type: Schema.Types.ObjectId, ref : 'Game'}]
},{timestamps : true})

//hash password on save
userSchema.pre('save',function(next){
    let user = this

    if(user.password && user.isModified('password')){
        
      bcrypt.hash(user.password, saltRounds, (err, hash)=>{
        if(err){ return next()}

        user.password = hash
        next()
      })
    }

})

//compare hashed with plain password
userSchema.methods.verifyPassword = (plainPassword, hashedPassword, cb) => {

 bcrypt.compare(plainPassword, hashedPassword, (err, response) => {
   if(err) { 
     return cb(err) 
   }
   return cb(null, response)
 })
}

const User = mongoose.model('User', userSchema)
module.exports = User
```

#### Sign Up

We will begin creating routes for requests made from the browser. First, we will build out functionality for a `post` request to `/api/auth/register`. The logic involved is:

- Receive sign-up form input (email and password) from the browser
- Query the database to see if another user has used that email
- If not, create an instance in the database with new user email and password
- Generate a JWT holding the user id
- Send the JWT back to the browser

In `auth.routes.js`...

```js
router.post('/register', (request, response) => {

  let userInput = {
   username : request.body.username,
   email: request.body.email,
   phone: request.body.phone,
   password: request.body.password
  }


  //instance of data
  let user = new User(userInput)

  console.log(user)
  // //save the data
  user.save()
    .then(()=>{
        return response.json({ message: 'user created' });
    }).catch(e => {
        return response.status(401).json({ error: 'error saving user', msg: e });
    })

  
})
```

#### Testing Sign Up with Postman 

To verify that this post request will work, let's use our nifty tool, Postman. Start up the server with `nodemon`.

In Postman:

- Uhoose POST verb
- Url: `http://localhost:4000/api/register`
- Headers: 
    - Key: 'Content-Type'
    - Value: 'application/json'
- Body:
    - Raw
    - JSON (application/json)
    - ```json
        {
            "email": "meg@email.com",
            "password": "meg123"
        }
      ```

Hit "SEND"!

Then, scroll down to see the server response. You should see a JSON object with a token value.

# Break

#### Log In

In the auth routes, we will create a method to handle `post` requests to create a token when a user logs in. It will:

- Receive sign-up form input (email and password) from the browser
- Query the database for that user
- Verify the password sent from the browser matches the password in the database
- Generate a JWT holding the user id
- Send the JWT back to the browser

In `/routes/auth.routes.js`...

```js
router.post('/login', (request, response) => {

  passport.authenticate('local', {session: false}, (err, user, info) => {

    if (err || !user) {
        return response.status(401).json({
            message: info ? info.message : 'Login failed',
            user   : user
        });
    }

   request.login(user, {session: false}, (err) => {
          if (err) {
              return response.status(401).json({message: err});
          }
          // generate a signed json web token with the contents of user object and return it in the response
          user.password = '' //remove password
          console.log(user)
          const token = jwt.sign(user.toJSON(), 'your_jwt_secret', { expiresIn: 60 * 60 });
          return response.status(200).json({user, token});
        });
    })(request, response);
   
})
```

#### Testing Log In with Postman 

In Postman:

- Choose POST verb
- Url: `http://localhost:4000/api/auth/login`
- Headers: 
    - Key: 'Content-Type'
    - Value: 'application/json'
- Body:
    - Raw
    - JSON (application/json)
    - ```json
        {
            "email": "meg@email.com",
            "password": "meg123"
        }
        ```

Hit "SEND"!

Once again, you should see a JSON object with a token value sent in a response.

### Front End: Log In and Sign Up

#### Starter Code

- components
- any API calls
- forms

#### Sign Up

When you go to the starter code in the `SignUpForm.js` component, you'll see that the form input fields fire off a few different methods. When the methods start with `this.props...`, you know the methods have been passed through from the parent component (in this case, `App.js`).

In `App.js`, the method for `handleInput` is already defined.

Next we need to code functionality for the `handleSignUp` method. Given that this form is taking user input to be put into the database, we'll want to make an `axios` request to the server. In `App.js` in `handleSignUp`:

> Students Do

This takes the input from the form and creates a new user with that information. Per our set up on the back end, the server sends the browser a response.

In your command line, start up the app in the browser with `npm start` to test out the sign up feature.

> More on the [localStorage object](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

#### Log Out

When you've gained the ability to sign up, you'll want to incorporate logging out functionality. Refer to the `LogOut method` component.

To give this method functionality, fill in the `logout` method in `App.js`:

```js
 logout = () =>{
    logout()
    let data = {...this.state}
    data.isAuthenticated = false
    data.user = ""
    data.email = ""
    data.password = ""
    data.games = []

    this.setState(data)
  }
  registerHandler = (e) => {
    axios.post('/api/auth/',{})
    .then( response => {

    })
    .catch()
  }

```

This sets the email and password properties in state back to empty strings, changes the state `isLoggedIn` property to false, and clears the localStorage of JWTs.

#### Log In

The final functionality we need is the ability to log in. We need to add a method `loginHandler` (needs to be written) methods in the parent component.

In `App.js`, fill out the `loginHandler` method with...

```js
  loginHandler = () => {
   axios.post('/api/auth/login',{ email: this.state.email, password: this.state.password})
    .then( response => {
      console.log(response.data)
      if(response.data.token){
        setToken(response.data.token)

        let data = {...this.state}
        data.user = response.data.user
        data.isAuthenticated = true
        data.hasError = false

        this.setState(data)

        this.getGames()
      }
      
    })
    .catch(err =>{
      let data = {...this.state}
        data.hasError = true
        this.setState(data)

    })
  }
```

As written in the back-end code, this has the server verify the user information with the database and creates a JWT token to be passed back to the browser, which is then stored in localStorage.

Your app now has functionality to sign up, log out, and log in, using passport authentication with JWTs.


### Extras
> Implement Add Games
### Additional Resources on using JWTs in MERN apps

- https://medium.com/@rajaraodv/securing-react-redux-apps-with-jwt-tokens-fcfe81356ea0
- https://hptechblogs.com/using-json-web-token-react/
- https://blog.jscrambler.com/implementing-jwt-using-passport/
- [FAQs: Authentication with tokens (vs cookies)](https://auth0.com/blog/ten-things-you-should-know-about-tokens-and-cookies/#token-oauth)
- [Using bcrypt](https://jonathas.com/token-based-authentication-in-nodejs-with-passport-jwt-and-bcrypt/)
