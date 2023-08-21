import { Colors, Figures, Nft } from "./types";

const sampleMoves = [
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          4,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-knight-2-8",
          "name": Figures.KNIGHT,
          "x": 2,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          3,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-knight-2-1",
          "name": Figures.KNIGHT,
          "x": 2,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          3,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-pawn-5-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 5,
          "color": Colors.BLACK
      },
      "move": [
          5,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 4,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          5,
          5
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-5-7",
          "name": Figures.PAWN,
          "y": 5,
          "x": 5,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-pawn-4-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 4,
          "color": Colors.BLACK
      },
      "move": [
          4,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 5,
          "x": 5,
          "color": Colors.WHITE
      },
      "move": [
          4,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-knight-7-8",
          "name": Figures.KNIGHT,
          "x": 7,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          6,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-knight-7-1",
          "name": Figures.KNIGHT,
          "x": 7,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          6,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-pawn-3-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 3,
          "color": Colors.BLACK
      },
      "move": [
          4,
          6
      ],
      "capture": true,
      "captured": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 6,
          "x": 4,
          "color": Colors.WHITE
      }
  },
  {
      "piece": {
          "id": "white-bishop-3-1",
          "name": Figures.BISHOP,
          "x": 3,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          6,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-bishop-3-8",
          "name": Figures.BISHOP,
          "x": 3,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          5,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-5-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 5,
          "color": Colors.WHITE
      },
      "move": [
          5,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-pawn-3-7",
          "name": Figures.PAWN,
          "y": 6,
          "x": 4,
          "color": Colors.BLACK
      },
      "move": [
          4,
          5
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-4-7",
          "name": Figures.PAWN,
          "y": 5,
          "x": 4,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "white-pawn-5-2",
          "name": Figures.PAWN,
          "y": 4,
          "x": 5,
          "color": Colors.WHITE
      },
      "move": [
          4,
          5
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-3-7",
          "name": Figures.PAWN,
          "y": 5,
          "x": 4,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-bishop-6-8",
          "name": Figures.BISHOP,
          "x": 6,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          3,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-5-2",
          "name": Figures.PAWN,
          "y": 5,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          3,
          6
      ],
      "capture": true,
      "captured": {
          "id": "black-knight-2-8",
          "name": Figures.KNIGHT,
          "x": 3,
          "y": 6,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-king-5-8",
          "name": Figures.KING,
          "x": 5,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          7,
          8
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-5-2",
          "name": Figures.PAWN,
          "y": 6,
          "x": 3,
          "color": Colors.WHITE
      },
      "move": [
          2,
          7
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-2-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 2,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-knight-7-8",
          "name": Figures.KNIGHT,
          "x": 6,
          "y": 6,
          "color": Colors.BLACK
      },
      "move": [
          4,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-5-2",
          "name": Figures.PAWN,
          "y": 7,
          "x": 2,
          "color": Colors.WHITE
      },
      "move": [
          1,
          8
      ],
      "capture": true,
      "captured": {
          "id": "black-rook-1-8",
          "name": Figures.ROOK,
          "x": 1,
          "y": 8,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-queen-4-8",
          "name": Figures.QUEEN,
          "x": 4,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          1,
          8
      ],
      "capture": true,
      "captured": {
          "id": "white-pawn-5-2",
          "name": Figures.QUEEN,
          "y": 8,
          "x": 1,
          "color": Colors.WHITE
      }
  },
  {
      "piece": {
          "id": "white-knight-2-1",
          "name": Figures.KNIGHT,
          "x": 3,
          "y": 3,
          "color": Colors.WHITE
      },
      "move": [
          4,
          5
      ],
      "capture": true,
      "captured": {
          "id": "black-knight-7-8",
          "name": Figures.KNIGHT,
          "x": 4,
          "y": 5,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-queen-4-8",
          "name": Figures.QUEEN,
          "x": 1,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          3,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-3-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 3,
          "color": Colors.WHITE
      },
      "move": [
          3,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-bishop-3-8",
          "name": Figures.BISHOP,
          "x": 5,
          "y": 6,
          "color": Colors.BLACK
      },
      "move": [
          4,
          5
      ],
      "capture": true,
      "captured": {
          "id": "white-knight-2-1",
          "name": Figures.KNIGHT,
          "x": 4,
          "y": 5,
          "color": Colors.WHITE
      }
  },
  {
      "piece": {
          "id": "white-pawn-3-2",
          "name": Figures.PAWN,
          "y": 4,
          "x": 3,
          "color": Colors.WHITE
      },
      "move": [
          4,
          5
      ],
      "capture": true,
      "captured": {
          "id": "black-bishop-3-8",
          "name": Figures.BISHOP,
          "x": 4,
          "y": 5,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-pawn-6-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 6,
          "color": Colors.BLACK
      },
      "move": [
          6,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-3-2",
          "name": Figures.PAWN,
          "y": 5,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          3,
          6
      ],
      "capture": true,
      "captured": {
          "id": "black-queen-4-8",
          "name": Figures.QUEEN,
          "x": 3,
          "y": 6,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-bishop-6-8",
          "name": Figures.BISHOP,
          "x": 3,
          "y": 5,
          "color": Colors.BLACK
      },
      "move": [
          4,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-bishop-6-1",
          "name": Figures.BISHOP,
          "x": 6,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          3,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-king-5-8",
          "name": Figures.KING,
          "x": 7,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          8,
          8
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-queen-4-1",
          "name": Figures.QUEEN,
          "x": 4,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          4,
          6
      ],
      "capture": true,
      "captured": {
          "id": "black-bishop-6-8",
          "name": Figures.BISHOP,
          "x": 4,
          "y": 6,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-rook-8-8",
          "name": Figures.ROOK,
          "x": 6,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          5,
          8
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-king-5-1",
          "name": Figures.KING,
          "x": 5,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          6,
          1
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-rook-8-8",
          "name": Figures.ROOK,
          "x": 5,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          5,
          7
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-queen-4-1",
          "name": Figures.QUEEN,
          "x": 4,
          "y": 6,
          "color": Colors.WHITE
      },
      "move": [
          5,
          7
      ],
      "capture": true,
      "captured": {
          "id": "black-rook-8-8",
          "name": Figures.ROOK,
          "x": 5,
          "y": 7,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-pawn-1-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 1,
          "color": Colors.BLACK
      },
      "move": [
          1,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-queen-4-1",
          "name": Figures.QUEEN,
          "x": 5,
          "y": 7,
          "color": Colors.WHITE
      },
      "move": [
          5,
          8
      ],
      "capture": false
  }
]

