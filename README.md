#Dancing Cities

Dancing Cities is a beautiful way to visualize and interact with a city as it moves to music. The tone is surreal and immersive and the user is open to explore this virtual world however he/she wants, and see how it connects & represents the real city. The user has the chance to leave a personal message in the virtual city, leaving an imprint for all other visitors to see.


##TOOLS

###APIs:

- GoogleMaps API - provides latitude and longitude coordinates where buildings will be generate. 
- Twitter API - for authentication and for finding location-based tweets
- SoundCloud API - hosts the streaming audio
- WebAudio API - uses the soundcloud track to control the music, and provides array of data. The array of data is used to move the shapes.

###Languages/Librarys:
- Ruby: Rails
- JavaScript: ThreeJS(built on WEBGL), ShaderParticlesJS(also built on WebGL), AJAX & jQuery

## Data Models
- Users
- Messages
- Admins

##Team Roles

###Morgan

- Design Lead
- Responsible for WebGL & ThreeJS, generating game elements
- Responsible for gameplay & design
- Responsible for music
- Responsible for implimenting all data collected from APIs and tables into in-game visualizations

###Eddie

- Back-End Lead
- Responsible for data from google maps API
- Responsible for data from twitter location-based tweets
- Responsible for making sure tweets can be impliemented in the javascript game via AJAX requests
- Responsible for splash pages and designing them with CSS

###Jaclyn

- Project Manager
- Responsible for documentation, hosting GitHub Repo & pushing to Heroku
- Responsible for managing rails routes and database tables
- Responsible twitter user authentication, user table & cooresponding sessions controller
- Responsible for making sure current user data & messages are accessible from the threeJS game


##MVP
###User Stories
#####As A non-logged in User:

- I want to see a page that tells me what the game is, what the controls are, and what logging-in does("log in with twitter  to personalize your experience"). 
- On this page I want to see a button that will log me in to twitter, and a button that will allow me to play without logging in.

#####As a non-logged in User who clicked 'log in':

- I want to log in and then be taken to the game.
- If I tried logging in with incorrect info, I want to try to log in again, or be able to change my mind and play the game without logging in.

#####As a non-logged in User who clicks 'play without logging in' OR as a logged-in User:

- I want to be taken to the start of the game.

#####As a player (logged in or not) I want to:

- hear music
- see objects dancing to the music
- move using arrow keys 
- jump (on objects)
- see twitter messages based on location(twitter messages from people in that area of the city)

#####As a player (logged in or not) when I come to a wall with messages, I want to:
-  Be able to add a message to the wall. I want to see my message on the wall after I send the message form.
-  when other users log into the game, they will see my message.

#####In addition to the the above, as a LOGGED-IN player:

- I will see my twitter profile picture on a building
- I will see my name somewhere on a building

#####As a player, once the song is over & the game ends:

- I want to have the option to play again
- I want to have the option to tweet about the game
- I want the ablity to log out if I am logged in. If I am not logged in I should not see the option to log out.

#####As a player on the gameover screen
- if I clicked 'play again' I should be taken to the begining of the game & song, and if I am logged in I should stay logged in. If I'm not logged in, I should have the option to log in this time.
- If I clicked 'tweet about this', I should be taken to twitter to post a tweet with a hashtag #dancingcities.
- If I clicked log out, I should be able to log out of twitter.

###////end of MVP

###Backlog

#####As an admin I want to:

- Be able to log in as an admin
- change the song that is playing by entering a new soundcloud link
- delete user messages
- change coordinates of objects that generate
- Be able to log out
######other possible features
- add elevation data to generating shapes
- As a player, I would like to visit other cities
- As a player, I want to see the stats of what you discovered/interacted with at the end of the game


