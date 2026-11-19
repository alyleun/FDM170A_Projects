/* 
  This file contains code for (a) a planner, virtually
  identical to the one used in the last project,
  FDM 170A.6: Structures; and (b) code for montaging clips
  together given the output from the planner.
  
  Make sure that the call to the plan function
  (in the function playClip) makes sense for your
  operators.  Right now the call is plan(["I"],[])
  because that makes sense for the example operators,
  the BOND_OPERATORS.
  
  To start watching the output film, click once on the
  webpage.  To rerun the planner and the clip montage
  (and get a different stories and a different sequence 
  of clips) double click on the webpage.
  
  If you are having a hard time debugging your clips
  and operators, I recommend you export the code (using 
  the "Export" button in the lower right corner) and then open
  the resulting index.html file in a Chrome Browser with the 
  JavaScript console open.  Information useful for debugging
  will be printed to the console.
  
  Your take for this project is to assemble a set of story
  operators (or adapt the set you composed for the last project)
  and to select a set of clips to illustrate each of the 
  operators.  To see how these need to be coded, see the example
  operators and clips defined below in the BOND_OPERATORS.
  
*/

/*
 
 PLANNER.JS
 
 Warren Sack <wsack@ucsc.edu>
 September 2024
 
 This is a GPS-style planner where goals and assertions 
 are atomic propositions (without variables). For more 
 details, see the code for the FILM 170A.6: Structures
 project. 
 
*/

//
// OPERATORS_USED: array of strings
//
// Keep track of the names of operators used in previous
// plans. Avoid using the same operators later, if possible.
//
let OPERATORS_USED = [];

//
// removeElement(string,array): array
//
// Returns a copy of the input array with
// the element e removed.
//
function removeElement(e, a) {
  let result = [];
  for (let i = 0; i < a.length; i++) {
    if (a[i] != e) {
      result.push(a[i]);
    }
  }
  return result;
}

//
// isMember(string,array): boolean
//
// Returns true if the element e is in the
// input array, a.
//
function isMember(e, a) {
  for (let i = 0; i < a.length; i++) {
    if (e == a[i]) {
      return true;
    }
  }
  return false;
}

//
// plan(array,array): [boolean,array,array]
//
// Given a currentState and a list of goals, and
// assuming a predefined list of OPERATORS, returns
// true, the end state, and a plan if the goals can
// be achieved; returns false, the currentState, and
// an invalid plan otherwise.
//
function plan(goals, currentState) {
  let nextState = [...currentState];
  currentPlan = [];
  let success = true;
  let i;
  console.log("beginning");
  for (i = 0; i < currentState.length; i++) {
    console.log("   " + currentState[i]);
  }
  for (i = 0; i < goals.length; i++) {
    [success, nextState, currentPlan] = achieveGoal(
      goals[i],
      nextState,
      currentPlan
    );
    if (!success) {
      console.log("unable to achieve goal " + goals[i]);
    }
  }
  if (!success) {
    console.log("plan not found");
  } else {
    console.log("ending");
    for (i = 0; i < nextState.length; i++) {
      console.log("   " + nextState[i]);
    }
  }
  return [success, nextState, currentPlan];
}

//
// achieveGoal(string,array,array): [boolean,array,array]
//
// If goal is in the currentState, returns immediately;
// otherwise, operators that could achieve the goal are
// selected and each selected is attempted.
//
// Returns an updated state and plan if an attempt succeeds;
// returns the current state and plan if all fail.
//
function achieveGoal(goal, currentState, currentPlan) {
  let nextState = [...currentState];
  let nextPlan = [...currentPlan];
  if (isMember(goal, nextState)) {
    return [true, currentState, currentPlan];
  } else {
    let selections = selectOperators(goal);
    let success = false;
    for (let i = 0; i < selections.length; i++) {
      if (!success) {
        [success, nextState, nextPlan] = applyOperator(
          selections[i],
          nextState,
          nextPlan
        );
      }
    }
    if (success) {
      return [true, nextState, nextPlan];
    } else {
      return [false, currentState, currentPlan];
    }
  }
}

