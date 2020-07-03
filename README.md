# Soundboard

A Discord bot which plays sound effects as a virtual soundboard through commands.

I wanted to play sound effects through Discord calls and could not find a bot for my liking. Here's my bot which allows custom sound effects to be played through YouTube.

## Demo

![](http://www.swengineer.dev/images/soundboard.png)

*List of sample sound effects.*

## Download

Clone the repository at <a href="https://github.com/tobyjzstay/Soundboard" target="_blank">GitHub</a> and follow the [Getting Started](#getting-started) instructions.

## Commands

| Command                          | Description                                                             |
| :------------------------------- | :---------------------------------------------------------------------- |
| `kick`                           | Kicks the bot                                                           |
| `soundboard`                     | Displays information for all the bot commands (including custom sounds) |

## Getting Started

Create a new Discord bot at the <a href="https://discord.com/developers" target="_blank">Discord Developer Portal</a> and copy the token. More information about generating a new bot can be found <a href="https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/" target="_blank">here</a>. You will need to create a file to store the token named `config.json` and copy the following:

```json
{
  "prefix": "!",
  "token": "<token>",
  "role": "<role>"
}
```

Replace `<token>` with the token and save the file in the `~/Soundboard` folder. You can also set the role which allows users to remove the bot from the channel.

Now that you have the files on your machine and the bot ready to go, you will need <a href="https://nodejs.org/en/download/" target="_blank">Node.js</a> to run the bot. Open a bash terminal and navigate to the file location; `~/Soundboard`.
You will need to install some node modules that Soundboard relies on to function:

```bash
npm i discord.js
npm i ytdl-core
npm i fs
```

Your bot should be ready to go now. Run the bot with the command:

```bash
node index.js
```

### Setup

Make sure that you are an admin of the server, you will need this to run the configuration commands.

Soundboard commands can be found with the following command:

`!soundboard`

Hop into a voice channel and enter a sound command; e.g. a laugh track:

`!laugh`

The bot can be removed at anytime while a sound effect is playing with:

`!kick`

### Add Custom Sounds

You can add custom sounds to the bot by adding a JSON file. Navigate to the `~/Soundboard/sounds` folder and create a new JSON file and copy the following:

```json
{
  "name": "<name>",
  "url": "<youtube url>",
  "description": "<description>"
}
```

The name will be the command to enter to trigger the sound effect. The URL should be a link to a YouTube video. The description is a explanation of what sound the command plays.

## Acknowledgments
* Bot Icon: <a href="https://unsplash.com/photos/o9Fg-XaW0iU" target="_blank">Paul Pilarte - Unsplash</a>
* Base Code: <a href="https://github.com/TannerGabriel/discord-bot" target="_blank">Gabriel Tanner - GitHub</a>
