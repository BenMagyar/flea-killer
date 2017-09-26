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
    if (!validate.gameId(gameId))         { return callback('Invalid game ID.'); }
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
      id: gameId,
      home_name: '',
      away_name: '',
      home_scores: [],
      away_scores: [],
      home_total: 0,
      away_total: 0,
      home_optimum: 0,
      away_optimum: 0
    };
    // cheerio bug is forces it unable to find tbody for some odd reason
    for (var i = 0; i < $('#body-center-main .player').length - 1; i++) {
      $('#row_1_0_' + i).each(function() {
        if ($(this).find('td:nth-child(1) .league-name').text().length > 0) {
          console.log('PLS')
        }
      });
      $('#row_1_0_' + i).each(function() {
        // Only take real teams
        if ($(this).find('td:first-child .player').length > 0) {
          if ($(this).find('td:nth-child(1)').text() == 'Total') {
            scores.home_total = $(this).find('td:nth-child(4)').text(),
            scores.away_total = $(this).find('td:nth-child(8)').text()
          } else if ($(this).find('td:nth-child(1)').text() == 'Optimum') {
            scores.home_optimum = $(this).find('td:nth-child(4)').text(),
            scores.away_optimum = $(this).find('td:nth-child(8)').text()
          } else {
            var home_score = {
              player:   $(this).find('td:nth-child(1)').text(),
              score:    $(this).find('td:nth-child(4)').text(),
              position: $(this).find('td:nth-child(6)').text()
            };
            var away_score = {
              player:   $(this).find('td:nth-child(11)').text(),
              score:    $(this).find('td:nth-child(8)').text(),
              position: $(this).find('td:nth-child(6)').text()
            };
            scores.home_scores.push(home_score);
            scores.away_scores.push(away_score);
          }
        }
      });
    }
    return callback(null, scores);
  });

}
