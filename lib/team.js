// Team scraper
var request = require('request'),
	cheerio = require('cheerio');

// Fetch league information
exports.get = function(leagueType, leagueId, teamId, season, callback) {

	var leagueTypes = ['nhl', 'mlb', 'nfl', 'celeb', 'nba'];

	if (leagueTypes.indexOf(leagueType) < 0) {
		return callback('League type is not valid.');
	}

	if (typeof leagueId != 'number' || (leagueId % 1) != 0) {
		return callback('League id is not a valid integer.');
	}

	if (typeof teamId != 'number' || (teamId % 1) != 0) {
		return callback('Team id is not a valid integer.');
	}

	var url = 'http://www.fleaflicker.com/' + leagueType + '/leagues/' + leagueId + '/teams/' + teamId + '?statType=0';

	if(season) {
		if (typeof season != 'number' || (season % 1) != 0) {
			return callback('Season is not a valid year.');
		}
		url += '&season=' + season;
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