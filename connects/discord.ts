
// import connect interface
import { Query, Connect } from '@dashup/module';

/**
 * build address helper
 */
export default class DiscordConnect extends Connect {
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
    this.guildAction = this.guildAction.bind(this);

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
      config : 'connect/discord/config',
    };
  }

  /**
   * returns connect actions
   */
  get actions() {
    // return connect actions
    return {
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
  async save({ req, dashup }, connect) {
    // check dashup
    if (!dashup) return;

    // get code
    const { code, state, guild_id:guild, permissions } = req.query;
    
    // set variables
    connect.code = code;
    connect.state = state;
    connect.guild = guild;
    connect.permissions = permissions;
  }

  /**
   * action method
   *
   * @param param0 
   * @param connect 
   * @param data 
   */
  async message({ req, dashup }, connect, message) {
    // check if discord
    if ((message.by || {}).type === 'discord') return;

    // check direction
    if (!['both', 'dashup'].includes(connect.direction)) return;

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

    // query pages where
    const pages = await new Query(this.dashup, 'page').where({
      'connects.channel' : message.channel.id,
    }).in('connects.direction', ['both', 'discord']).find();

    // loop pages
    pages.forEach((page) => {
      // find connector
      const connects = (page.get('connects') || []).filter((c) => c.type === 'discord' && c.channel === message.channel.id && ['both', 'discord'].includes(c.direction));

      // connects
      connects.forEach(async () => {
        // send message
        const exists = await new Query(this.dashup, 'message').where({
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

        // emit message
        this.dashup.connection.rpc('create.message', {
          id     : message.author.id,
          type   : 'discord',
          name   : message.author.username,
          avatar : `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`,
        }, {
          embeds,
          type    : 'post',
          temp    : message.id,
          subject : page.get('_id'),
          message : content,
        });
      });
    });
  }
}