const staticRules = [
  {
    type: "TP",
    triggerPercentage: 1,
    amountPercentage: 100,
  },
  {
    type: "TP",
    triggerPercentage: 1,
    amountPercentage: 100,
  },
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
    type: "SL",
    triggerPercentage: 30,
    amountPercentage: 50,
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

const timer = 6; // seconds

module.exports = { staticRules, timer };
