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
    return fsp.writeFile('./data/teams.json',JSON.stringify(teamsArr));
  })
  .then(()=>{
    console.log('write team.json success');
  }) 
  .catch(error=>{
    console.error("SHIEEET"+error)
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