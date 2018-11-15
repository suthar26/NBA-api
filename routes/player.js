var express = require('express');
var router = express.Router();
var nba = require('nba.js');
var fsp = require('fs').promises;
var fs = require('fs')
var _ = require('underscore')

var teamsArr = JSON.parse(fs.readFileSync('./data/teams.json','utf8'))
var playersArr = JSON.parse(fs.readFileSync('./data/players.json','utf8'))

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(req.query)
  nba.stats.boxscoreAdvanced(function(err,query){
    if(err){
      console.error(err)
      return
    }
    console.log(query);
    res.render('temp', { query: query});
    // res.render('index');
  });
  
  // nba.stats.allPlayers({
  //   LeagueID: 00,
  //   Season: 2018-19,
  //   IsOnlyCurrentSeason: 1
  // }).then(query => {
  //     console.log("here")
  //     console.log(query)
  //     res.render('index', { title: 'Team - NBA API Test'});
  // }).catch(err=> console.error(err));
});

router.get('/:team', function(req, res) {
  nba.data.teamSchedule({
    year:2018,
    teamName:req.params.team
  }).then(query => {
    let scheduleArr = query.league.standard.filter(game => game.seasonStageId === 2)
    scheduleArr.forEach(game => {
      delete game.watch ;
    });
    // console.log(scheduleArr);
    res.render('team', { title: 'Team - NBA API Test' , schedule: scheduleArr });
  }).catch(error=>{
    console.error("Schedule: "+error)
  })
});

module.exports = router;
