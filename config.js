const staticRules = [
  {
    type: "TP",
    triggerPercentage: 1,
    amountPercentage: 100,
  },
  {
    type: "TP",
    triggerPercentage: 2,
    amountPercentage: 100,
  },
  {
    type: "TP",
    triggerPercentage: 3,
    amountPercentage: 100,
  },
  {
    type: "TP",
    triggerPercentage: 4,
    amountPercentage: 100,
  },
  {
    type: "SL",
    triggerPercentage: 0.9,
    amountPercentage: 100,
  },
  // ...other rules...
];

const timer = 10; // seconds

module.exports = { staticRules, timer };
