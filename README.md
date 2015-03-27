# flea-killer

Fleaflicker baseball API through web scraping, since no official API exists.

## API

For all examples:
```
var flea = require('flea-killer');
```

### league.get(identifier, function(err, league))

```identifier``` is the Fleaflicker league ID or the URL for the league. Returns
all information availabile for the league from a single request.

##### Example

```
flea.league.get(13157, function(err, league){
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

### draft.get(identifier, function(err, draft))

```identifier``` is a league ID or the URL to a draft. Returns all draft picks,
pick numbers and basic player information.

##### Example

```
flea.draft.get(13157, function(err, draft){
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
