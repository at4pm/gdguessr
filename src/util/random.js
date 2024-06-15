const { creators, levels } = require('../../config.json');

function random(type) {
	if (type == "creator") {
		const random = Math.floor(Math.random() * creators.length);
		return creators[random];
	} else if (type == "level") {
		const random = Math.floor(Math.random() * levels.length);
		return levels[random]; 
	}
}

module.exports = random;
