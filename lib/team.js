// Team scraper
var request = require('request'),
  cheerio = require('cheerio');

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

// Fetch league information
exports.get = function(leagueType, leagueId, teamId, season, callback) {

  var leagueTypes = ['nhl', 'mlb', 'nfl', 'nba', 'celeb'];
  var url;

  if(callback === undefined) {
    callback = leagueId;
    if (/http:\/\/www\.fleaflicker\.com\/[a-z]{3,5}\/leagues\/[0-9]{3,7}\/teams\/[0-9]{3,8}\?season=[0-9]{4}/.test(leagueType)) {
      url = leagueType;
    } else {
      return callback('Invalid URL.');
    }
  } else {
    if (leagueTypes.indexOf(leagueType) < 0) {
      return callback('Invalid league type.');
    }
    if (leagueId != parseInt(leagueId) || leagueId.toString().length < 3 || leagueId.toString().length > 7) {
      return callback('Invalid league ID.');
    }
    if (teamId != parseInt(teamId) || teamId.toString().length < 3 || teamId.toString().length > 7) {
      return callback('Invalid team ID.');
    }
    url = 'http://www.fleaflicker.com/' + leagueType + '/leagues/' + leagueId + '/teams/' + teamId;
    if (season.toString().length != 4) {
      return callback('Invalid season.');
    } else {
      url += '?season=' + season;
    }
  }

  // Call to cheerio for the league
  request(url, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      return callback(error ? error : 'Status Code: ' + response.statusCode);
    }
    // Proceed as if everything is okay
    $ = cheerio.load(body);
    // Extend for the body-left grab of content
    $.prototype.labelSearch = function(children, search) {
      return $(this).find(children).filter(function() {
        return $(this).text().trim() === search;
      }).next().text().trim();
    };

    // Get team information
    var team = {
      id: teamId,
      name: $('#top-bar-container ul.breadcrumb li.active').text(),
      owner: $('#body-left .panel-body').labelSearch('dt', 'Owner'),
      points: parseFloat($('#body-left .panel-body').labelSearch('dt', 'Points')),
      players: []
    };
    // cheerio bug is forces it unable to find tbody for some odd reason
    for (var i = 0; i < $('#body-center-main .player').length - 1; i++) {
      $('#row_0_0_' + i).each(function() {
        // Only take real teams
        if ($(this).find('td:first-child .player').length > 0) {
          var player = {
            name: $(this).find('td .player').text(),
            totalPoints: parseFloat($(this).find('td .fp').first().text()),
            avgPoints: parseFloat($(this).find('td .fp').eq(1).text())
          };
          team.players.push(player);
        }
      });
    }
    return callback(null, team);
  });

}