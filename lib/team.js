// Team scraper
var request = require('request'),
    cheerio = require('cheerio');

exports.get = function(identifier, callback) {

  // Allow for numbers/URLs
  if (typeof identifier === 'number') {
    // Validate length of five
    if (identifier.toString().length !== 5) {
      return callback('Invalid identifier length');
    }
    identifier = 'http://www.fleaflicker.com/mlb/league?leagueId=' + identifier;
  }
  // Check for validitiy of the URL
  if (!/http:\/\/www\.fleaflicker\.com\/mlb\/league\?leagueId=\d{5}/.test(identifier)) {
    return callback('Invalid URL for league');
  }

}
