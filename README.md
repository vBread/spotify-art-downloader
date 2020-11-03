# Spotify Art Downloader

Requirements
- [Node.js](https://nodejs.org/)

## Installation
```
$ git clone https://github.com/vBread/spotify-art-downloader.git
$ cd spotify-art-downloader
$ npm install
```

## Usage
```diff
$ npm start -- <url> [directory] 
# A default directory will be made inside if one isn't specified

# Examples
$ npm start -- https://open.spotify.com/track/61MbTEmCqOxcpF9Z1QBhcK?si=Zv7TP3_BTGWut0HQ5cXcrw
$ npm start -- https://open.spotify.com/track/1UURGn40bicGsMi19bqml0?si=Zsmwf8IfR0uZRvWmobj2Ug ~/Downloads

# NOTE: For Mac users using zsh, the url will need to be double quoted
$ npm start -- "https://open.spotify.com/track/2DZqu0ju4GPs4nJXm1XrQ1?si=ZvmWL8PySjOm9xBJH24nCA"
```

## Setup
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/login) page and login

<img src="https://imgur.com/SatR1rH.png"></img>

2. Click `Create App` and fill in the fields

<img src="https://imgur.com/TXwKj8K.png"></img>

<img src="https://imgur.com/Q3RrLxo.png"></img>

3. Copy the `Client ID` and the `Client Secret`

<img src="https://imgur.com/8M4WoUQ.png"></img>

4. Open the `.env` file and fill in the respective fields
```js
CLIENT_ID=xxxxx
CLIENT_SECRET=xxxxx
```