var expect   = require('chai').expect,
    validate = require('../lib/validate.js');

describe('Link and parameter validation', function(){

  it('should correctly verify a team URL', function(){
    var result = validate.url('team', 'http://www.fleaflicker.com/mlb/leagues/15317/teams/91774?season=2014');
    var badResult = validate.url('team', 'http://www.fleaflicker.com/mlb/leagues/4324143143/teams/91774?season=2014')
    expect(result).to.equal(true);
    expect(badResult).to.equal(false);
  });

  it('should correctly verify a team ID', function(){
    expect(validate.teamId(100)).to.equal(false);         // Too low
    expect(validate.teamId(5000)).to.equal(true);         // Correct
    expect(validate.teamId(100000000)).to.equal(false);   // Too high
  });

  it('should correctly verify a league ID', function(){
    expect(validate.leagueId(9999)).to.equal(false);      // Too low
    expect(validate.leagueId(10000)).to.equal(true);      // Correct
    expect(validate.leagueId(100000000)).to.equal(false); // Too high
  });

  it('should correct verify league types requested', function(){
    expect(validate.leagueType('mlb')).to.equal(true);
    expect(validate.leagueType('boxing')).to.equal(false);
  });

  it('should correctly verify season years', function(){
    var nextYear = new Date().getFullYear() + 1;
    expect(validate.season(nextYear)).to.equal(false);
    expect(validate.season(2014)).to.equal(true);
  });

});
