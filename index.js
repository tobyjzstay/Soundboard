/**
* Soundboard
*
* A Discord bot created to play sound effects as a virtual soundboard through commands.
* Made by Toby
*/
const Discord = require("discord.js");
const { prefix, token, role } = require("./config.json");
const ytdl = require("ytdl-core");
const fs = require("fs");
var sounds;

const client = new Discord.Client();

const queue = new Map();

client.sounds = new Discord.Collection();

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (!message.content.startsWith(`${prefix}`)) {
    return;
  }
  const args = message.content.slice(prefix.length).split(/ +/);

  if (args[0] == "kick") {
    stop(message, serverQueue);
    return;
  } else if (client.sounds.get(args[0]) != null) {
    load(message, client.sounds.get(args[0]), serverQueue);
  } else if (args[0] == "soundboard") {
    help(message);
    return;
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
  return message.channel.send("You need to be in a voice channel to play music!");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("I need the permissions to join and speak in your voice channel!");
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
  }
}

async function load(message, sound, serverQueue) {
  message.delete();
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
  return message.channel.send("You need to be in a voice channel to play music!");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("I need the permissions to join and speak in your voice channel!");
  }

  const songInfo = await ytdl.getInfo(sound.url);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
  }
}

function stop(message, serverQueue) {
  if (!message.member.hasPermission("ADMINISTRATOR") && message.member.roles.cache.get(role) == null) {
    return message.channel.send(`You have to have the \`${role}\` role to use this command!`);
  } else
  if (!message.member.voice.channel) {
    return message.channel.send("You have to be in a voice channel to kick the bot!");
  }
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
  .play(ytdl(song.url))
  .on("finish", () => {
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
  })
  .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

function help(message) {
  const embed = new Discord.MessageEmbed()
  .setAuthor("Soundboard", client.user.displayAvatarURL())
  .setDescription("To kick the bot, type `!kick`");
  var output = "";
  const { sounds } = message.client;
  sounds.array().forEach(function(sound) {
    embed.addField(`${prefix}${sound.name}`, `${sound.description}`);
  });
  message.channel.send(embed);
}

function load() {
  sounds = fs.readdirSync("./sounds").filter(file => file.endsWith(".js"));
  client.sounds.clear();
  for (const file of sounds) {
    const sound = require(`./sounds/${file}`);
    client.sounds.set(sound.name, sound);
  }
}

load();
client.login(token);