//
// selectOperators(string): array
//
// Finds all operators containing the goal in the
// additions list.
//
function selectOperators(goal) {
  let selections = [];
  let usedSelections = [];
  let unusedSelections = [];
  let i;
  for (i = 0; i < OPERATORS.length; i++) {
    if (isMember(goal, OPERATORS[i].additions)) {
      selections.push(OPERATORS[i]);
    }
  }
  // Any operators that have been used before are
  // moved to the end of the list.
  for (i = 0; i < selections.length; i++) {
    if (isMember(selections[i].name, OPERATORS_USED)) {
      usedSelections.push(selections[i]);
    } else {
      unusedSelections.push(selections[i]);
    }
  }
  selections = unusedSelections.concat(usedSelections);
  return selections;
}

//
// applyOperator(object,array,array): [boolean,array,array]
//
// Returns an updated state and plan if application
// succeeds:
// [true,state,plan]
// returns the current state and plan, if it fails:
// [false,state,plan]
//
function applyOperator(operator, currentState, currentPlan) {
  let nextState = [...currentState];
  let nextPlan = [...currentPlan];
  let success = true;
  let i;
  // Attempt to achieve each of the preconditions.
  for (i = 0; i < operator.preconditions.length; i++) {
    if (success) {
      [success, nextState, nextPlan] = achieveGoal(
        operator.preconditions[i],
        nextState,
        nextPlan
      );
    }
  }
  // If the preconditions are solved, execute the operator
  // by deleting its deletions and adding its additions to
  // the state.
  if (success) {
    console.log(operator.name);
    nextPlan.push(operator.name);
    if (operator.deletions.length > 0) {
      console.log("   deleting ");
    }
    for (i = 0; i < operator.deletions.length; i++) {
      console.log("       " + operator.deletions[i]);
      nextState = removeElement(operator.deletions[i], nextState);
    }
    if (operator.additions.length > 0) {
      console.log("   adding ");
    }
    for (i = 0; i < operator.additions.length; i++) {
      console.log("       " + operator.additions[i]);
      nextState.push(operator.additions[i]);
    }
    OPERATORS_USED.push(operator.name);
    return [true, nextState, nextPlan];
  } else {
    return [false, currentState, currentPlan];
  }
}

/*
    James Bond Operators  
    
    Inspired by 
    
    Umbert Eco. 1979. "Narrative Structures in Fleming." In The Role 
        of the Reader: Explorations in the Semiotics of Texts.
        Bloomington, IN: Indiana University Press.
        
    Example useage:
        plan(["I"],[]);
        
    Note that in this version, every planning operator
    also has one or more clips associated with it.
    
    Your operators, possibly  adapted from the last
    project, should be edited to include clips too.
        
*/

