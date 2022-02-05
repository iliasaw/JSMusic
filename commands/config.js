const { MessageEmbed, MessageReaction } = require("discord.js");

module.exports = {
  name: "config",
  description: "Изменить настройки бота",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: ["conf"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Config = new MessageEmbed()
      .setAuthor("Конфигурация сервера", client.botconfig.IconURL)
      .setColor(client.botconfig.EmbedColor)
      .addField("Префикс", GuildDB.prefix, true)
      .addField("Роль DJ", GuildDB.DJ ? `<@&${GuildDB.DJ}>` : "Не задано", true)
      .setDescription(`
Что бы вы хотели отредактировать?

:one: - Префикс сервера
:two: - Роль DJ
`);

    let ConfigMessage = await message.channel.send(Config);
    await ConfigMessage.react("1️⃣");
    await ConfigMessage.react("2️⃣");
    let emoji = await ConfigMessage.awaitReactions(
      (reaction, user) =>
        user.id === message.author.id &&
        ["1️⃣", "2️⃣"].includes(reaction.emoji.name),
      { max: 1, errors: ["time"], time: 30000 }
    ).catch(() => {
      ConfigMessage.reactions.removeAll();
      client.sendTime(
        message.channel,
        "❌ | **Вы слишком долго не отвечали. Если вы хотите изменить настройки, используйте команду еще раз!**"
      );
      ConfigMessage.delete(Config);
    });
    let isOk = false;
    try {
      emoji = emoji.first();
    } catch {
      isOk = true;
    }
    if (isOk) return; //im idiot sry ;-;
    /**@type {MessageReaction} */
    let em = emoji;
    ConfigMessage.reactions.removeAll();
    if (em._emoji.name === "1️⃣") {
      await client.sendTime(
        message.channel,
        "На что вы хотите изменить префикс?"
      );
      let prefix = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!prefix.first())
        return client.sendTime(
          message.channel,
          "Вы слишком долго отвечали."
        );
      prefix = prefix.first();
      prefix = prefix.content;

      await client.database.guild.set(message.guild.id, {
        prefix: prefix,
        DJ: GuildDB.DJ,
      });

      client.sendTime(
        message.channel,
        `Префикс гильдии успешно сохранен как \`${prefix}\``
      );
    } else {
      await client.sendTime(
        message.channel,
        "Пожалуйста, укажите роль, которую вы хотите поставить `DJ`.."
      );
      let role = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!role.first())
        return client.sendTime(
          message.channel,
          "Вы слишком долго отвечали."
        );
      role = role.first();
      if (!role.mentions.roles.first())
        return client.sendTime(
          message.channel,
          "Пожалуйста, укажите роль, которую вы хотите только для DJ."
        );
      role = role.mentions.roles.first();

      await client.database.guild.set(message.guild.id, {
        prefix: GuildDB.prefix,
        DJ: role.id,
      });

      client.sendTime(
        message.channel,
        "Роль DJ успешно сохранена как <@&" + role.id + ">"
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "prefix",
        description: "Проверьте префикс бота",
        type: 1,
        required: false,
        options: [
          {
            name: "symbol",
            description: "Установить префикс бота",
            type: 3,
            required: false,
          },
        ],
      },
      {
        name: "dj",
        description: "Проверьте роль DJ",
        type: 1,
        required: false,
        options: [
          {
            name: "role",
            description: "Установить роль DJ",
            type: 8,
            required: false,
          },
        ],
      },
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      let config = interaction.data.options[0].name;
      let member = await interaction.guild.members.fetch(interaction.user_id);
      //TODO: if no admin perms return...
      if (config === "prefix") {
        //prefix stuff
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          //has prefix
          let prefix = interaction.data.options[0].options[0].value;
          await client.database.guild.set(interaction.guild.id, {
            prefix: prefix,
            DJ: GuildDB.DJ,
          });
          client.sendTime(
            interaction,
            `Теперь префикс установлен на \`${prefix}\``
          );
        } else {
          //has not prefix
          client.sendTime(
            interaction,
            `Префикс этого сервера \`${GuildDB.prefix}\``
          );
        }
      } else if (config === "djrole") {
        //DJ role
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          let role = interaction.guild.roles.cache.get(
            interaction.data.options[0].options[0].value
          );
          await client.database.guild.set(interaction.guild.id, {
            prefix: GuildDB.prefix,
            DJ: role.id,
          });
          client.sendTime(
            interaction,
            `Роль DJ этого сервера успешно изменена на ${role.name}`
          );
        } else {
          /**
           * @type {require("discord.js").Role}
           */
          let role = interaction.guild.roles.cache.get(GuildDB.DJ);
          client.sendTime(
            interaction,
            `Роль DJ этого сервера ${role.name}`
          );
        }
      }
    },
  },
};
