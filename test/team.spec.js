var expect = require('chai').expect,
    team = require('../lib/team.js');

describe('Team scraping', function(){

  it('should allow for a URL of a team', function(done){
    team.get('http://www.fleaflicker.com/mlb/leagues/15317/teams/91774?season=2014', function(err, team){
      expect(team.name).to.equal('The Minor Ninths');
      done();
    });
  });

  it('should allow for a team ID', function(done){
    team.get('mlb', 15317, 91774, 2014,  function(err, team){
      expect(team.name).to.equal('The Minor Ninths');
      done();
    });
  });

  it('should not allow for an invalid league type', function(done){
    team.get('masdfa', 15317, 91774, 2014, function(err, team){
      expect(err).to.equal('Invalid league type.');
      done();
    });
  });

  it('should not allow for an invalid league ID', function(done){
    team.get('mlb', 153452345234515317, 91744, 2014, function(err, team){
      expect(err).to.equal('Invalid league ID.');
      done();
    });
  });

  it('should not allow for an invalid team ID', function(done){
    team.get('mlb', 15317, 12351234123, 2014, function(err, team){
      expect(err).to.equal('Invalid team ID.');
      done();
    });
  });

  it('should not allow for an invalid season', function(done){
    team.get('mlb', 15317, 91774, 2014234, function(err, team){
      expect(err).to.equal('Invalid season.');
      done();
    });
  });

  it('should not allow for an invalid URL', function(done){
    team.get('http://www.fleaflicker.com/mlb/team?teamId=1517', function(err, team){
      expect(err).to.equal('Invalid URL.');
      done();
    });
  });

  it('should error on a bad response', function(done){
    team.get('http://www.fleaflicker.com/mlb/team?teamId=99999?season=2014', function(err, team){
      expect(err).to.exist;
      done();
    });
  });

});
