const { setLastUserStory, getLastUserStory, getChannelID } = require('./../../index.js')

module.exports = {
	name: 'messageCreate',
	async execute(message) {
        if (message.channel.id == getChannelID()) {
            let msg = message.content.replace("_", " ").replace("-", " ");
            msg = msg.split(" ");
            if (msg.length > 1 || message.member.id == getLastUserStory()) {
                return message.delete();
            }
            setLastUserStory(message.member.id);
        }
    },
};