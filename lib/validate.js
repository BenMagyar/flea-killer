// Parse and return URL for use
const leagueTypes = ['nhl', 'mlb', 'nfl', 'nba', 'celeb'];
const typeURL = {
        draft: /http:\/\/www\.fleaflicker\.com\/[a-z]{3,5}\/leagues\/[0-9]{3,7}\/drafts\?season=[0-9]{4}/,
        league: /http:\/\/www\.fleaflicker\.com\/[a-z]{3,5}\/leagues\/[0-9]{3,7}\?season=[0-9]{4}/,
        team: /http:\/\/www\.fleaflicker\.com\/[a-z]{3,5}\/leagues\/[0-9]{3,7}\/teams\/[0-9]{3,8}\?season=[0-9]{4}/
      };

// Validation Methods
// Validate URL is valid for expected type
exports.url = function(type, URL) {
  return typeURL[type].test(URL);
};

// Validate league type is supported
exports.leagueType = function(leagueType) {
  return leagueTypes.indexOf(leagueType) > -1;
};

// Validate league ID is in the correct range
exports.leagueId = function(leagueId) {
  return 9999 < parseInt(leagueId) && parseInt(leagueId) < 100000;
};

// Validate season is a correct year
exports.season = function(season) {
  var year = new Date().getFullYear();
  return 2000 < parseInt(season) && parseInt(season) <= year;
};

// Validate teamid is in the corect range
exports.teamId = function(teamId) {
  return 999 < parseInt(teamId) && parseInt(teamId) < 10000000;
};
