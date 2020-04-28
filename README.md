# Tallyit API

**Name of app: Tallyiy**

**Live app:** https://tallyit.now.sh/

**App repo:** https://github.com/sPro1ly0/tallyit-app

## Summary

I wanted to make an app that my boyfriend and family could use. My boyfriend's family always has family game night every week, and I thought I could make an app to help them keep track of scores for any games they play. Also, my family has been getting into a habit of playing Rummy and other card games. We also don't want to waste paper and keep track of our progress over time.

Tallyit lets users create an account to keep track of their game scores. A group name is used to sign up and login with for quick and easy use of the app. Users can create games which will make a score sheet for users to add and delete players. The player scores can be edited on the score sheet. The increase button and decrease button number values can be changed to allow any number to be added or subtracted to players' scores. A user's games will appear on their dashboard page with the game's name and date played. Each game is a link to its game statistics page with all the player names and their scores. The players and their scores can be further edited from the game statistics page. The games can also be deleted from the statistics page.

## API Documentation

Protected Endpoints must have a valid authorization token with the request.

All Protected Endpoints Used in Tallyit App:

<ul>
  <li>POST /api/auth/refresh</li>
  <li>GET /api/groups</li>
  <li>GET /api/groups/games</li>
  <li>POST /api/games</li>
  <li>GET /api/games/:game_id</li>
  <li>DELETE /api/games/:game_id</li>
  <li>GET /api/games/:game_id/player-scores</li>
  <li>POST /api/player-scores</li>
  <li>PATCH /api/player-scores</li>
  <li>DELETE /api/player-scores/:player_id</li>
</ul>

---

### Authentication Endpoints

**POST /api/auth/login** - Login to a user account and get authorization token

**Required fields:** group_name

Request body template:
```json
{
    "group_name": "valid group name"
}
```

Request body example:
```json
{
    "group_name": "Best Crew"
}
```

#### Success Response: 200 OK

Response example:
```json
{
    "authToken": "893y94hsdjfhaiuiungerlseimg988343y84y37y4r8347brn9834"
}
```

#### Error Response: 400 BAD REQUEST

Response example for invalid group_name:
```json
{
    "error": "Incorrect group name"
}
```

Response example for missing group_name:
```json
{
    "error": "Missing 'group_name' in request body"
}
```


**POST /api/auth/refresh (Protected)** - Refresh an authorization token and get a new token

Response example:
```json
{
    "authToken": "akkjsdfu2352svngerlseimg988343y8423fefwe834"
}
```
---

### Groups Endpoints

**GET /api/groups (Protected)** - Get a group's information

#### Success Response: 200 OK

Response example:
```json
{
    "group_name":"Demo"
}
```
#### Error Response: 401 UNAUTHORIZED REQUEST

If no authorization token provided.

Response:
```json
{
    "error": "Missing bearer token"
}
```

If authorization token is not valid.

Response:
```json
{
    "error": "Unauthorized request"
}
```

**POST /api/groups** - Create a group

Required fields: group_name

Request body template:
```json
{
    "group_name": "valid group name"
}
```

Request body example:
```json
{
    "group_name":"Cool Cats"
}
```

#### Success Response: 201 CREATED

Header: Location at /api/groups/:group_id

Response example:
```json
{
    "id":123,
    "group_name":"Cool Cats",
    "date_created":"2020-04-20T23:53:43.567Z"
}
```

#### Error Response: 400 BAD REQUEST

Response example for missing 'group_name' field:
```json
{
    "error": "Missing 'group_name' in request body"
}
```

Response example for existing group with same name:
```json
{
    "error": "Group name already taken"
}
```

Response examples for wrong group_name format:
```json
{
    "error": "Group name must be less than 25 characters"
}
```
```json
{
    "error": "Group name must not start or end with empty spaces"
}
```


**GET /api/groups/games (Protected)** - Get a group's games

#### Success Response: 200 OK

Response example:
```json
[
    {
        "id":14,
        "game_name":"Yahtzee",
        "date_created":"2020-04-21T02:24:08.348Z",
        "group":"blue man group"
    },
    {
        "id": 15,
        "game_name":"Uno",
        "date_created":"2020-04-24T02:24:08.348Z",
        "group":"blue man group"
    }
]
```

#### Error Response: 401 UNAUTHORIZED REQUEST

If no authorization token provided.

Response:
```json
{
    "error": "Missing bearer token"
}
```

If authorization token is not valid.

Response:
```json
{
    "error": "Unauthorized request"
}
```

---


### Games Endpoints

All journals endpoints are protected and require authorization token with requests.

**POST /api/games (Protected)** - Create a new game

#### Success Response: 201 CREATED

Header: Location at /api/games/:game_id

Request example:
```json
{
    "game_name": "Go Fish"
}
```

Response example:
```json
{
    "id":28,
    "game_name":"Go Fish",
    "date_created":"2020-04-28T00:06:30.369Z"
}
```

#### Error Response: 400 BAD REQUEST

Response example for missing 'game_name' required field:
```json
{
    "error": {
        "message": "Missing 'game_name' in request body"
    }
}
```

#### Error Response: 401 UNAUTHORIZED REQUEST

If no authorization token provided.

Response:
```json
{
    "error": "Missing bearer token"
}
```

If authorization token is not valid.

Response:
```json
{
    "error": "Unauthorized request"
}
```


**GET /api/games/:game_id (Protected)** - Get a specific game by id 

URL- :game_id is the ID of the game.

#### Success Response: 200 OK

Response example:
```json
{   
    "id":28,
    "game_name":"Uno",
    "date_created":"2020-04-28T00:06:30.369Z",
    "group":"Demo"
}
```
#### Error Response: 404 NOT FOUND

