#Dancing Cities
http://dancingcities.herokuapp.com

Built by:

- Morgan Neiman https://github.com/quackhouse
- Jaclyn Jimenez http://github.com/jaclynj

Dancing Cities is a virtual representation of New York City that 'moves' to music. The city is dynamically generated using NYC data in the following ways:

- The buildings you see in DancingCities are placed onto the scene using latitude and longitude data of popular NYC spots by making a request to the Foursquare API. If the user is located in NYC, the buildings are generated dynamically based on the users' location and surrounding area.
- Each frame, you can see the buildings change height cooresponding to the music track that is playing. The song is streamed using the SoundCloud API and the track is converted to listenable data using the WebAudio API. Many changing elements within the city are timed to correspond with points in the song.
- The sky is generated based on the local time of day and current weather in New York City, using the Yahoo Weather API.
Users can leave messages on the vitual 'Graffiti Wall'. These messages are all added by users and persist on the wall.
- When the page loads, it uses the Twitter API to gather tweets that contain the hashtag #dancingcities as well as the most recent tweets from within New York City. Look up in the sky to read the tweets.
- Users that log in through Twitter enjoy personalized features including messages in the sky addressing them, and their profile picture in a spinning circle in-game.
- Look for the many spinning spheres among the buildings, they change when you move close to them and contain different cartoons and maps of NYC.


##TOOLS

###APIs & Gems:

- SoundCloud API - hosts the streaming audio
- WebAudio API - uses the soundcloud track to control the music, and provides array of data. The array of data is used to move the shapes.
- geolocation data - provides latitude and longitude coordinates of user if he/she is in NYC
- Foursquare API - generates 3D buildings based on latitude and longitude of popular places in NYC
- Twitter gem - for finding location-based tweets, user authentication & inserting user image and name into 3D city
- Yahoo Weather API - for NYC weather-based changes

###Languages/Librarys:
- Ruby: Rails
- JavaScript: ThreeJS (library for WebGL), ShaderParticles (helper library for ThreeJS), PhysiJS (Physics library for ThreeJS using Ammo), AmmoJS (Physics library) AJAX & jQuery

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


###Jaclyn

- Project Manager & Back-End Lead
- Responsible for documentation, hosting GitHub Repo & pushing to Heroku
- Responsible for managing rails routes and database tables
- Responsible for data from various APIs and ensuring implimentation via AJAX requests
- Responsible for making current user data & messages accessible from the threeJS game


##MVP
###User Stories
#####As A non-logged in User:

- I want to see a page that tells me what the game is, what the controls are, and what logging-in does("log in with twitter  to personalize your experience").
- On this page I want to see a button that will log me in to twitter, and a button that will allow me to play without logging in.

#####As a non-logged in User who clicked 'log in':

- I want to log in and then be taken to the game.
- If I tried logging in with incorrect info, I want to try to log in again.

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

#####As an admin I want to:

- Be able to log in as an admin
- delete user messages
- Be able to log out



