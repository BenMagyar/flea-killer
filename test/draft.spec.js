var expect = require('chai').expect,
    draft = require('../lib/draft.js');

describe('Draft scraping', function(){

  it('should allow for a URL of a league', function(done){
    draft.get('http://www.fleaflicker.com/mlb/leagues/15313/draft?season=2014', function(err, draft){
      expect(draft.league.name).to.equal('SOS AL East 2015');
      done();
    });
  });

  it('should not allow for an invalid league type', function(done){
    draft.get('masdfa', 15317, 2014, function(err, league){
      expect(err).to.equal('Invalid league type.');
      done();
    });
  });

  it('should allow for a league ID', function(done){
    draft.get('mlb', 15313, 2014, function(err, draft){
      expect(draft.league.name).to.equal('SOS AL East 2015');
      done();
    });
  });

  it('should not allow for an invalid ID', function(done){
    draft.get('mlb', 15, 2014, function(err, draft){
      expect(err).to.equal('Invalid league ID.');
      done();
    });
  });

  it('should not allow for an invalid season', function(done){
    draft.get('mlb', 15317, 201412, function(err, league){
      expect(err).to.equal('Invalid season.');
      done();
    });
  });

  it('should not allow for an invalid URL', function(done){
    draft.get('http://www.fleaflicker.com/mlb/draft-board?leagueId=153133', function(err, draft){
      expect(err).to.equal('Invalid URL.');
      done();
    });
  });

  it('should error on a bad response', function(done){
    draft.get('http://www.fleaflicker.com/mlb/draft-board?leagueId=99999?season=2014', function(err, draft){
      expect(err).to.exist;
      done();
    });
  });

  // it('should correctly pick up all draft picks', function(done){
  //   draft.get('mlb', 15313, 2014, function(err, draft){
  //     expect(draft.picks.length).to.equal(336);
  //     expect(draft.picks[3].round).to.equal(1);
  //     expect(draft.picks[3].pick.overall).to.equal(4);
  //     expect(draft.picks[3].pick.round).to.equal(4);
  //     done();
  //   });
  // });

});
