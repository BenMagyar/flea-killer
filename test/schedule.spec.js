var expect = require('chai').expect,
    schedule = require('../lib/schedule.js');

describe('schedule scraping', function(){

  it('should allow for a URL of a schedule', function(done){
    schedule.get('https://www.fleaflicker.com/nfl/leagues/200993/schedules/1342838/schedule?season=2017', function(err, schedule){
      expect(schedule.name).to.equal('OBJYN');
      done();
    });
  });

  it('should allow for a schedule ID', function(done){
    schedule.get('nfl', 200993, 1342838, 2017,  function(err, schedule){
      expect(schedule.name).to.equal('OBJYN');
      done();
    });
  });

  it('should not allow for an invalid league type', function(done){
    schedule.get('masdfa', 15317, 91774, 2014, function(err, schedule){
      expect(err).to.equal('Invalid league type.');
      done();
    });
  });

  it('should not allow for an invalid league ID', function(done){
    schedule.get('mlb', 153452345234515317, 91744, 2014, function(err, schedule){
      expect(err).to.equal('Invalid league ID.');
      done();
    });
  });

  it('should not allow for an invalid schedule ID', function(done){
    schedule.get('mlb', 15317, 12351234123, 2014, function(err, schedule){
      expect(err).to.equal('Invalid schedule ID.');
      done();
    });
  });

  it('should not allow for an invalid season', function(done){
    schedule.get('mlb', 15317, 91774, 2014234, function(err, schedule){
      expect(err).to.equal('Invalid season.');
      done();
    });
  });

  it('should not allow for an invalid URL', function(done){
    schedule.get('http://www.fleaflicker.com/mlb/schedule?scheduleId=1517', function(err, schedule){
      expect(err).to.equal('Invalid URL.');
      done();
    });
  });

  it('should error on a bad response', function(done){
    schedule.get('http://www.fleaflicker.com/mlb/schedule?scheduleId=99999?season=2014', function(err, schedule){
      expect(err).to.exist;
      done();
    });
  });
});
