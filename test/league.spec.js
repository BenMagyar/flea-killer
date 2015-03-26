var expect = require('chai').expect,
    league = require('../lib/league.js');

describe('League scraping', function(){

  it('should allow for a URL of a league', function(done){
    league.get('http://www.fleaflicker.com/mlb/league?leagueId=15317', function(err, league){
      expect(league.name).to.equal('SOS NL East 2015');
      done();
    });
  });

  it('should allow for a league ID', function(done){
    league.get(15317, function(err, league){
      expect(league.name).to.equal('SOS NL East 2015');
      done();
    });
  });

  it('should not allow for an invalid ID', function(done){
    league.get(4132322, function(err, league){
      expect(err).to.equal('Invalid identifier length');
      done();
    });
  });

  it('should not allow for an invalid URL', function(done){
    league.get('http://www.fleaflicker.com/mlb/league?leagueId=1517', function(err, league){
      expect(err).to.equal('Invalid URL for league');
      done();
    });
  });

  it('should error on a bad response', function(done){
    league.get('http://www.fleaflicker.com/mlb/league?leagueId=99999', function(err, league){
      expect(err).to.exist;
      done();
    });
  });

  it('should grab the correct league information', function(done){
    league.get('http://www.fleaflicker.com/mlb/league?leagueId=15317', function(err, league){
      expect(league.name).to.equal('SOS NL East 2015');
      expect(league.commish).to.equal('NextLvlFantasy');
      expect(league.type).to.equal('Roto');
      expect(league.slots.total).to.equal(14);
      // Cant test avail/taken as those slots change and I dont want to mock it
      expect(league.id).to.equal(15317);
      done();
    });

  });

});
