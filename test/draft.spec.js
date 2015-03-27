var expect = require('chai').expect,
    draft = require('../lib/draft.js');

describe('Draft scraping', function(){

  it('should allow for a URL of a league', function(done){
    draft.get('http://www.fleaflicker.com/mlb/draft-board?leagueId=15313', function(err, draft){
      expect(draft.league.name).to.equal('SOS AL East 2015');
      done();
    });
  });

  it('should allow for a league ID', function(done){
    draft.get(15313, function(err, draft){
      expect(draft.league.name).to.equal('SOS AL East 2015');
      done();
    });
  });

  it('should not allow for an invalid ID', function(done){
    draft.get(4132322, function(err, draft){
      expect(err).to.equal('Invalid identifier length');
      done();
    });
  });

  it('should not allow for an invalid URL', function(done){
    draft.get('http://www.fleaflicker.com/mlb/draft-board?leagueId=153133', function(err, draft){
      expect(err).to.equal('Invalid URL for league');
      done();
    });
  });

  it('should error on a bad response', function(done){
    draft.get('http://www.fleaflicker.com/mlb/draft-board?leagueId=99999', function(err, draft){
      expect(err).to.exist;
      done();
    });
  });

  it('should correctly pick up all draft picks', function(done){
    draft.get(15313, function(err, draft){
      expect(draft.picks.length).to.equal(336);
      expect(draft.picks[3].round).to.equal(1);
      expect(draft.picks[3].pick.overall).to.equal(4);
      expect(draft.picks[3].pick.round).to.equal(4);
      done();
    });
  });

});
