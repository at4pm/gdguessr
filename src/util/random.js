const config = require('../../config.json');

function random(type, difficulty) {
	const objs = config[type].filter(o => o.difficulty === difficulty);
	const index = Math.floor(Math.random() * objs.length);

	return objs[index];
}

function randomCreator(difficulty) {
	return random('creators', difficulty);
}

module.exports = {
	randomCreator,
};
