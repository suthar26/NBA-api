var express = require('express');
var router = express.Router();
var nba = require('nba.js')
var fs = require('fs')
var _ = require('underscore')

var teamsArr = JSON.parse(fs.readFileSync('./data/teams.json','utf8'))
var playersArr = JSON.parse(fs.readFileSync('./data/players.json','utf8'))

/* GET home page. */
router.get('/', function(req,res,next) {
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
      team.url = '/team/' + temp.urlName;
      return team 
    });
    statsArr.sort((a,b)=>{
      return a.ppg.rank - b.ppg.rank
    })
    res.render('teams', { title: 'Team - NBA API Test' , statsArr: statsArr });
  }).catch(error=>{
    console.error("Team Home: "+error)
  })
});

router.get('/:team', function(req, res) {
  var scheduleArr;
  var team;
  nba.data.teamSchedule({
    year:2018,
    teamName:req.params.team
  }).then(query => {
    scheduleArr = query.league.standard.filter(game => game.seasonStageId === 2)
    scheduleArr.forEach(game => {
      delete game.watch ;
    });
    team = _.where(teamsArr,{urlName : req.params.team})
    scheduleArr = scheduleArr.map(game=>{
      var home = _.find(teamsArr,{teamId : game.hTeam.teamId})
      var visitor = _.find(teamsArr,{teamId : game.vTeam.teamId})
      game.hTeam.fullName = home.fullName
      game.vTeam.fullName = visitor.fullName
      game.hTeam.url = '/team/' + home.urlName;
      game.vTeam.url = '/team/' + visitor.urlName;
      return game 
    });
    // console.log(scheduleArr);
    res.render('team', { title: team[0].fullName , schedule: scheduleArr });
  }).catch(error=>{
    console.error("Team Schedule: "+error)
  })
});

module.exports = router;