// Replace all of the following with your own
// operators and clips.
//
// Each operato must have one or more
// clips [in an array].
//
// Each clip must have a comment,
// a caption, a src, a start,
// and an end time.
//
// The comment can be any string of
// words. However, a unique comment
// for each clip will help you debugging.
// If you are having a hard time debugging,
// open the JavaScript console. Progress
// in selecting clips will be printed
// to the console.
//
// The start and end times
// must either be integers or
// else string in this format:
// "HH:MM:SS"
// For example, "00:30:07"
// means 0 hours, 30 minutes,
// and 7 seconds.
//
// Note that for debugging purposes
// I have shortened all of the 
// clips to 5 seconds.  Commented out
// are the actual end times that I
// want for the clips.  Once I have 
// the planner and the montager
// wgenerating the sets of sequences
// I want, I will change the end times
// back to what I originally selected.
//
// The example clips have captions
// that match the operator names,
// but they do not need to match.
//
// You must include two or more
// operators with identical additions;
// and you must include two or more
// clips for at least one of the operators.
// By including these, the system
// can generate a set of montages
// (rather than just one).
//
const BOND_OPERATORS = [
  {
    name: "M moves and gives a task to Bond.",
    preconditions: [],
    additions: ["A"],
    deletions: [],
    clips: [
      // Note that two clips illustrate the change (A)
      // effected by this operator.
      {
        comment: "clip 1 of 2 for illustrating A",
        caption: "M moves and gives a task to Bond",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/GoldFinger.mp4",
        start: "00:18:46",
        end: "00:18:51" // "00:19:07"
      },
      {
        comment: "clip 2 of 2 for illustrating A",
        caption: "M moves and gives a task to Bond",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/Dr.No.mp4",
        start: "00:11:29",
        end: "00:11:34" // "00:12:23"
      }
    ]
  },
  {
    name: "Villain moves and appears to Bond.",
    preconditions: ["A"],
    additions: ["B"],
    deletions: ["A"],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating B",
        caption: "Villain moves and appears to Bond.",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/GoldFinger.mp4",
        start: "00:25:21",
        end: "00:25:26" // "00:25:41"
      }
    ]
  },
  {
    name: "Bond moves and gives a first check to Villain",
    preconditions: ["B"],
    additions: ["C"], // Note that two operators add C, this one and the
    // one immediately below.
    deletions: ["B"],
    clips: [
      {
        comment: "clip 1 of 2 for illustrating C",
        caption: "Bond moves and gives a first check to Villain",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/GoldFinger.mp4",
        start: "00:30:41",
        end: "00:30:46" // "00:31:20"
      }
    ]
  },
  {
    name: "Villain gives first check to Bond.",
    preconditions: ["B"],
    additions: ["C"],
    deletions: ["B"],
    clips: [
      {
        comment: "clip 2 of 2 for illustrating C",
        caption: "Villain gives first check to Bond.",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/GoldFinger.mp4",
        start: "00:32:20",
        end: "00:32:25" // "00:32:49"
      }
    ]
  },
  {
    name: "Woman moves and shows herself to Bond.",
    preconditions: ["C"],
    additions: ["D"],
    deletions: ["C"],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating D",
        caption: "Woman moves and shows herself to Bond.",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/GoldFinger.mp4",
        start: "00:37:05",
        end: "00:37:10" // "00:37:45"
      }
    ]
  },
  {
    name: "Bond takes Woman.",
    preconditions: ["D"],
    additions: ["E"],
    deletions: ["D"],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating E",
        caption: "Bond takes Woman.",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/GoldFinger.mp4",
        start: "00:37:59",
        end: "00:38:04" // "00:38:37"
      }
    ]
  },
  {
    name: "Villain captures Bond.",
    preconditions: ["E"],
    additions: ["F"],
    deletions: ["E"],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating F",
        caption: "Villain captures Bond.",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/GoldFinger.mp4",
        start: "00:46:35",
        end: "00:46:40" // "00:47:10"
      }
    ]
  },
  {
    name: "Villain tortures Bond.",
    preconditions: ["F"],
    additions: ["G"],
    deletions: ["F"],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating G",
        caption: "Villain tortures Bond.",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/GoldFinger.mp4",
        start: "00:50:18",
        end: "00:50:23" // "00:51:58"
      }
    ]
  },
  {
    name: "Bond beats Villain.",
    preconditions: ["G"],
    additions: ["H"],
    deletions: ["G"],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating H",
        caption: "Bond beats Villain.",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/GoldFinger.mp4",
        start: "01:46:08",
        end: "01:46:13" // "01:47:20"
      }
    ]
  },
  {
    name: "Bond, convalescing, enjoys Woman, whom he then loses.",
    preconditions: ["H"],
    additions: ["I"],
    deletions: ["H"],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating I",
        caption: "Bond, convalescing, enjoys Woman, whom he then loses.",
        src: "https://people.ucsc.edu/~wsack/FILM170A/Films/GoldFinger.mp4",
        start: "01:47:40",
        end: "01:47:45" // "01:48:40"
      }
    ]
  }
];

