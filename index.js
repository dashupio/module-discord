// require first
const { Module } = require('@dashup/module');

// import base
const Discord = require('discord.js');
const DiscordConnect = require('./connects/discord');

/**
 * export module
 */
class DiscordModule extends Module {

  /**
   * construct discord module
   */
  constructor() {
    // run super
    super();

    // connect discord
    this.building.then(() => {
      // done
      this.discord();
    });
  }
  
  /**
   * register
   *
   * @param {*} fn 
   */
  register(fn) {
    // register discord connect
    fn('connect', DiscordConnect);
  }

  /**
   * start discord logic
   */
  discord() {
    // check discord
    if (!this.config.token) return;

    // load bot
    this.bot = new Discord.Client();

    // logging
    this.logging = new Promise((resolve) => {
      // resolve ready
      this.bot.on('ready', resolve);
    });

    // login with secret
    this.bot.login(this.config.token);

    // on message
    this.bot.on('message', (...args) => {
      // emit here
      this.emit('message', ...args);
    });
  }
}

// create new
module.exports = new DiscordModule();
