// League scraper
var request = require('request'),
    cheerio = require('cheerio');

// Fetch league information
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

  // Call to cheerio for the league
  request(identifier, function(error, response, body){
    if (error || response.statusCode !== 200) {
      return callback(error ? error : 'Status Code: ' + response.statusCode);
    }
    // Proceed as if everything is okay
    $ = cheerio.load(body);
    // Extend for the body-left grab of content
    $.prototype.labelSearch = function(children, search) {
      return $(this).find(children).filter(function(){
        return $(this).text().trim() === search;
      }).next().text().trim();
    };

    // Get league information
    var league = {
      id: parseInt(identifier.match(/leagueId=(\d{5})/)[1]),
      name: $('#top-bar-container ul.breadcrumb li.active').text(),
      commish: $('#body-left .panel-body').labelSearch('dt', 'Commish'),
      type: $('#body-left .panel-body').labelSearch('dt', 'Type'),
      slots: {
        total: $('.league-standings > .cell-row').length,
        available: $('.league-standings > .cell-row td:first-child .btn').length,
        taken: $('.league-standings .cell-row td:first-child .league-name').length
      },
      teams: [],
      stats: []
    };

    // Teams in the league
    $('.league-standings tr.first th .tt-content').each(function(){
      league.stats.push($(this).text());
    });

    // Get all the teams and their information
    $('.league-standings .cell-row').each(function(){
      if ($(this).find('td:first-child .btn').length > 0) { return false; }
      var team = {
        name: $(this).find('td:first-child .league-name').text(),
        rank: $(this).find('td:last-child').text(),
        points: $(this).find('td:last-child').prev().text(),
        link: 'https://fleaflicker.com' + $(this).find('td.left .league-name a').attr('href'),
        id: $(this).find('td:first-child .league-name a').attr('href').match(/teamId=(\d{5})/)[1],
        owner: {
          name: $(this).find('.user-name').text(),
          link: 'https://fleaflicker.com' + $(this).find('.user-name').attr('href')
        },
        stats: {}
      };
      // Push on the stats for the entire team
      league.stats.forEach(function(stat, index){
        team.stats[stat] = {
          points: $(this).find('td:nth-child(' + (3 * index + 1) + ')').text(),
          value: $(this).find('td:nth-child(' + (3 * index + 2) + ')').text().replace(/,/g,'')
        }
      });
      league.teams.push(team);
    });

    return callback(null, league);

  });

}