let SPIDER_OPERATORS = [
  {
    name: "nerdy-boy-bullied",
    preconditions: ["nerdy-peter-parker","fierce-flash-thompson"],
    additions: ["thompson-and-friends-bully-parker","bullied-peter-parker"],
    deletions: ["nerdy-peter-parker"],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating nerdy-boy-bullied",
        caption: "Peter Parker is bullied",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:03:38",
        end: "00:04:33"
      }
	]
  },
  {
    name: "love-to-mary-jane",
    preconditions: ["lovely-mary-jane","bullied-peter-parker","mary-is-thompson's-girlfriend"],
    additions: ["peter-love-mary"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 2 for illustrating love-to-mary-jane",
        caption: "Peter love Mary Jane",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:04:45",
        end: "00:05:11"
      },
      {
        comment: "clip 2 of 2 for illustrating love-to-mary-jane",
        caption: "Peter love Mary Jane",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:08:10",
        end: "00:09:54"
      }
    ]
  },
  {
    name: "spider-bite-brings-a-hero",
    preconditions: ["peter-love-mary","escaped-lab-spider"],
    additions: ["spider-bites-peter","peter-gets-super-power"],
    deletions: ["bullied-peter-parker"],
    clips: [
      {
        comment: "clip 1 of 2 for illustrating spider-bite-brings-a-hero",
        caption: "Spider bites Peter",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:10:10",
        end: "00:10:51"
      },
      {
        comment: "clip 2 of 2 for illustrating spider-bite-brings-a-hero",
        caption: "Peter's DNA changes",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:13:44",
        end: "00:14:54"
      }
    ]
  },
  {
    name: "no-more-bully",
    preconditions: ["peter-gets-super-power"],
    additions: ["peter-tests-his-power-in-school","peter-wins-a-hallway-fight-against-flash-thompson"],
    deletions: ["fierce-flash-thompson"],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating no-more-bully",
        caption: "Peter shows his power in school",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:22:44",
        end: "00:24:52"
      }
    ]
  },
  {
    name: "regret-to-lose-uncle-ben",
    preconditions: ["peter-tests-his-power-in-school","uncle-ben","the-robber"],
    additions: ["peter-play-underground-wrestling","peter-let-robber-goes","robber-kills-uncle-ben"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating regret-to-lose-uncle-ben",
        caption: "Peter regrets to let the robber goes",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:42:15",
        end: "00:44:30"
      }
    ]
  },
  {
    name: "peter-save-uncle-ben",
    preconditions: ["peter-tests-his-power-in-school","uncle-ben","the-robber"],
    additions: ["peter-play-underground-wrestling","peter-follow-the-robber","robber-wants-to-take-uncle-ben's-car","peter-stops-the-robber-and-saves-uncle-ben"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating peter-save-uncle-ben",
        caption: "Peter seizes the robber",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:44:42",
        end: "00:47:58"
      }
    ]
  },
  {
    name: "spider-man-fighting-crime",
    preconditions: ["peter-play-underground-wrestling","new-red-and-blue-suit","harry-osborn"],
    additions: ["vigilante-spider-man","peter-realizes-harry-and-mary-were-together"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating spider-man-fighting-crime",
        caption: "Spider-man fights crime",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:54:02",
        end: "00:55:51"
      }
    ]
  },
  {
    name: "job-at-daily-bugle",
    preconditions: ["vigilante-spider-man"],
    additions: ["peter-sell-exclusive-photos-of-spider-man","editor-jameson-brand-spider-man-as-public-menace"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating job-at-daily-bugle",
        caption: "Peter work for daily bugle",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "01:00:45",
        end: "01:02:41"
      }
    ]
  },
  {
    name: "norman-osborn-turned-evil",
    preconditions: ["peter-sell-exclusive-photos-of-spider-man","norman-osborn","super-serum"],
    additions: ["norman-is-under-great-pressure-on-his-project","norman-test-serum-on-himself","norman-become-green-goblin"],
    deletions: ["norman-osborn"],
    clips: [
      {
        comment: "clip 1 of 2 for illustrating norman-osborn-turned-evil",
        caption: "Norman test the serum on himself",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:14:56",
        end: "00:17:46"
      },
      {
        comment: "clip 2 of 2 for illustrating norman-osborn-turned-evil",
        caption: "Green Goblin destroys the Quest Aerospace demonstration",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "00:49:52",
        end: "00:50:46"
      }
    ]
  },
  {
    name: "killings-at-unity-day-festival",
    preconditions: ["norman-become-green-goblin"],
    additions: ["green-goblin-kills-oscorp-directors","spider-man-saves-mary-jane"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating killings-at-unity-day-festival",
        caption: "Green Goblin kills Oscorp directors",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "01:05:45",
        end: "01:10:42"
      }
    ]
  },
  {
    name: "green-goblin-offer-a-partnership",
    preconditions: ["green-goblin-kills-oscorp-directors"],
    additions: ["green-goblin-knocks-spider-man-down","green-goblin-asks-for-an-alliance","spider-man-refuses"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating green-goblin-offer-a-partnership",
        caption: "Green Goblin gives Spider-man an offer",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "01:15:01",
        end: "01:17:32"
      }
    ]
  },
  {
    name: "identity-of-spider-man-exposed",
    preconditions: ["green-goblin-asks-for-an-alliance"],
    additions: ["norman-and-peter-have-thanksgiving-dinner","norman-discovers-the-wound-inflicted-by-green-goblin-on-peter"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating identity-of-spider-man-exposed",
        caption: "Norman knows Peter is Spider-man",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "01:25:16",
        end: "01:28:54"
      }
    ]
  },
  {
    name: "green-goblin-attacks-peter's-loved-ones",
    preconditions: ["norman-and-peter-have-thanksgiving-dinner"],
    additions: ["green-goblin-attacks-aunt-may","aunt-may-was-in-hospital","harry-saw-peter-and-mary-holding-hand"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating green-goblin-attacks-peter's-loved-ones",
        caption: "Green Goblin attacks aunt May",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "01:30:42",
        end: "01:32:23"
      }
    ]
  },
  {
    name: "green-goblin-kidnaps-mary-jane",
    preconditions: ["green-goblin-attacks-aunt-may"],
    additions: ["green-goblin-caught-mary-and-tram-car-filled-with-children","spider-man-saves-both-of-them"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating green-goblin-kidnaps-mary-jane",
        caption: "Green Goblin kidnaps Mary Jane",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "01:39:40",
        end: "01:44:55"
      }
    ]
  },
  {
    name: "green-goblin-facing-spider-man",
    preconditions: ["green-goblin-caught-mary-and-tram-car-filled-with-children"],
    additions: ["green-goblin-drags-spider-man-into-a-brutal-fight","spider-man-discovers-green-goblin-is-norman","norman-is-killed-by-his-own-glider"],
    deletions: ["norman-become-green-goblin"],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating green-goblin-facing-spider-man",
        caption: "Green Goblin is killed by himself",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "01:45:30",
        end: "01:49:38"
      }
    ]
  },
  {
    name: "spider-man-brings-norman's-body-home",
    preconditions: ["green-goblin-drags-spider-man-into-a-brutal-fight"],
    additions: ["spider-man-brings-norman's-body-back-home","harry-meet-spider-man","harry-vows-to-take-revenge-on-spider-man"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating spider-man-brings-norman's-body-home",
        caption: "Spider-man brings Norman's body home",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "01:49:58",
        end: "01:51:22"
      }
    ]
  },
  {
    name: "peter-decline-mary's-love",
    preconditions: ["spider-man-brings-norman's-body-back-home"],
    additions: ["mary-tells-peter-she-loves-him","peter-realizes-his-enemies-will-target-those-he-love","peter-tells-mary-they-can-only-be-friends"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating peter-decline-mary's-love",
        caption: "Peter decline Mary's love",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "01:53:39",
        end: "01:54:59"
      }
    ]
  },
  {
    name: "peter-accept-mary's-love",
    preconditions: ["spider-man-brings-norman's-body-back-home"],
    additions: ["mary-tells-peter-she-loves-him","peter-determines-to-protect-those-he-love","peter-tells-mary-he-loves-her-too"],
    deletions: [],
    clips: [
      {
        comment: "clip 1 of 1 for illustrating peter-accept-mary's-love",
        caption: "Peter accept Mary's love",
        src: "https://hauyan.com/film/video/spiderman.mp4",
        start: "01:51:49",
        end: "01:53:30"
      }
    ]
  }
];

