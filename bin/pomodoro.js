#!/usr/bin/env node

var beep = require('beepbeep' ),
    notifier = require('node-notifier' ),
    program = require('commander' ),
    progressBar = require('progress' );

var INTERVAL = 1000; // update once per second
var DEFAULT_DURATION = 25;
var DEFAULT_BREAK_DURATION = 5;

program
  .version('turnip ' + require('../package').version)
  .option('-d, --duration <duration>', 'duration in minutes')
  .option('-t, --task <name>', 'task name (default: 25 minutes)')
  .option('-b, --break', 'take a break (default: 5 minutes)')
  .parse(process.argv);

// todo handle input errors, default to pomodoro and not help
if (program.task) {
  var duration = (program.duration && program.duration > 0)
    ? program.duration : DEFAULT_DURATION;
    startPomodoro(program.task, duration);
} else if(program.break) {
  var duration = (program.duration && program.duration > 0)
    ? program.duration : DEFAULT_BREAK_DURATION;
    startPomodoro('Break time!', duration);
}
else{
  program.help();
}

function startPomodoro(task, duration) {
  var totalTime = duration * 60;
  var elapsedTime = 0;
  var label =  task + ' [:bar] Time left :token1';
  var bar = new progressBar(label,
    {
      width: 50,
      total: totalTime
    });
  var timer = setInterval(function(){
    elapsedTime++;
    bar.tick(1, {
      'token1': formatTime(totalTime - elapsedTime)
    });
    if (bar.complete) {
      beep(2, 100); // todo: find better notification sound
      console.log('\nPomodoro for ' + task + ' completed\n');
      clearInterval(timer);
      notifier.notify({
        'title': 'Pomodoro Complete',
        'message': 'Pomodoro for ' + task + ' completed'
      });
    }
  }, INTERVAL);
}

function formatTime(seconds) {
  var mins = Math.trunc(seconds/60);
  seconds = (seconds < 60) ? seconds : seconds % 60;
  var placeholder = (seconds > 9) ? '' : '0';
  if(mins > 0.0) {
    return mins + ':' + placeholder + seconds;
  } else {
    return seconds + 's';
  }
}