const finalBoard = {
  "black-king-5-8": {
      "id": "black-king-5-8",
      "name": Figures.KING,
      "x": 8,
      "y": 8,
      "color": Colors.BLACK
  },
  "black-pawn-1-7": {
      "id": "black-pawn-1-7",
      "name": Figures.PAWN,
      "y": 6,
      "x": 1,
      "color": Colors.BLACK
  },
  "black-pawn-6-7": {
      "id": "black-pawn-6-7",
      "name": Figures.PAWN,
      "y": 6,
      "x": 6,
      "color": Colors.BLACK
  },
  "black-pawn-7-7": {
      "id": "black-pawn-7-7",
      "name": Figures.PAWN,
      "y": 7,
      "x": 7,
      "color": Colors.BLACK
  },
  "black-pawn-8-7": {
      "id": "black-pawn-8-7",
      "name": Figures.PAWN,
      "y": 7,
      "x": 8,
      "color": Colors.BLACK
  },
  "white-rook-1-1": {
      "id": "white-rook-1-1",
      "name": Figures.ROOK,
      "x": 1,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-bishop-3-1": {
      "id": "white-bishop-3-1",
      "name": Figures.BISHOP,
      "x": 6,
      "y": 4,
      "color": Colors.WHITE
  },
  "white-queen-4-1": {
      "id": "white-queen-4-1",
      "name": Figures.QUEEN,
      "x": 5,
      "y": 8,
      "color": Colors.WHITE
  },
  "white-king-5-1": {
      "id": "white-king-5-1",
      "name": Figures.KING,
      "x": 6,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-bishop-6-1": {
      "id": "white-bishop-6-1",
      "name": Figures.BISHOP,
      "x": 3,
      "y": 4,
      "color": Colors.WHITE
  },
  "white-knight-7-1": {
      "id": "white-knight-7-1",
      "name": Figures.KNIGHT,
      "x": 6,
      "y": 3,
      "color": Colors.WHITE
  },
  "white-rook-8-1": {
      "id": "white-rook-8-1",
      "name": Figures.ROOK,
      "x": 8,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-pawn-1-2": {
      "id": "white-pawn-1-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 1,
      "color": Colors.WHITE
  },
  "white-pawn-2-2": {
      "id": "white-pawn-2-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 2,
      "color": Colors.WHITE
  },
  "white-pawn-3-2": {
      "id": "white-pawn-3-2",
      "name": Figures.PAWN,
      "y": 6,
      "x": 3,
      "color": Colors.WHITE
  },
  "white-pawn-6-2": {
      "id": "white-pawn-6-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 6,
      "color": Colors.WHITE
  },
  "white-pawn-7-2": {
      "id": "white-pawn-7-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 7,
      "color": Colors.WHITE
  },
  "white-pawn-8-2": {
      "id": "white-pawn-8-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 8,
      "color": Colors.WHITE
  }
}