// OPERATORS should be assigned to your own operators
// instead of the BOND_OPERATORS.
//let OPERATORS = BOND_OPERATORS;
let OPERATORS = SPIDER_OPERATORS;

/*
  MONTAGE.js
  
  Given the output from the planner,
  construct a sequence of clips and
  play them.
*/

// Get the two HTML entities for displaying the
// video and the captions and assign them to
// the JavaScript variables vid and caption,
// respectively.
let vid = document.querySelector("video");
let caption = document.querySelector("#caption");

// Keep track of the clips that have already been shown.
let CLIPS_USED = [];

// This clip will be shown at the beginning of every montage.
// Please replace it with one of your own.
const PROLOGUE_CLIP = {
  comment: "prologue clip",
  caption: "",
  src: "https://hauyan.com/film/video/spiderman.mp4",
  start: "00:00:02",
  end: "00:00:32"
};

// This function calls the planner and then plays the clips.
// It is loaded and (re)started when the page is loaded
// and then if the user double-clicks on the page.
function playClips() {
  let success, state, operatorNames;
  let clips = [];
  // Change the following line to work with your operators.
  [success, state, operatorNames] = plan(
    ["mary-tells-peter-she-loves-him"],
    [
      "nerdy-peter-parker",
      "fierce-flash-thompson",
      "lovely-mary-jane",
      "mary-is-thompson's-girlfriend",
      "escaped-lab-spider",
      "uncle-ben",
      "the-robber",
      "norman-osborn",
      "harry-osborn",
      "super-serum",
      "new-red-and-blue-suit"
    ]
  );
  if (success) {
    clips.length = 0;
    clips = selectClips(operatorNames);
    console.log("---- selected clips ----");
    clips.map(function (c) {
      console.log(c.comment);
    });
    clips.unshift(PROLOGUE_CLIP);
    process(clips);
  }
  else { console.log("Planning failed."); }
}

