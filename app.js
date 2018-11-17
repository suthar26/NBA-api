var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var teamRouter = require('./routes/team')
var playerRouter = require('./routes/player')
var fs = require('fs');
var fsp = require('fs').promises;
var app = express();
var nba = require('nba.js');
var _ = require('underscore');
var request = require('request')

var options = {
  method : 'GET',
  url : 'https://basketballmonster.com/monster.aspx',
  headers : {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,lb;q=0.6',
    'Host': 'basketballmonster.com',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'DNT': '1',
    'Cookie': 'RotoMonsterUserId=iXW+kZ49/HCrwJ4qPWrTY90+Edv2YNww/A6qNA3Dqlo=; ASP.NET_SessionId=roheoc3bjnyqxkfgm1c2bwcd'
  },
}

request(options,(err,res,body)=>{
  if(!err && res.statusCode == 200){
    console.log(body)
  }
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var teamsArr, playersArr
getTeams(2018);
getPlayers(2018);

app.use('/', indexRouter);
app.use('/team',teamRouter);
app.use('/player',playerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

function getTeams(year){
  nba.data.teams({
    year:year
  })
  .then(query => {
    teamsArr = query.league.standard.filter(team => team.isNBAFranchise).map(team => {
      let newTeam = team;
      newTeam.url = '/team/' + team.urlName;
      return newTeam;
    });
    fs.writeFile('./data/team.json',JSON.stringify(teamsArr),err => {
      if(err)
        logger.error(err)
      
      console.log('write teams.json successful') ; 
    })
})
}
function getPlayers(year){
  nba.data.players({
    year:year
  }).then(query => {
    playersArr = query.league.standard.filter(player => {
      if (player.teams[0] === undefined){
      } else {
        team = _.find(teamsArr,{teamId : player.teams[player.teams.length - 1].teamId})
        let np = player;
        np.teamName = team.fullName;
        return np
      }
    })
    .map(player => {
      let newPlayer = player;
      newPlayer.url = '/player/' + player.personId;
      return newPlayer;
    });
    fs.writeFile('./data/players.json',JSON.stringify(playersArr),err => {
      if(err)
        logger.error(err)
      
      console.log('write players.json successful')
    })
  }).catch(error=>{
    console.error("SHIEEET"+error)
  })
}