const sampleMoves2 = [
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          4,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-knight-2-8",
          "name": Figures.KNIGHT,
          "x": 2,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          3,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 4,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          4,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-knight-7-8",
          "name": Figures.KNIGHT,
          "x": 7,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          6,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 5,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          3,
          6
      ],
      "capture": true,
      "captured": {
          "id": "black-knight-2-8",
          "name": Figures.KNIGHT,
          "x": 3,
          "y": 6,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-pawn-4-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 4,
          "color": Colors.BLACK
      },
      "move": [
          4,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 6,
          "x": 3,
          "color": Colors.WHITE
      },
      "move": [
          2,
          7
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-2-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 2,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-bishop-3-8",
          "name": Figures.BISHOP,
          "x": 3,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          2,
          7
      ],
      "capture": true,
      "captured": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 7,
          "x": 2,
          "color": Colors.WHITE
      }
  },
  {
      "piece": {
          "id": "white-knight-7-1",
          "name": Figures.KNIGHT,
          "x": 7,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          6,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-pawn-5-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 5,
          "color": Colors.BLACK
      },
      "move": [
          5,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-knight-7-1",
          "name": Figures.KNIGHT,
          "x": 6,
          "y": 3,
          "color": Colors.WHITE
      },
      "move": [
          5,
          5
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-5-7",
          "name": Figures.PAWN,
          "y": 5,
          "x": 5,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-bishop-6-8",
          "name": Figures.BISHOP,
          "x": 6,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          3,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-6-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 6,
          "color": Colors.WHITE
      },
      "move": [
          6,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-king-5-8",
          "name": Figures.KING,
          "x": 5,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          7,
          8
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-knight-2-1",
          "name": Figures.KNIGHT,
          "x": 2,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          4,
          2
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-queen-4-8",
          "name": Figures.QUEEN,
          "x": 4,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          4,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-knight-7-1",
          "name": Figures.KNIGHT,
          "x": 5,
          "y": 5,
          "color": Colors.WHITE
      },
      "move": [
          4,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-pawn-3-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 3,
          "color": Colors.BLACK
      },
      "move": [
          3,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-3-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 3,
          "color": Colors.WHITE
      },
      "move": [
          3,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-knight-7-8",
          "name": Figures.KNIGHT,
          "x": 6,
          "y": 6,
          "color": Colors.BLACK
      },
      "move": [
          5,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-6-2",
          "name": Figures.PAWN,
          "y": 3,
          "x": 6,
          "color": Colors.WHITE
      },
      "move": [
          5,
          4
      ],
      "capture": true,
      "captured": {
          "id": "black-knight-7-8",
          "name": Figures.KNIGHT,
          "x": 5,
          "y": 4,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-pawn-6-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 6,
          "color": Colors.BLACK
      },
      "move": [
          6,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-6-2",
          "name": Figures.PAWN,
          "y": 4,
          "x": 5,
          "color": Colors.WHITE
      },
      "move": [
          4,
          5
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-4-7",
          "name": Figures.PAWN,
          "y": 5,
          "x": 4,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-rook-1-8",
          "name": Figures.ROOK,
          "x": 1,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          5,
          8
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-knight-7-1",
          "name": Figures.KNIGHT,
          "x": 4,
          "y": 3,
          "color": Colors.WHITE
      },
      "move": [
          3,
          5
      ],
      "capture": true,
      "captured": {
          "id": "black-bishop-6-8",
          "name": Figures.BISHOP,
          "x": 3,
          "y": 5,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-queen-4-8",
          "name": Figures.QUEEN,
          "x": 4,
          "y": 6,
          "color": Colors.BLACK
      },
      "move": [
          3,
          5
      ],
      "capture": true,
      "captured": {
          "id": "white-knight-7-1",
          "name": Figures.KNIGHT,
          "x": 3,
          "y": 5,
          "color": Colors.WHITE
      }
  },
  {
      "piece": {
          "id": "white-pawn-6-2",
          "name": Figures.PAWN,
          "y": 5,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          3,
          6
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-3-7",
          "name": Figures.PAWN,
          "y": 6,
          "x": 3,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-queen-4-8",
          "name": Figures.QUEEN,
          "x": 3,
          "y": 5,
          "color": Colors.BLACK
      },
      "move": [
          3,
          6
      ],
      "capture": true,
      "captured": {
          "id": "white-pawn-6-2",
          "name": Figures.PAWN,
          "y": 6,
          "x": 3,
          "color": Colors.WHITE
      }
  },
  {
      "piece": {
          "id": "white-queen-4-1",
          "name": Figures.QUEEN,
          "x": 4,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          2,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-queen-4-8",
          "name": Figures.QUEEN,
          "x": 3,
          "y": 6,
          "color": Colors.BLACK
      },
      "move": [
          3,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-queen-4-1",
          "name": Figures.QUEEN,
          "x": 2,
          "y": 3,
          "color": Colors.WHITE
      },
      "move": [
          3,
          4
      ],
      "capture": true,
      "captured": {
          "id": "black-queen-4-8",
          "name": Figures.QUEEN,
          "x": 3,
          "y": 4,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-bishop-3-8",
          "name": Figures.BISHOP,
          "x": 2,
          "y": 7,
          "color": Colors.BLACK
      },
      "move": [
          4,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-queen-4-1",
          "name": Figures.QUEEN,
          "x": 3,
          "y": 4,
          "color": Colors.WHITE
      },
      "move": [
          4,
          5
      ],
      "capture": true,
      "captured": {
          "id": "black-bishop-3-8",
          "name": Figures.BISHOP,
          "x": 4,
          "y": 5,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-rook-1-8",
          "name": Figures.ROOK,
          "x": 5,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          5,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-queen-4-1",
          "name": Figures.QUEEN,
          "x": 4,
          "y": 5,
          "color": Colors.WHITE
      },
      "move": [
          5,
          6
      ],
      "capture": true,
      "captured": {
          "id": "black-rook-1-8",
          "name": Figures.ROOK,
          "x": 5,
          "y": 6,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-rook-8-8",
          "name": Figures.ROOK,
          "x": 6,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          6,
          7
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-5-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 5,
          "color": Colors.WHITE
      },
      "move": [
          5,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-pawn-8-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 8,
          "color": Colors.BLACK
      },
      "move": [
          8,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-bishop-6-1",
          "name": Figures.BISHOP,
          "x": 6,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          4,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-pawn-7-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 7,
          "color": Colors.BLACK
      },
      "move": [
          7,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-bishop-6-1",
          "name": Figures.BISHOP,
          "x": 4,
          "y": 3,
          "color": Colors.WHITE
      },
      "move": [
          3,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-pawn-8-7",
          "name": Figures.PAWN,
          "y": 6,
          "x": 8,
          "color": Colors.BLACK
      },
      "move": [
          8,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-queen-4-1",
          "name": Figures.QUEEN,
          "x": 5,
          "y": 6,
          "color": Colors.WHITE
      },
      "move": [
          6,
          7
      ],
      "capture": true,
      "captured": {
          "id": "black-rook-8-8",
          "name": Figures.ROOK,
          "x": 6,
          "y": 7,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-king-5-8",
          "name": Figures.KING,
          "x": 7,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          8,
          8
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-queen-4-1",
          "name": Figures.QUEEN,
          "x": 6,
          "y": 7,
          "color": Colors.WHITE
      },
      "move": [
          7,
          8
      ],
      "capture": false
  }
]

