const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Информация о боте",
  usage: "[command]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["command", "commands", "cmd"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Commands = client.commands.map(
      (cmd) =>
        `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
          cmd.name
        }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
    );

    let Embed = new MessageEmbed()
      .setAuthor(
        `Команды ${client.user.username}`,
        client.botconfig.IconURL
      )
      .setColor(client.botconfig.EmbedColor)
      .setFooter(
        `Чтобы получить информацию о каждом типе команды ${
          GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
        }help [Command] | Хорошего дня!`
      ).setDescription(`${Commands.join("\n")}
  
  Discord Music Bot Версия: v${require("../package.json").version}
  [✨ Сервер Полка](${
    client.botconfig.SupportServer
  }) | [Вебсайт](https://iliasaw.github.io/GBF/)`);
    if (!args[0]) message.channel.send(Embed);
    else {
      let cmd =
        client.commands.get(args[0]) ||
        client.commands.find((x) => x.aliases && x.aliases.includes(args[0]));
      if (!cmd)
        return client.sendTime(
          message.channel,
          `❌ | Не удается найти эту команду.`
        );

      let embed = new MessageEmbed()
        .setAuthor(`Команда: ${cmd.name}`, client.botconfig.IconURL)
        .setDescription(cmd.description)
        .setColor("GREEN")
        //.addField("Name", cmd.name, true)
        .addField("Псевдонимы", `\`${cmd.aliases.join(", ")}\``, true)
        .addField(
          "Использование",
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\``,
          true
        )
        .addField(
          "Права",
          "Участник: " +
            cmd.permissions.member.join(", ") +
            "\nБот: " +
            cmd.permissions.channel.join(", "),
          true
        )
        .setFooter(
          `Префикс - ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
          }`
        );

      message.channel.send(embed);
    }
  },

  SlashCommand: {
    options: [
      {
        name: "command",
        description: "Получить информацию о конкретной команде",
        value: "command",
        type: 3,
        required: false,
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
      let Commands = client.commands.map(
        (cmd) =>
          `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
            cmd.name
          }${cmd.usage ? " " + cmd.usage : ""}\` - ${cmd.description}`
      );

      let Embed = new MessageEmbed()
        .setAuthor(
          `Команды ${client.user.username}`,
          client.botconfig.IconURL
        )
        .setColor(client.botconfig.EmbedColor)
        .setFooter(
          `Чтобы получить информацию о каждом типе команды ${
            GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
          }help [Command] | Хорошего дня!`
        ).setDescription(`${Commands.join("\n")}
  
  Discord Music Bot Версия: v${require("../package.json").version}
  [✨ Сервер Полка](${
    client.botconfig.SupportServer
  }) | [Вебсайт](https://iliasaw.github.io/GBF/)`);
      if (!args) return interaction.send(Embed);
      else {
        let cmd =
          client.commands.get(args[0].value) ||
          client.commands.find(
            (x) => x.aliases && x.aliases.includes(args[0].value)
          );
        if (!cmd)
          return client.sendTime(
            interaction,
            `❌ | Не удается найти эту команду.`
          );

        let embed = new MessageEmbed()
          .setAuthor(`Команда: ${cmd.name}`, client.botconfig.IconURL)
          .setDescription(cmd.description)
          .setColor("GREEN")
          //.addField("Name", cmd.name, true)
          .addField("Псевдонимы", cmd.aliases.join(", "), true)
          .addField(
            "Использование",
            `\`${GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix}${
              cmd.name
            }\`${cmd.usage ? " " + cmd.usage : ""}`,
            true
          )
          .addField(
            "Права",
            "Участник: " +
              cmd.permissions.member.join(", ") +
              "\nБот: " +
              cmd.permissions.channel.join(", "),
            true
          )
          .setFooter(
            `Префикс - ${
              GuildDB ? GuildDB.prefix : client.botconfig.DefaultPrefix
            }`
          );

        interaction.send(embed);
      }
    },
  },
};
