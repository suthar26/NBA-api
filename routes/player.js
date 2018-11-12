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
  nba.data.teamStatsLeaders({
    year:2018,
  }).then(query => {
    query = query.league.standard.regularSeason.teams
    delete query.preseason
    delete query.seasonYear
    
    var statsArr = query
    statsArr = statsArr.filter(team=>{
      return _.find(teamsArr,{teamId : team.teamId}) != undefined
    }).map(team=>{
      var temp = _.find(teamsArr,{teamId : team.teamId})
      team.fullName = temp.fullName
      return team 
    });
    console.log(statsArr)
    res.render('teamStatLeader', { title: 'Team - NBA API Test' , schedule: query });
  }).catch(error=>{
    console.error("Schedule: "+error)
  })
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
