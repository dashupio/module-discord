
// import connect interface
import { Query, Struct } from '@dashup/module';

/**
 * build address helper
 */
export default class DiscordConnect extends Struct {
  /**
   * construct discord connector
   *
   * @param args 
   */
  constructor(...args) {
    // run super
    super(...args);

    // bind guild action
    this.onMessage = this.onMessage.bind(this);
    this.saveAction = this.saveAction.bind(this);
    this.sendAction = this.sendAction.bind(this);
    this.guildAction = this.guildAction.bind(this);
    this.messageEvent = this.messageEvent.bind(this);

    // log message
    this.dashup.on('message', this.onMessage);
  }

  /**
   * returns connect type
   */
  get type() {
    // return connect type label
    return 'discord';
  }

  /**
   * returns connect type
   */
  get title() {
    // return connect type label
    return 'Discord';
  }

  /**
   * returns connect icon
   */
  get icon() {
    // return connect icon label
    return 'fab fa-discord';
  }

  /**
   * returns connect data
   */
  get data() {
    // return connect data
    return {};
  }

  /**
   * returns object of views
   */
  get views() {
    // return object of views
    return {
      config : 'connect/discord',
    };
  }

  /**
   * returns connect actions
   */
  get events() {
    // return connect actions
    return {
      'message.sent' : this.messageEvent,
    };
  }

  /**
   * returns connect actions
   */
  get actions() {
    // return connect actions
    return {
      save  : this.saveAction,
      send  : this.sendAction,
      guild : this.guildAction,
    };
  }

  /**
   * returns category list for connect
   */
  get categories() {
    // return array of categories
    return ['channel'];
  }

  /**
   * returns connect descripton for list
   */
  get description() {
    // return description string
    return 'Discord Connector';
  }

  /**
   * action method
   *
   * @param param0 
   * @param connect 
   * @param data 
   */
  async saveAction({ req, dashup }, connect) {
    // check dashup
    if (!dashup) return;

    // get code
    const { code, state, guild_id:guild, permissions } = req.query;
    
    // set variables
    connect.code = code;
    connect.state = state;
    connect.guild = guild;
    connect.permissions = permissions;

    // return connect
    return { connect };
  }

  /**
   * action method
   *
   * @param param0 
   * @param connect 
   * @param data 
   */
  async messageEvent(opts, subject, message) {
    // check message
    if (!message) return;

    // check if discord
    if ((message.by || {}).type === 'discord') return;

    // query pages where
    const page = await new Query(opts, 'page').findById(subject);

    // check page
    if (!page) return;

    // get connects
    const connect = (page.get('connects') || []).find((c) => c.type === 'discord' && ['both', 'dashup'].includes(c.direction));

    // check connect
    if (!connect) return;

    // channel
    const channel = this.dashup.bot.channels.cache.get(connect.channel);

    // send to channel
    channel.send(`${message.by ? `**${message.by.name}**: ` : ''}${message.message}`);
  }

  /**
   * action method
   *
   * @param param0 
   * @param connect 
   * @param data 
   */
  async sendAction({ req }, data) {
    // check secret
    if (data.internal !== this.dashup.config.internal) return;

    // channel
    const channel = this.dashup.bot.channels.cache.get(data.channel);

    // send to channel
    channel.send(...data.args);

    // return true
    return true;
  }

  /**
   * action method
   *
   * @param param0 
   * @param connect 
   * @param data 
   */
  async guildAction({ req }, connect, data) {
    // get discord guild
    const discordGuild = this.dashup.bot.guilds.cache.get(connect.guild);

    // return null
    if (!discordGuild) return {};

    // get guild
    const guild = {
      id     : discordGuild.id,
      name   : discordGuild.name,
      image  : `https://cdn.discordapp.com/icons/${discordGuild.id}/${discordGuild.icon}`,
      region : discordGuild.region,

      channels : Array.from(discordGuild.channels.cache.values()).map((discordChannel) => {
        // channel info
        return {
          id      : discordChannel.id,
          name    : discordChannel.name,
          type    : discordChannel.type,
          created : new Date(discordChannel.createdAt),
        };
      }),
    }

    // return test
    return guild;
  }

  /**
   * on message
   *
   * @param message 
   */
  async onMessage(message) {
    // check author
    if (message.author.id === this.dashup.config.client) return;

    // setup opts
    const opts = {
      type   : 'connect',
      struct : 'discord',
    };

    // query pages where
    const pages = await new Query(opts, 'page').where({
      'connects.channel' : message.channel.id,
    }).in('connects.direction', ['both', 'discord']).find();

    // loop pages
    pages.forEach((page) => {
      // find connector
      const connects = (page.get('connects') || []).filter((c) => c.type === 'discord' && c.channel === message.channel.id && ['both', 'discord'].includes(c.direction));

      // connects
      connects.forEach(async () => {
        // send message
        const exists = await new Query(opts, 'message').where({
          temp    : message.id,
          subject : page.get('_id'),
        }).count();

        // check count
        if (exists) return;

        // replace content
        let content = message.content;
        const embeds = [];
        
        // loop mentions
        const mentions = Array.from(message.mentions.users.values());
        const attachments = Array.from(message.attachments.values());

        // loop
        mentions.forEach((mention) => {
          // replace
          content = content.split(`<@!${mention.id}>`).join(`@${mention.username.toLowerCase()}`);
        });

        // loop attachments
        attachments.forEach(async (attachment) => {
          // embed
          embeds.push(attachment.url);
        });

        // emit new message
        this.dashup.connection.action({
          type : 'page',
          user : {
            id     : message.author.id,
            type   : 'discord',
            name   : message.author.username,
            avatar : `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`,
          },
          struct : 'channel',
        }, 'send', {
          embeds,
          temp    : message.id,
          subject : page.get('_id'),
          message : content,
        });
      });
    });
  }
}