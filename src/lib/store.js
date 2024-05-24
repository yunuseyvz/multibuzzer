import { ActivePlayers } from 'boardgame.io/core';

// Define your list of questions
const questions = {
  category1: [
    'Question 1 for category 1',
    'Question 2 for category 1',
    // Add more questions for category 1 here
  ],
  category2: [
    'Question 1 for category 2',
    'Question 2 for category 2',
    // Add more questions for category 2 here
  ],
  category3: [
    'Question 1 for category 3',
    'Question 2 for category 3',
    // Add more questions for category 3 here
  ],
};

function resetBuzzers(G) {
  G.queue = {};
}

function resetBuzzer(G, ctx, id) {
  const newQueue = { ...G.queue };
  delete newQueue[id];
  G.queue = newQueue;
}

function toggleLock(G) {
  G.locked = !G.locked;
}

function buzz(G, ctx, id) {
  const newQueue = {
    ...G.queue,
  };
  if (!newQueue[id]) {
    // buzz on server will overwrite the client provided timestamp
    newQueue[id] = { id, timestamp: new Date().getTime() };
  }
  G.queue = newQueue;
}

function startRound(G, ctx) {
  if (!G.category) {
    throw new Error('A category must be chosen before starting a round');
  }

  const categoryQuestions = questions[G.category];
  const question = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];

  G.question = question;
}

function setCategory(G, ctx, category) {
  // Update the category property in the game state
  G.category = category;
}

export const Buzzer = {
  name: 'buzzer',
  minPlayers: 2,
  maxPlayers: 200,
  setup: () => ({
    queue: {},
    locked: false,
    category: null, // The host will set this before the game starts
  }),
  phases: {
    play: {
      start: true,
      moves: { buzz, resetBuzzer, resetBuzzers, toggleLock, startRound, setCategory }, // Add setCategory here
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
    },
  },
};