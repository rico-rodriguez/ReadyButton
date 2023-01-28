# Ready button - Development
![2023-01-21 03_43_30-](https://user-images.githubusercontent.com/97664519/215286018-c88d47a2-f5d3-4713-96ec-e9530a40db0e.png)
https://readybutton.netlify.app/


### Maybe uneventful at first glance. But, whats going on behind the scenes is incredible.
#### You can create your own instance of the Ready Button by visiting any url you want. Just add anything after the trailing '/' of the URL and you will create your own button that you can share to anyone.
#### If someone clicks a link, their client sends a signal to the API hosted on the server. The server then send a signal to all clients using web sockets. The web sockets tell the clients to: 1. Increment the count 2. Send a loading spinner 3. Send a snackbar notification.
#### Administrative permissions are granted to the first user who created a button. They wield the power to reset the button. 
#### Users are required to set their usernames in order to participate. This encourages them to share their name when they've confirmed that they are ready.

# Features
*   ###### Post your own question to the button header
    
*   ###### Back user list to db to keep track of who has clicked and release names when reset
    
*   ###### Add a settings button that allows you to set a click limit, and notifies when it is reached
    
*   ###### Add settings to turn off features
    
*   ###### Restrict URL's that can be made, clean periodically
    
*   ###### Add the ability to set usernames and share username of people who have clicked
    
*   ###### Integrate with Teams via webhooks/client bot
    
*   ###### Add Emoji burst from cursor on click
    
*   ###### Integrate websockets for incrementing button/resetting
    
*   ###### Add Loading spinner that sends signals out via websockets
    
*   ###### Add Snackbar for button reset
    
*   ###### Enable Reset button
    
*   ###### Migrate to web and modify localhost to web addresses.
    
*   ###### Integrate websockets for snackbar notification
