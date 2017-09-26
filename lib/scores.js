// Team schedule scraper
var request  = require('request'),
    cheerio  = require('cheerio'),
    validate = require('./validate');

// Fetch league information
exports.get = function(leagueType, leagueId, gameId, season, callback) {

  var url;
  // Validate a callback exists if not then we are expecting a URL
  if (typeof callback === typeof undefined) {
    callback = leagueId;
    if (!validate.url('game', leagueType)) { return callback('Invalid URL.'); }
    url = leagueType;
  } else {
    // Validate all required paramters
    if (!validate.leagueType(leagueType)) { return callback('Invalid league type.'); }
    if (!validate.leagueId(leagueId))     { return callback('Invalid league ID.'); }
    if (!validate.season(season))         { return callback('Invalid season.'); }
    if (!validate.teamId(gameId))         { return callback('Invalid game ID.'); }
    url = 'http://www.fleaflicker.com/' + leagueType + '/leagues/' + leagueId + '/scores/' + gameId;
  };

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
    var scores = {
      id: scoreId,
      home_name: $('#top-bar-container ul.breadcrumb li.active').text(),
      away_name: '',
      home_scores: [],
      away_scores: [],
      home_total: 0,
      away_total: 0
    };
    // cheerio bug is forces it unable to find tbody for some odd reason
    for (var i = 0; i < $('#body-center-main .player').length - 1; i++) {
      $('#row_1_0_' + i).each(function() {
        // Only take real teams
        if ($(this).find('td:first-child .player').length > 0) {
          var home_scores = {
            player:   $(this).find('td:nth-child(1)').text(),
            scores:   $(this).find('td:nth-child(4)').text(),
            position: $(this).find('td:nth-child(6)').text()
          };
          if (game.score.substring(0, 1) == 'W') {
            schedule.wins += 1
          } else if (game.score.substring(0, 1) == 'L') {
            schedule.losses += 1
          }
          game.score = game.score.substring(2, game.score.length)
          console.log(game.id)
          if (typeof game.id !== "undefined") {
            game.id = game.id.split("/")[game.id.split("/").length-1]
          }
          schedule.games.push(game);
        }
      });
    }
    return callback(null, schedule);
  });

}