// The video starts when it is capable of being played.
vid.addEventListener("canplay", playClips(), { once: true });

// When the window outside of the video is double clicked,
// replan and play a new sequence of clips
window.addEventListener(
  "dblclick",
  function () {
    vid.pause();
    playClips();
  },
  false
);

// Given a sequence of operator names, select a sequence of clips
// to represent them.
function selectClips(operatorNames) {
  let clips = [];
  let selections = [];
  let usedSelections = [];
  let unusedSelections = [];
  for (let i = 0; i < operatorNames.length; i++) {
    selections.length = 0;
    usedSelections.length = 0;
    unusedSelections.length = 0;
    console.log("selecting a clip for " + operatorNames[i]);
    for (let j = 0; j < OPERATORS.length; j++) {
      if (operatorNames[i] == OPERATORS[j].name) {
        selections = OPERATORS[j].clips;
      }
    }
    console.log("Possible clips:");
    selections.map(function (c) {
      console.log(c.comment);
    });
    if (selections.length == 0) {
      console.log(
        "Error: The operator " + operatorNames[i] + "has no illustrating clips."
      );
    } else {
      // Any clips that have been used before are moved to the
      // end of the list.
      for (let j = 0; j < selections.length; j++) {
        if (isMember(selections[j].comment, CLIPS_USED)) {
          usedSelections.push(selections[j]);
        } else {
          unusedSelections.push(selections[j]);
        }
      }
      selections = unusedSelections.concat(usedSelections);
      console.log("Ordered clips:");
      selections.map(function (c) {
        console.log(c.comment);
      });
      // The first clip on the list is added to the results.
      clips.push(selections[0]);
      CLIPS_USED.push(selections[0].comment);
    }
  }
  return clips;
}

// Play each of the clips in the sequence.
async function process(clips) {
  for (let item of clips) {
    if (parseTime(item.start) > parseTime(item.end)) {
      throw "negative duration!";
    }
    vid.pause(); // Pause the video before switching the source.
    if (item.src === undefined) {
      console.log("The clip " + item.name + " has no src.");
    } else {
      vid.src = item.src;
      vid.play();
    }
    if (item.caption === undefined) {
      caption.textContent = "";
    } else {
      caption.textContent = item.caption;
    }
    vid.currentTime = parseTime(item.start);
    await passed(parseTime(item.end));
  }
  vid.pause();
  caption.textContent = "THE END";
}

// Keep track of the time passed to see if the
// length of the clip has been played.
async function passed(time) {
  //Promises are a bit advanced, but they're very useful when
  //working with asynchronous media
  return new Promise(function (resolve) {
    vid.addEventListener("timeupdate", function () {
      if (vid.currentTime > time) {
        resolve();
      }
    });
  });
}

// Parse the numbers in a clip into
// one number (representing the number
// of seconds into the video source).
function parseTime(time) {
  if (typeof time === "number") {
    return time;
  } else if (typeof time === "string") {
    var a = time.split(":"); // split it at the colons
    if (a.length === 2) {
      a = ("00:" + time).split(":");
    }
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    return seconds;
  }
  throw "invalid or unknown time";
}
