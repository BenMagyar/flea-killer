var expect = require('chai').expect,
    league = require('../lib/league.js');

describe('League scraping', function(){

  it('should allow for a URL of a league', function(done){
    league.get('http://www.fleaflicker.com/mlb/leagues/15317?season=2014', function(err, league){
      expect(league.name).to.equal('SOS NL East 2015');
      done();
    });
  });

  it('should allow for a league ID', function(done){
    league.get('mlb', 15317, 2014, function(err, league){
      expect(league.name).to.equal('SOS NL East 2015');
      done();
    });
  });

  it('should not allow for an invalid league type', function(done){
    league.get('masdfa', 15317, 2014, function(err, league){
      expect(err).to.equal('Invalid league type.');
      done();
    });
  });

  it('should not allow for an invalid ID', function(done){
    league.get('mlb', 4413212341322, 2014, function(err, league){
      expect(err).to.equal('Invalid league ID.');
      done();
    });
  });

  it('should not allow for an invalid season', function(done){
    league.get('mlb', 15317, 201412, function(err, league){
      expect(err).to.equal('Invalid season.');
      done();
    });
  });

  it('should not allow for an invalid URL', function(done){
    league.get('http://www.fleaflicker.com/mlb/league?leagueId=1517', function(err, league){
      expect(err).to.equal('Invalid URL.');
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
    league.get('http://www.fleaflicker.com/mlb/leagues/17027?season=2016', function(err, league){
      expect(league.name).to.equal('Reddit-2016-10');
      expect(league.commish).to.equal('NextLevelFntsy');
      expect(league.type).to.equal('Roto');
      expect(league.slots.total).to.equal(12);
      // Cant test avail/taken as those slots change and I dont want to mock it
      expect(league.id).to.equal(17027);
      // Cant test individual stats that well
      expect(league.teams[0].stats.HR.points).to.equal(9);
      expect(league.teams[0].stats.HR.value).to.equal(204);
      expect(league.teams[0].stats.ERA.value).to.equal(3.81);
      expect(league.teams[0].stats.ERA.points).to.equal(6);
      expect(league.teams[0].stats.QS.value).to.equal(99);
      expect(league.teams[0].stats.QS.points).to.equal(7.5);
      done();
    });

  });

});
