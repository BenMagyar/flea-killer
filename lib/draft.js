// Draft scraper
var request = require('request'),
  cheerio = require('cheerio');

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

exports.get = function(leagueType, leagueId, season, callback) {

  var leagueTypes = ['nhl', 'mlb', 'nfl', 'nba', 'celeb'];
  var url;

  if(callback === undefined) {
    callback = leagueId;
    if (/http:\/\/www\.fleaflicker\.com\/[a-z]{3,5}\/leagues\/[0-9]{3,7}\/draft\?season=[0-9]{4}/.test(leagueType)) {
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
    url = 'http://www.fleaflicker.com/' + leagueType + '/leagues/' + leagueId + '/draft';
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