const finalBoard2 = {
  "black-king-5-8": {
      "id": "black-king-5-8",
      "name": Figures.KING,
      "x": 8,
      "y": 8,
      "color": Colors.BLACK
  },
  "black-pawn-1-7": {
      "id": "black-pawn-1-7",
      "name": Figures.PAWN,
      "y": 7,
      "x": 1,
      "color": Colors.BLACK
  },
  "black-pawn-6-7": {
      "id": "black-pawn-6-7",
      "name": Figures.PAWN,
      "y": 6,
      "x": 6,
      "color": Colors.BLACK
  },
  "black-pawn-7-7": {
      "id": "black-pawn-7-7",
      "name": Figures.PAWN,
      "y": 6,
      "x": 7,
      "color": Colors.BLACK
  },
  "black-pawn-8-7": {
      "id": "black-pawn-8-7",
      "name": Figures.PAWN,
      "y": 5,
      "x": 8,
      "color": Colors.BLACK
  },
  "white-rook-1-1": {
      "id": "white-rook-1-1",
      "name": Figures.ROOK,
      "x": 1,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-knight-2-1": {
      "id": "white-knight-2-1",
      "name": Figures.KNIGHT,
      "x": 4,
      "y": 2,
      "color": Colors.WHITE
  },
  "white-bishop-3-1": {
      "id": "white-bishop-3-1",
      "name": Figures.BISHOP,
      "x": 3,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-queen-4-1": {
      "id": "white-queen-4-1",
      "name": Figures.QUEEN,
      "x": 7,
      "y": 8,
      "color": Colors.WHITE
  },
  "white-king-5-1": {
      "id": "white-king-5-1",
      "name": Figures.KING,
      "x": 5,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-bishop-6-1": {
      "id": "white-bishop-6-1",
      "name": Figures.BISHOP,
      "x": 3,
      "y": 4,
      "color": Colors.WHITE
  },
  "white-rook-8-1": {
      "id": "white-rook-8-1",
      "name": Figures.ROOK,
      "x": 8,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-pawn-1-2": {
      "id": "white-pawn-1-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 1,
      "color": Colors.WHITE
  },
  "white-pawn-2-2": {
      "id": "white-pawn-2-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 2,
      "color": Colors.WHITE
  },
  "white-pawn-3-2": {
      "id": "white-pawn-3-2",
      "name": Figures.PAWN,
      "y": 3,
      "x": 3,
      "color": Colors.WHITE
  },
  "white-pawn-5-2": {
      "id": "white-pawn-5-2",
      "name": Figures.PAWN,
      "y": 4,
      "x": 5,
      "color": Colors.WHITE
  },
  "white-pawn-7-2": {
      "id": "white-pawn-7-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 7,
      "color": Colors.WHITE
  },
  "white-pawn-8-2": {
      "id": "white-pawn-8-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 8,
      "color": Colors.WHITE
  }
};

