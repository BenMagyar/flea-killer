// Draft scraper
var request  = require('request'),
    cheerio  = require('cheerio'),
    validate = require('./validate');

exports.get = function(leagueType, leagueId, season, callback) {

  var url;
  // Validate a callback exists if not then we are expecting a URL
  if (typeof callback === typeof undefined) {
    callback = leagueId;
    if (!validate.url('draft', leagueType)) { return callback('Invalid URL.'); }
    url = leagueType;
  } else {
    // Validate all required paramters
    if (!validate.leagueType(leagueType)) { return callback('Invalid league type.'); }
    if (!validate.leagueId(leagueId))     { return callback('Invalid league ID.'); }
    if (!validate.season(season))         { return callback('Invalid season.'); }
    url = 'http://www.fleaflicker.com/' + leagueType + '/leagues/' + leagueId + '/draft?season=' + season;;
  };

  // Call to cheerio for the league
  request(url, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      return callback(error ? error : 'Status Code: ' + response.statusCode);
    }
    // Continue as normal
    $ = cheerio.load(body);
    // Extract basic draft information
    var draft = {
      league: {
        id: parseInt(url.match(/leagues\/(\d{5})/)[1]),
        name: $('#top-bar-container ul.breadcrumb li.active').text()
      },
      picks: []
    };

    var teams = [];
    $('.assigned-picks tr.first th:not(:first-child) a').each(function() {
      teams.push({
        id: parseInt($(this).attr('href').match(/teams\/(\d{5})\/picks/)[1]),
        name: $(this).text().trim()
      });
    });

    // Get all of the draft picks and push it onto the draft object
    // Cheerio is having a hard time with the markup for some reason
    $('.assigned-picks .assigned-pick').each(function(index, element) {
      // we need to alternate rounds and get the index still
      var team = index % teams.length;
      draft.picks.push({
        round: parseInt($(this).text().match(/(\d+)\./)[1]),
        pick: {
          overall: parseInt($(this).text().match(/\#(\d+)/)[1]),
          round: parseInt($(this).text().match(/\d+\.(\d+)/)[1])
        },
        team: {
          id: teams[index % teams.length].id,
          name: teams[index % teams.length].name
        },
        player: {
          id: parseInt($(this).find('a').attr('href').match(/\/players\/[\w\d\-]+\-(\d+)/)[1]),
          name: $(this).find('a').text()
        }
      });
    });

    // Return the completed draft
    return callback(null, draft);
  });

};
