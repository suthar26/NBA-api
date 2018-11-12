var express = require('express');
var router = express.Router();
var nba = require('nba.js')

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

module.exports = router;
