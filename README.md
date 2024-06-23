# GDGuessr

![GitHub Tag](https://img.shields.io/github/v/tag/at4pm/gdguessr?label=version)

GDGuessr is the player guessing bot for your Discord server!
Created by [@at4pm] and [@D4isDAVID].

> [!NOTE]
> This is an Alpha version of our bot, and many features will be subject to change.
> Please report any bugs by opening an [issue].

## Commands

| Command         | Description                                                            |
| --------------- | ---------------------------------------------------------------------- |
| [/creatorguess] | Guess a random creator, gaining more points with higher difficulties.  |
| [/leaderboard]  | View the global leaderboard. The more points, the higher your ranking. |
| [/balance]      | View your exact amount of points.                                      |

[@at4pm]: https://mewo.lol/profile
[@d4isdavid]: https://github.com/D4isDAVID
[issue]: https://github.com/at4pm/gdguessr/issues/new
[/leaderboard]: ./src/commands/economy/leaderboard.js
[/balance]: ./src/commands/economy/balance.js
[/creatorguess]: ./src/commands/guessing/creator.js
[`.env.example`]: ./.env.example
[`config.json.example`]: ./config.json.example
