function getUsername(user) {
    return user.discriminator === '0'
        ? user.username
        : `${user.username}#${user.discriminator}`;
}

module.exports = getUsername;
