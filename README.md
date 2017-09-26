# flea-killer

Fleaflicker API through web scraping, since no official API exists.

## API

For all examples:
```
var flea = require('flea-killer');
```

### league.get(leagueType, leagueId, season, function(err, league))

```leagueType``` is the Fleaflicker league ('nhl', 'mlb', etc.).
```leagueId``` is the Fleaflicker league ID. Returns
all information availabile for the league from a single request.
```season``` is the year.

##### Example

```
flea.league.get('mlb', 13157, 2014, function(err, league){
  if (err) { return console.log('Handle Errors', err); }
  // See below for returned league object
  console.log(league);
});
```

##### Returned
```
{
  id: number,
  name: string,
  commish: string,
  type: string,
  slots: {
    total: number,
    available: number,
    taken: number
  },
  stats: [string]
  // array of teams scraped from the league
  teams: [{
    name: string
    rank: number
    points: number,
    link: string,
    id: number,
    owner: {
      name: string,
      link: string
    },
    stats: {
        // One key for each stat type in a league
        type: {
          points: number,
          value: number
        },
        ...
    },
  }, ... ]
}
```
### team.get(leagueType, leagueId, teamId, season, function(err, team))

```leagueType``` is the Fleaflicker league ('nhl', 'mlb', etc.).
```leagueId``` is the Fleaflicker league ID.
```teamId``` is the Fleaflicker league ID. Returns
all information availabile for the team from a single request.
```season``` is the year.


##### Example

```
flea.team.get('nhl', 1800, 10370, 2014, function(err, team){
  if (err) { return console.log('Handle Errors', err); }
  // See below for returned draft object
  console.log(team);
});
```

##### Returned

```
{
  id: number,
  name: string,
  owner: string,
  points: number,
  players: [{
    name: string,
    totalPoints: number,
    avgPoints: number
  }, ...]
}
```

### draft.get(leagueType, leagueId, season, function(err, draft))

```leagueType``` is the Fleaflicker league ('nhl', 'mlb', etc.).
```leagueId``` is the Fleaflicker league ID. Returns
all information availabile for the league from a single request.
```season``` is the year.

##### Example

```
flea.draft.get('mlb', 13157, 2014, function(err, draft){
  if (err) { return console.log('Handle Errors', err); }
  // See below for returned draft object
  console.log(draft);
});
```

##### Returned

```
{
  league: {
    id: number,
    name: string
  },
  // array of picks from the draft
  picks: [{
    round: number,
    pick: {
      // Overall draft number
      overall: number,
      // Round specific draft number
      round: number
    },
    team: {
      id: number,
      name: string
    },
    player: {
      id: number,
      name: string
    }
  }, ...]
}
```

### schedule.get(leagueType, leagueId, teamId, season, function(err, schedule))

```leagueType``` is the Fleaflicker league ('nhl', 'mlb', etc.).
```leagueId``` is the Fleaflicker league ID.
```teamId``` is the Fleaflicker team ID. Returns all information availabile for the team from a single request.
```season``` is the year.


##### Example

```
flea.schedule.get('nhl', 1800, 10370, 2014, function(err, schedule){
  if (err) { return console.log('Handle Errors', err); }
  // See below for returned draft object
  console.log(schedule);
});
```

##### Returned

```
{
  id: number,
  name: string,
  wins: number,
  losses: number,
  games: [{
    id: number,
    week: number,
    opponent: string,
    score: string
  }, ...]
}
```
