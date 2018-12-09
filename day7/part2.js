/**
As you're about to begin construction, four of the Elves offer to help. "The sun will set soon; it'll go faster if we work together." Now, you need to account for multiple people working on steps simultaneously. If multiple steps are available, workers should still begin them in alphabetical order.

Each step takes 60 seconds plus an amount corresponding to its letter: A=1, B=2, C=3, and so on. So, step A takes 60+1=61 seconds, while step Z takes 60+26=86 seconds. No time is required between steps.

To simplify things for the example, however, suppose you only have help from one Elf (a total of two workers) and that each step takes 60 fewer seconds (so that step A takes 1 second and step Z takes 26 seconds). Then, using the same instructions as above, this is how each second would be spent:

Second   Worker 1   Worker 2   Done
   0        C          .        
   1        C          .        
   2        C          .        
   3        A          F       C
   4        B          F       CA
   5        B          F       CA
   6        D          F       CAB
   7        D          F       CAB
   8        D          F       CAB
   9        D          .       CABF
  10        E          .       CABFD
  11        E          .       CABFD
  12        E          .       CABFD
  13        E          .       CABFD
  14        E          .       CABFD
  15        .          .       CABFDE
Each row represents one second of time. The Second column identifies how many seconds have passed as of the beginning of that second. Each worker column shows the step that worker is currently doing (or . if they are idle). The Done column shows completed steps.

Note that the order of the steps has changed; this is because steps now take time to finish and multiple workers can begin multiple steps simultaneously.

In this example, it would take 15 seconds for two workers to complete these steps.

With 5 workers and the 60+ second step durations described above, how long will it take to complete all of the steps?
*/

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const _ = require('lodash');

const input = fs.readFileSync(path.resolve(__dirname, './input.txt'), 'utf-8');

const re = /Step (\w) must be finished before step (\w) can begin./;

const lines = input.split('\n').map(l => re.exec(l)).map(([, a, b]) => [a, b]);

const scheduleJobs = (inp, numWorkers = 5, minJobLen = 60)  => {
  let grouped = _(inp)
    .flatMap()
    .uniq()
    .map(k => [k, inp.filter(([a]) => a === k).map(([,b]) => b)])
    .sortBy(([k, ar]) => k)
    .value();
    let sec = 0;
    let workers = [];

    while(grouped.length) {
      sec++;
      workers.forEach(worker => {
        worker.secs--;
      });

      workers = workers.filter(({ secs }) => secs);
      
      const available = grouped
        .filter(([a]) => 
          workers.every(({ waiting }) => !waiting.includes(a)) &&
            grouped.every(([,b]) => !b.includes(a)));
          
      while(available.length && workers.length < numWorkers) {
        const av = available.shift();
        grouped = grouped.filter(([a]) => a !== av[0]);
        workers.push(({
          key: av[0],
          secs: minJobLen + (av[0].charCodeAt(0) - 'A'.charCodeAt(0) + 1),
          waiting: av[1],
        }));
      }
      console.log(`sec: ${sec} workers: ${workers.map(({ key, secs }) => `${key} - ${secs}`)}`);
      // console.log(grouped);
      // break;
    }

    sec += workers.reduce((sum, { secs }) => sum + secs - 1, 0);
    return sec;
}

const test1 =  `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`.split('\n')
  .map(l => re.exec(l))
  .map(([, a, b]) => [a, b]);

assert(scheduleJobs(test1, 2, 0) === 15);

console.log(scheduleJobs(lines))