const sampleMoves3 = [
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          4,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-knight-2-8",
          "name": Figures.KNIGHT,
          "x": 2,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          3,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 4,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          4,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-knight-7-8",
          "name": Figures.KNIGHT,
          "x": 7,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          6,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 5,
          "x": 4,
          "color": Colors.WHITE
      },
      "move": [
          3,
          6
      ],
      "capture": true,
      "captured": {
          "id": "black-knight-2-8",
          "name": Figures.KNIGHT,
          "x": 3,
          "y": 6,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-pawn-4-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 4,
          "color": Colors.BLACK
      },
      "move": [
          4,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 6,
          "x": 3,
          "color": Colors.WHITE
      },
      "move": [
          2,
          7
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-2-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 2,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-bishop-3-8",
          "name": Figures.BISHOP,
          "x": 3,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          2,
          7
      ],
      "capture": true,
      "captured": {
          "id": "white-pawn-4-2",
          "name": Figures.PAWN,
          "y": 7,
          "x": 2,
          "color": Colors.WHITE
      }
  },
  {
      "piece": {
          "id": "white-knight-2-1",
          "name": Figures.KNIGHT,
          "x": 2,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          3,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-pawn-5-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 5,
          "color": Colors.BLACK
      },
      "move": [
          5,
          5
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-knight-7-1",
          "name": Figures.KNIGHT,
          "x": 7,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          6,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-bishop-6-8",
          "name": Figures.BISHOP,
          "x": 6,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          2,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-knight-7-1",
          "name": Figures.KNIGHT,
          "x": 6,
          "y": 3,
          "color": Colors.WHITE
      },
      "move": [
          5,
          5
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-5-7",
          "name": Figures.PAWN,
          "y": 5,
          "x": 5,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-king-5-8",
          "name": Figures.KING,
          "x": 5,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          7,
          8
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-knight-7-1",
          "name": Figures.KNIGHT,
          "x": 5,
          "y": 5,
          "color": Colors.WHITE
      },
      "move": [
          6,
          7
      ],
      "capture": true,
      "captured": {
          "id": "black-pawn-6-7",
          "name": Figures.PAWN,
          "y": 7,
          "x": 6,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-rook-8-8",
          "name": Figures.ROOK,
          "x": 6,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          6,
          7
      ],
      "capture": true,
      "captured": {
          "id": "white-knight-7-1",
          "name": Figures.KNIGHT,
          "x": 6,
          "y": 7,
          "color": Colors.WHITE
      }
  },
  {
      "piece": {
          "id": "white-pawn-5-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 5,
          "color": Colors.WHITE
      },
      "move": [
          5,
          4
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-knight-7-8",
          "name": Figures.KNIGHT,
          "x": 6,
          "y": 6,
          "color": Colors.BLACK
      },
      "move": [
          5,
          4
      ],
      "capture": true,
      "captured": {
          "id": "white-pawn-5-2",
          "name": Figures.PAWN,
          "y": 4,
          "x": 5,
          "color": Colors.WHITE
      }
  },
  {
      "piece": {
          "id": "white-bishop-6-1",
          "name": Figures.BISHOP,
          "x": 6,
          "y": 1,
          "color": Colors.WHITE
      },
      "move": [
          4,
          3
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "black-bishop-6-8",
          "name": Figures.BISHOP,
          "x": 2,
          "y": 4,
          "color": Colors.BLACK
      },
      "move": [
          3,
          3
      ],
      "capture": true,
      "captured": {
          "id": "white-knight-2-1",
          "name": Figures.KNIGHT,
          "x": 3,
          "y": 3,
          "color": Colors.WHITE
      }
  },
  {
      "piece": {
          "id": "white-pawn-2-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 2,
          "color": Colors.WHITE
      },
      "move": [
          3,
          3
      ],
      "capture": true,
      "captured": {
          "id": "black-bishop-6-8",
          "name": Figures.BISHOP,
          "x": 3,
          "y": 3,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-queen-4-8",
          "name": Figures.QUEEN,
          "x": 4,
          "y": 8,
          "color": Colors.BLACK
      },
      "move": [
          6,
          6
      ],
      "capture": false
  },
  {
      "piece": {
          "id": "white-bishop-6-1",
          "name": Figures.BISHOP,
          "x": 4,
          "y": 3,
          "color": Colors.WHITE
      },
      "move": [
          5,
          4
      ],
      "capture": true,
      "captured": {
          "id": "black-knight-7-8",
          "name": Figures.KNIGHT,
          "x": 5,
          "y": 4,
          "color": Colors.BLACK
      }
  },
  {
      "piece": {
          "id": "black-queen-4-8",
          "name": Figures.QUEEN,
          "x": 6,
          "y": 6,
          "color": Colors.BLACK
      },
      "move": [
          6,
          2
      ],
      "capture": true,
      "captured": {
          "id": "white-pawn-6-2",
          "name": Figures.PAWN,
          "y": 2,
          "x": 6,
          "color": Colors.WHITE
      }
  }
]

