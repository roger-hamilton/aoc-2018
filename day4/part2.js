/**
Strategy 2: Of all guards, which guard is most frequently asleep on the same minute?

In the example above, Guard #99 spent minute 45 asleep more than any other guard or minute - three times in total. (In all other cases, any guard spent any minute asleep at most twice.)

What is the ID of the guard you chose multiplied by the minute you chose? (In the above example, the answer would be 99 * 45 = 4455.)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');
const lines = input.split('\n').map(n => n.trim());

const lineRe = /^\[(?<year>\d+)-(?<month>\d+)-(?<day>\d+) (?<hour>\d+):(?<minute>\d+)\] (?<message>.*)$/;
const parseLine = line => _.mapValues(lineRe.exec(line).groups, v => isNaN(v) ? v : +v);

const schedule = _(lines).map(parseLine)
  .sortBy('minute') // assuming that sortBy is a "stable" sort
  .sortBy('hour')
  .sortBy('day')
  .sortBy('month')
  .sortBy('year')
  .value();

const beginShift = /Guard #(?<number>\d+) begins shift/;
const fallsAsleep = /falls asleep/;

const addGuards = (schedule) => {
  let cur;
  return schedule.map((line) => {
    let match;
    if (match = beginShift.exec(line.message)) {
      cur = match.groups.number;
      return {
        ...line,
        start: true,
        guard: cur,
      };
    }
    if (match = fallsAsleep.exec(line.message)) {
      return {
        ...line,
        asleep: true,
        guard: cur,
      };
    }
    return {
      ...line,
      wake: true,
      guard: cur,
    };
  });
}

const diff = (l1, l2) => {
  let days = l1.day - l2.day;
  if (days < 0) days = 1; // happens if it is over a month boundry

  const hours = l1.hour - l2.hour;
  const mins = l1.minute - l2.minute;
  return (days * 24 + hours) * 60 + mins;
}

const calcTotalAsleep = (list) => {
  let total = 0;
  for(let i = 0; i < list.length; i += 2) {
    const d = diff(list[i+1], list[i]);
    total += d;
  }
  return total;
}

const findMaxMinuteAsleep = (guardSchedule) => {
  const mins = Array(60).fill(0);
  for(let i = 0; i < guardSchedule.length; i += 2) {
    const d = diff(guardSchedule[i + 1], guardSchedule[i]);
    for(let j = 0; j < d; j++) {
      mins[(guardSchedule[i].minute + j) % 60]++;
    }
  }
  const max = Math.max(...mins)
  return [max, mins.indexOf(max)];
}

const findMaxAsleep = schedule => {
  const withGuards = addGuards(schedule).filter(({ start }) => !start);
  
  const byGuard = _.groupBy(withGuards, 'guard');
  
  const maxMinutesByGuard = _.mapValues(byGuard, findMaxMinuteAsleep)

  let maxMins = [0, 0];
  let maxGuard;
  
  for(let guard in maxMinutesByGuard) {
    const mins = maxMinutesByGuard[guard];
    if (mins[0] > maxMins[0]) {
      maxGuard = guard;
      maxMins = mins;
    }
  }
  return maxGuard * maxMins[1];
}



const test1 = _(`[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up`.split('\n')).map(parseLine)
  .sortBy('minute') // assuming that sortBy is a "stable" sort
  .sortBy('hour')
  .sortBy('day')
  .sortBy('month')
  .sortBy('year')
  .value();

const res = findMaxAsleep(test1);
assert(res === 4455);

console.log(findMaxAsleep(schedule))