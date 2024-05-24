import { ActivePlayers } from 'boardgame.io/core';
import { set } from 'lodash';

// Define your list of questions
const questions = {
  category1: [
    'Question 1 for category 1',
    'Question 2 for category 1',
  ],
  category2: [
    'Question 1 for category 2',
    'Question 2 for category 2',
  ],
  category3: [
    'Question 1 for category 3',
    'Question 2 for category 3',
  ],
};

function resetBuzzers(G) {
  G.queue = {};
}

function resetBuzzer(G, ctx, id) {
  const newQueue = { ...G.queue };
  delete newQueue[id];
  G.queue = newQueue;
  console.log(`Player ${id} has been reset`);
}

function toggleLock(G) {
  G.locked = !G.locked;
}

function buzz(G, ctx, id) {
  const newQueue = {
    ...G.queue,
  };
  if (!newQueue[id]) {
    newQueue[id] = { id, timestamp: new Date().getTime() };
  }
  G.queue = newQueue;
}

function startRound(G, ctx) {
  console.log('Starting round with category:', G.category);
  if (!G.category) {
    throw new Error('A category must be chosen before starting a round');
  }
  setQuestion(G, ctx);
}

function setQuestion(G, ctx) {
  console.log('Setting question for category:', G.category);
  const categoryQuestions = questions[G.category];
  console.log('Questions available:', categoryQuestions);

  if (categoryQuestions && categoryQuestions.length > 0) {
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    const question = categoryQuestions[randomIndex];
    G.question = question;
    console.log(`Question set to: ${question}`);
  } else {
    console.log('No questions available for the selected category.');
  }
}

function setCategory(G, ctx, category) {
  console.log('Setting category to:', category);
  if (!G.category) {
    G.category = category;
    setQuestion(G, ctx);
    console.log(`Category set to: ${category}`);
  } else {
    console.log(`Category already set to: ${G.category}`);
  }
}

export const Buzzer = {
  name: 'buzzer',
  minPlayers: 2,
  maxPlayers: 200,
  setup: (ctx, setupData = {}) => {
    console.log('Setup data:', setupData);
    return {
      queue: {},
      locked: false,
      question: null,
      category: setupData.category || null,
    };
  },
  phases: {
    pregame: {
      start: true,
      onBegin: (G, ctx) => {
        console.log('Pregame phase started');
        setQuestion(G, ctx);
      },
      moves: { setCategory },
      next: 'play',
    },
    play: {
      moves: {
        buzz,
        toggleLock,
        resetBuzzer,
        resetBuzzers,
        setQuestion, // Ensure setQuestion is available during play phase
      },
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
    },
  },
};