const finalBoard3 = {
  "black-rook-1-8": {
      "id": "black-rook-1-8",
      "name": Figures.ROOK,
      "x": 1,
      "y": 8,
      "color": Colors.BLACK
  },
  "black-bishop-3-8": {
      "id": "black-bishop-3-8",
      "name": Figures.BISHOP,
      "x": 2,
      "y": 7,
      "color": Colors.BLACK
  },
  "black-queen-4-8": {
      "id": "black-queen-4-8",
      "name": Figures.QUEEN,
      "x": 6,
      "y": 2,
      "color": Colors.BLACK
  },
  "black-king-5-8": {
      "id": "black-king-5-8",
      "name": Figures.KING,
      "x": 7,
      "y": 8,
      "color": Colors.BLACK
  },
  "black-rook-8-8": {
      "id": "black-rook-8-8",
      "name": Figures.ROOK,
      "x": 6,
      "y": 7,
      "color": Colors.BLACK
  },
  "black-pawn-1-7": {
      "id": "black-pawn-1-7",
      "name": Figures.PAWN,
      "y": 7,
      "x": 1,
      "color": Colors.BLACK
  },
  "black-pawn-3-7": {
      "id": "black-pawn-3-7",
      "name": Figures.PAWN,
      "y": 7,
      "x": 3,
      "color": Colors.BLACK
  },
  "black-pawn-4-7": {
      "id": "black-pawn-4-7",
      "name": Figures.PAWN,
      "y": 5,
      "x": 4,
      "color": Colors.BLACK
  },
  "black-pawn-7-7": {
      "id": "black-pawn-7-7",
      "name": Figures.PAWN,
      "y": 7,
      "x": 7,
      "color": Colors.BLACK
  },
  "black-pawn-8-7": {
      "id": "black-pawn-8-7",
      "name": Figures.PAWN,
      "y": 7,
      "x": 8,
      "color": Colors.BLACK
  },
  "white-rook-1-1": {
      "id": "white-rook-1-1",
      "name": Figures.ROOK,
      "x": 1,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-bishop-3-1": {
      "id": "white-bishop-3-1",
      "name": Figures.BISHOP,
      "x": 3,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-queen-4-1": {
      "id": "white-queen-4-1",
      "name": Figures.QUEEN,
      "x": 4,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-king-5-1": {
      "id": "white-king-5-1",
      "name": Figures.KING,
      "x": 5,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-bishop-6-1": {
      "id": "white-bishop-6-1",
      "name": Figures.BISHOP,
      "x": 5,
      "y": 4,
      "color": Colors.WHITE
  },
  "white-rook-8-1": {
      "id": "white-rook-8-1",
      "name": Figures.ROOK,
      "x": 8,
      "y": 1,
      "color": Colors.WHITE
  },
  "white-pawn-1-2": {
      "id": "white-pawn-1-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 1,
      "color": Colors.WHITE
  },
  "white-pawn-2-2": {
      "id": "white-pawn-2-2",
      "name": Figures.PAWN,
      "y": 3,
      "x": 3,
      "color": Colors.WHITE
  },
  "white-pawn-3-2": {
      "id": "white-pawn-3-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 3,
      "color": Colors.WHITE
  },
  "white-pawn-7-2": {
      "id": "white-pawn-7-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 7,
      "color": Colors.WHITE
  },
  "white-pawn-8-2": {
      "id": "white-pawn-8-2",
      "name": Figures.PAWN,
      "y": 2,
      "x": 8,
      "color": Colors.WHITE
  }
}

const nfts: Array<Nft> = [
  {
    nftId: 0,
    moves: sampleMoves,
    boardState: finalBoard,
    mintDate: '2023-08-01 12:52pm'
  },
  {
    nftId: 1,
    moves: sampleMoves2,
    boardState: finalBoard2,
    mintDate: '2023-08-02 12:52pm'
  },
  {
    nftId: 2,
    moves: sampleMoves3,
    boardState: finalBoard3,
    mintDate: '2023-08-03 12:52pm'
  }
]

export default nfts;