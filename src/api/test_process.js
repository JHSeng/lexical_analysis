export {process};
function process () {
  return {
    treeArray: [
      {
        id: 0,
        expression: "a",
        left_id: -1,
        right_id: -1,
        NFA: {
          alphabet: ["a"],

          kTransitionTable: [
            [ [1] ],
            [ [] ]
          ],

          kAcceptTable: [
            {state: 1}
          ]
        }
      },
      {
        id: 1,
        expression: "b",
        left_id: -1,
        right_id: -1,
        NFA: {
          alphabet: ["b"],

          kTransitionTable: [
            [ [1] ],
            [ [] ]

          ],

          kAcceptTable: [
            {state: 1}
          ]
        }
      },
      {
        id: 2,
        expression: "a",
        left_id: -1,
        right_id: -1,
        NFA: {
          alphabet: ["a"],

          kTransitionTable: [
            [ [1] ],
            [ [] ]

          ],

          kAcceptTable: [
            {state: 1}

          ]
        }
      },
      {
        id: 3,
        expression: "b",
        left_id: -1,
        right_id: -1,
        NFA: {
          alphabet: ["b"],
          kTransitionTable: [
            [ [1] ],
            [ [] ]

          ],

          kAcceptTable: [
            {state: 1}
          ]
        }
      },
      {
        id: 4,
        expression: "c",
        left_id: -1,
        right_id: -1,
        NFA: {
          alphabet: ["c"],
          kTransitionTable: [
            [ [1] ],
            [ [] ]

          ],

          kAcceptTable: [
            {state: 1}
          ]
        }
      },
      {
        id: 5,
        expression: "ab",
        left_id: 0,
        right_id: 1,
        NFA: {
          alphabet: ["a", "b", "ε"],

          kTransitionTable: [
            [ [1], [], [] ],
            [ [], [], [2] ],
            [ [], [3], [] ],
            [ [], [], [] ]
          ],

          kAcceptTable: [
            {state: 3}
          ]
        }
      },
      {
        id: 6,
        expression: "(ab)",
        left_id: 2,
        right_id: 3,
        NFA: {
          alphabet: ["a", "b", "ε"],

          kTransitionTable: [
            [ [1], [], [] ],
            [ [], [], [2] ],
            [ [], [3], [] ],
            [ [], [], [] ]
          ],

          kAcceptTable: [
            {state: 3}
          ]
        }
      },
      {
        id: 7,
        expression: "ab(ab)",
        left_id: 5,
        right_id: 6,
        NFA: {
          alphabet: ["a", "b", "ε"],

          kTransitionTable: [
            [ [1], [], [] ],
            [ [], [], [2] ],
            [ [], [3], [] ],
            [ [], [], [4] ],
            [ [5], [], [] ],
            [ [], [], [6] ],
            [ [], [7], [] ],
            [ [], [], [] ]
          ],

          kAcceptTable: [
            {state: 7}
          ]
        }
      },
      {
        id: 8,
        expression: "c*",
        left_id: 4,
        right_id: -1,
        NFA: {
          alphabet: ["c", "ε"],

          kTransitionTable: [
            [ [], [1, 3] ],
            [ [2], [] ],
            [ [], [3, 1] ],
            [ [], [] ]
          ],

          kAcceptTable: [
            {state: 3}
          ]
        }
      },
      {
        id: 9,
        expression: "ab(ab)c*",
        left_id: 7,
        right_id: 8,
        NFA: {
          alphabet: ["a", "b", "c", "ε"],

          kTransitionTable: [
            [ [1], [], [], [] ],
            [ [], [], [], [2] ],
            [ [], [3], [], [] ],
            [ [], [], [], [4] ],
            [ [5], [], [], [] ],
            [ [], [], [], [6] ],
            [ [], [7], [], [] ],
            [ [], [], [], [8] ],
            [ [], [], [], [9, 11] ],
            [ [], [], [10], [] ],
            [ [], [], [], [11, 9] ],
            [ [], [], [], [] ]
          ],

          kAcceptTable: [
            {state: 11}
          ]
        }
      }]
  };
}
