const { Schema, model } = require("mongoose");
const getUsername = require("../util/username");

const User = new Schema({
	_id: String,
	points: { type: Number, default: 0 },
});

User.methods.getUsername = async function (client) {
	const user = await client.users.fetch(this.id);

	return getUsername(user);
};

module.exports = {
	UserModel: model("User", User),
};