If there is no game with given id.

Response:
```json
{
    "error": { 
        "message": "Game does not exist" 
     }
}
```

#### Error Response: 401 UNAUTHORIZED REQUEST

If no authorization token provided.

Response:
```json
{
    "error": "Missing bearer token"
}
```

If authorization token is not valid.

Response:
```json
{
    "error": "Unauthorized request"
}
```

**DELETE /api/games/:game_id (Protected)** - Delete a specific game by id

URL- :game_id is the ID of the game.

#### Success Response: 204 NO CONTENT

#### Error Response: 404 NOT FOUND

If there is no game with given id.

Response:
```json
{
    "error": { 
        "message": "Game does not exist" 
     }
}
```

#### Error Response: 401 UNAUTHORIZED REQUEST

If no authorization token provided.

Response:
```json
{
    "error": "Missing bearer token"
}
```

If authorization token is not valid.

Response:
```json
{
    "error": "Unauthorized request"
}
```


**GET /api/games/:game_id/player-scores (Protected)** - Get a specific game by id and its player scores

URL- :game_id is the ID of the game.

#### Success Response: 200 OK

```json
[
    {
        "id": 60,
        "player_name": "Hannah",
        "score": 152,
        "game_id": 26,
        "date_created": "2020-04-27T22:52:48.466Z","date_modified": "2020-04-27T22:55:39.051Z"
    },
    {
        "id": 61,
        "player_name": "Rey",
        "score": 154,
        "game_id": 26,
        "date_created": "2020-04-27T22:53:05.236Z","date_modified": "2020-04-27T22:55:39.051Z"
    },
    {
        "id": 62,
        "player_name": "Mom",
        "score": 140,
        "game_id": 26,
        "date_created": "2020-04-27T22:53:20.378Z","date_modified": "2020-04-27T22:55:39.051Z"
    },
    {
        "id": 63,
        "player_name": "Tom",
        "score": 146,
        "game_id": 26,
        "date_created": "2020-04-27T22:53:36.998Z","date_modified": "2020-04-27T22:55:39.051Z"
    }
]
```

#### Error Response: 404 NOT FOUND

If there is no game with given id.

Response:
```json
{
    "error": { 
        "message": "Game does not exist" 
     }
}
```

#### Error Response: 401 UNAUTHORIZED REQUEST

If no authorization token provided.

Response:
```json
{
    "error": "Missing bearer token"
}
```

If authorization token is not valid.

Response:
```json
{
    "error": "Unauthorized request"
}
```

---

### Player Scores Endpoints


**POST /api/player-scores (Protected)** - Add a player.

Required fields: player_name and game_id

Request example:
```json
{
    "player_name": "Rachel",
    "game_id": 27
}
```

#### Success Response: 201 CREATED

Header: Location at /api/player-scores/:player_id

```json
{
    "id": 74,
    "player_name": "Rachel",
    "score": 0,
    "game_id": 27,
    "date_created": "2020-04-28T00:26:32.775Z",
    "date_modified": null
}
```

#### Error Response: 400 BAD REQUEST

Response example for missing one required field:
```json
{
    "error": {
        "message": "Missing 'player_name' in request body"
    }
}
```

#### Error Response: 401 UNAUTHORIZED REQUEST

If no authorization token provided.

Response:
```json
{
    "error": "Missing bearer token"
}
```

If authorization token is not valid.

Response:
```json
{
    "error": "Unauthorized request"
}
```

**PATCH /api/player-scores (Protected)** - Update an array of player scores.

Request Example:
```json
[
    {
        "id": 60,
        "player_name": "Allie",
        "score": 152,
        "game_id": 26,
        "date_created": "2020-04-27T22:52:48.466Z","date_modified": null
    },
    {
        "id": 62,
        "player_name": "Mom",
        "score": 140,
        "game_id": 26,
        "date_created": "2020-04-27T22:53:20.378Z","date_modified": null
    },
    {
        "id": 63,
        "player_name": "Tim",
        "score": 146,
        "game_id": 26,
        "date_created": "2020-04-27T22:53:36.998Z","date_modified": null
    }
]
```

#### Success Response: 204 NO CONTENT

#### Error Response: 400 BAD REQUEST

If request body doen't have a 'score' property.

Response:
```json
{
    "error": { 
        "message": "Request body must have 'score'" 
     }
}
```

#### Error Response: 401 UNAUTHORIZED REQUEST

If no authorization token provided.

Response:
```json
{
    "error": "Missing bearer token"
}
```

If authorization token is not valid.

Response:
```json
{
    "error": "Unauthorized request"
}
```

**DELETE /api/player-scores/:player_id (Protected)** - Delete a specific player by id

URL- :player_id is the ID of the player score.

#### Success Response: 204 NO CONTENT

#### Error Response: 404 NOT FOUND

If there is no game with given id.

Response:
```json
{
    "error": { 
        "message": "Player does not exist" 
     }
}
```

#### Error Response: 401 UNAUTHORIZED REQUEST

If no authorization token provided.

Response:
```json
{
    "error": "Missing bearer token"
}
```

If authorization token is not valid.

Response:
```json
{
    "error": "Unauthorized request"
}
```

## Technologies Used

<ul>
  <li>Node.js</li>
  <li>Express.js</li>
  <li>PostgreSQL</li>
  <li>Postgrator for SQL migration</li>
  <li>Knex.js a SQL Query Builder</li>
  <li>JWT for authentication</li>
  <li>Supertest, Mocha, and Chai for testing</li>
</ul>
