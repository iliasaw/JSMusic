const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "volume",
  description: "Проверить или изменить текущий объем",
  usage: "<volume>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["vol", "v"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Прямо сейчас ничего не играет...**"
      );
    if (!args[0])
      return client.sendTime(
        message.channel,
        `🔉 | Текущая громкость \`${player.volume}\`.`
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Вы должны быть в голосовом канале, чтобы использовать эту команду!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Вы должны быть на том же голосовом канале, что и я, чтобы использовать эту команду!**"
      );
    if (!parseInt(args[0]))
      return client.sendTime(
        message.channel,
        `**Пожалуйста, выберите число между** \`1 - 150\``
      );
    let vol = parseInt(args[0]);
    if (vol < 0 || vol > 150) {
      return client.sendTime(
        message.channel,
        "❌ | **Пожалуйста, выберите число между `1-150`**"
      );
    } else {
      player.setVolume(vol);
      client.sendTime(
        message.channel,
        `🔉 | **Громкость поставлена на** \`${player.volume}\``
      );
    }
  },
  SlashCommand: {
    options: [
      {
        name: "amount",
        value: "amount",
        type: 4,
        required: false,
        description: "Введите громкость от 1 до 150. По умолчанию 100.",
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
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | Вы должны быть в голосовом канале, чтобы использовать эту команду."
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Вы должны быть на том же голосовом канале, что и я, чтобы использовать эту команду!**"
        );
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Прямо сейчас ничего не играет...**"
        );
      if (!args[0].value)
        return client.sendTime(
          interaction,
          `🔉 | Текущая громкость \`${player.volume}\`.`
        );
      let vol = parseInt(args[0].value);
      if (!vol || vol < 1 || vol > 150)
        return client.sendTime(
          interaction,
          `**Пожалуйста, выберите число между** \`1 - 150\``
        );
      player.setVolume(vol);
      client.sendTime(interaction, `🔉 | Громкость поставлена на \`${player.volume}\``);
    },
  },
};
