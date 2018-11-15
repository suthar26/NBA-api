var express = require('express');
var router = express.Router();
var nba = require('nba.js');
var fs = require('fs');

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

module.exports = router;
