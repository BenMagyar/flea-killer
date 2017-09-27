var expect = require('chai').expect,
    scores = require('../lib/scores.js');

describe('scores scraping', function(){

  it('should allow for a URL of a scores', function(done){
    scores.get('https://www.fleaflicker.com/nfl/leagues/200993/scores/37447178?season=2017', function(err, scores){
      expect(scores.home_total).to.equal(120.9);
      done();
    });
  });

  it('should allow for a scores ID', function(done){
    scores.get('nfl', 200993, 37447178, 2017,  function(err, scores){
      expect(scores.home_total).to.equal(120.9);
      done();
    });
  });

  it('should not allow for an invalid league type', function(done){
    scores.get('nflalala', 200993, 37447178, 2017, function(err, scores){
      expect(err).to.equal('Invalid league type.');
      done();
    });
  });

  it('should not allow for an invalid league ID', function(done){
    scores.get('nfl', 200993464654, 37447178, 2017, function(err, scores){
      expect(err).to.equal('Invalid league ID.');
      done();
    });
  });

  it('should not allow for an invalid scores ID', function(done){
    scores.get('nfl', 200993, 3744717816546, 2017, function(err, scores){
      expect(err).to.equal('Invalid scores ID.');
      done();
    });
  });

  it('should not allow for an invalid season', function(done){
    scores.get('nfl', 200993, 37447178, 20176546, function(err, scores){
      expect(err).to.equal('Invalid season.');
      done();
    });
  });

  it('should not allow for an invalid URL', function(done){
    scores.get('http://www.fleaflicker.com/mlb/scores?scoresId=1517', function(err, scores){
      expect(err).to.equal('Invalid URL.');
      done();
    });
  });

  it('should error on a bad response', function(done){
    scores.get('http://www.fleaflicker.com/mlb/scores?scoresId=99999?season=2014', function(err, scores){
      expect(err).to.exist;
      done();
    });
  });
});
