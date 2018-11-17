var express = require('express');
var router = express.Router();
var nba = require('nba.js');
var fs = require('fs');
var YahooFantasy = require('yahoo-fantasy');
//consumer key dj0yJmk9R2hneGJHVDc1MVJZJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWVl
//consumer secret afe76d6ae929ef72ca9a6a55c546d0b87875c4c3
//App ID RD5q9p4e
var APPLICATION_KEY = 'dj0yJmk9R2hneGJHVDc1MVJZJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWVl';
var APPLICATION_SECRET = 'afe76d6ae929ef72ca9a6a55c546d0b87875c4c3';
var OAuthAccessToken = 0;

var yf = new YahooFantasy( APPLICATION_KEY, APPLICATION_SECRET);
/* GET home page. */
router.get('/', function(req, res, next) {
  nba.data.teams({
    year:2018
  }).then(query => {
    //console.log(query.league.standard);
    let teamsArr = query.league.standard.filter(team => team.isNBAFranchise).map(team => {
      let newTeam = team;
      newTeam.url = '/team/' + team.urlName;
      return newTeam;
    });
    //console.log(arr);
    res.render('index', { title: 'NBA API Test' , teams: teamsArr });
  }).catch(error=>{
    console.error("SHIEEET"+error)
  })
});
/* GET home page. */
router.get('/test', function(req, res, next) {
  nba.stats.leagueLeaders({
    Season: '2018-19'
  }).then(query => {
    console.log(query[1]);
    
    // let teamsArr = query.league.standard.filter(team => team.isNBAFranchise).map(team => {
    //   let newTeam = team;
    //   newTeam.url = '/team/' + team.urlName;
    //   return newTeam;
    // });
    // console.log(teamsArr);
    fs.writeFile('./data/temp.json',JSON.stringify(query),err => {
      if(err)
        logger.error(err)
      
      console.log('write temp.json successful')
    })
    res.render('temp', { arr: query.LeagueLeaders });
  }).catch(error=>{
    console.error("SHIEEET"+error)
  })
});

router.get('/testfan', function(req, res, next) {
  league_key = '385.l.17169';
  week = '5';
  yf.league.scoreboard(
    league_key,
    week,
    function(err, data){
      if (err)
        console.error(err);

      console.log(data);
      
    }
  )
  res.render('temp', { arr: ['hello','hello'] });
});

module.exports = router;
