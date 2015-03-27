// Draft scraper
var request = require('request'),
    cheerio = require('cheerio');

exports.get = function(identifier, callback) {

  // Allow for numbers/URLs
  if (typeof identifier === 'number') {
    // Validate length of five
    if (identifier.toString().length !== 5) {
      return callback('Invalid identifier length');
    }
    identifier = 'http://www.fleaflicker.com/mlb/draft-board?leagueId=' + identifier;
  }
  // Check for validitiy of the URL
  if (!/http:\/\/www\.fleaflicker\.com\/mlb\/draft-board\?leagueId=\d{5}$/.test(identifier)) {
    return callback('Invalid URL for league');
  }

  // Call to cheerio for the league
  request(identifier, function(error, response, body){
    if (error || response.statusCode !== 200) {
      return callback(error ? error : 'Status Code: ' + response.statusCode);
    }
    // Continue as normal
    $ = cheerio.load(body);
    // Extract basic draft information
    var draft = {
      league: {
        id: parseInt(identifier.match(/leagueId=(\d{5})/)[1]),
        name: $('#top-bar-container ul.breadcrumb li.active').text()
      },
      picks: []
    };

    var teams = $('.assigned-picks tr.first th:not(:first-child) a').map(function(){
      var team = {
        id: parseInt($(this).attr('href').match(/teamId=(\d{5})/)[1]),
        name: $(this).text().trim()
      }
      return team;
    });

    // Get all of the draft picks and push it onto the draft object
    $('.assigned-picks tr.cell-row').each(function(index, element){
      var round = parseInt($(this).find('td:first-child').text());
      $(this).find('td:not(:first-child)').each(function(column, draftBlock){
        draft.picks.push({
          round: round,
          pick: {
            overall: (round - 1) * teams.length + parseInt($(this).text().match(/\d+\.(\d+)/)[1]),
            round: parseInt($(this).text().match(/\d+\.(\d+)/)[1])
          },
          team: {
            id: teams[column].id,
            name: teams[column].name
          },
          player: {
            id: parseInt($(this).find('a').attr('href').match(/playerId=(\d+)/)[1]),
            name: $(this).find('a').text()
          }
        });
      });
    });

    // Return the completed draft
    return callback(null, draft);
  });

};
