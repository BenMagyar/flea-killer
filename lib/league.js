// League scraper
var request = require('request'),
	cheerio = require('cheerio');

// Fetch league information
exports.get = function(leagueType, leagueId, callback) {

	var leagueTypes = ['nhl', 'mlb', 'nfl', 'celeb', 'nba'];

	if (leagueTypes.indexOf(leagueType) < 0) {
		return callback('League type is not valid.');
	}

	if (typeof leagueId != 'number' || (leagueId % 1) != 0) {
		return callback('League id is not a valid integer.');
	}

	var url = 'http://www.fleaflicker.com/' + leagueType + '/leagues/' + leagueId;

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

		// Get league information
		var league = {
			id: leagueId,
			name: $('#top-bar-container ul.breadcrumb li.active').text(),
			commish: $('#body-left .panel-body').labelSearch('dt', 'Commish'),
			type: $('#body-left .panel-body').labelSearch('dt', 'Type'),
			slots: {
				total: $('.league-standings .user-name').length + $('.league-standings a.btn-success').length,
				available: $('.league-standings a.btn-success').length,
				taken: $('.league-standings .user-name').length
			},
			teams: [],
			stats: []
		};

		// Teams in the league
		$('.league-standings tr.first th .tt-content').each(function() {
			league.stats.push($(this).text());
		});

		// cheerio bug is forces it unable to find tbody for some odd reason
		for (var i = 0, l = $('.league-standings .user-name').length; i < l; i++) {
			$('#row_0_0_' + i).each(function() {
				// Only take real teams
				if ($(this).find('td:first-child .league-name').length > 0) {
					var team = {
						name: $(this).find('td:first-child .league-name').text(),
						rank: $(this).find('td:last-child').text(),
						points: $(this).find('td:last-child').prev().text(),
						link: 'https://fleaflicker.com' + $(this).find('td.left .league-name a').attr('href'),
						id: $(this).find('td:first-child .league-name a').attr('href').match(/\/teams\/(\d{5})/)[1],
						owner: {
							name: $(this).find('.user-name').text(),
							link: 'https://fleaflicker.com' + $(this).find('.user-name').attr('href')
						},
						stats: {}
					};
					var row = $(this);
					// Push on the stats for the entire team
					league.stats.forEach(function(stat, index) {
						team.stats[stat] = {
							points: parseFloat(row.find('td:nth-child(' + (3 * index + 4) + ')').text()),
							value: parseFloat(row.find('td:nth-child(' + (3 * index + 5) + ')').text().replace(/,/g, ''))
						}
					});
					league.teams.push(team);
				}
			});
		}
		return callback(null, league);

	});

}