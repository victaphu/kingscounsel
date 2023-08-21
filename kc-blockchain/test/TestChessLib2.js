// const FKCController = artifacts.require("FKCController");
// const FKCGame = artifacts.require("FKCGame");  // Assuming you have this mock
// const ChessLib2 = artifacts.require("ChessLib2");  // Assuming you have this mock
// const web3 = require("web3");
// const bn = require("bignumber.js");
// contract("ChessLib2", accounts => {
//     let ChessLib;

//     const owner = accounts[0];
//     const whitePlayer = accounts[1];
//     const blackPlayer = accounts[2];

//     beforeEach(async () => {
//         ChessLib = await ChessLib2.new();
//     });

//     it("bishop - test bishop movement", async () => {
//         console.log('testing!')
//         const moves = [
//             // White move 1 right 1 up
//             ["0x0000000000000000000000000000000000000000000020000000000000000000", "0x4dc", false,
//                 "0x0000000000000000000000000000000000020000000000000000000000000000"],
//             // White move 2 right 2 up
//             ["0x0000000000000000000000000000000000000000000020000000000000000000", "0x4e5", false,
//                 "0x0000000000000000000000000020000000000000000000000000000000000000"],
//             // White move 1 right 1 up, take piece
//             ["0x0000000000000000000000000000000000090000000020000000000000000000", "0x4dc", false,
//                 "0x0000000000000000000000000000000000020000000000000000000000000000"],
//             // White move 2 right 2 up, take piece
//             ["0x0000000000000000000000000090000000000000000020000000000000000000", "0x4e5", false,
//                 "0x0000000000000000000000000020000000000000000000000000000000000000"],
//         ];
//         for (let i = 0; i < moves.length; ++i) {
//             const result = await ChessLib.verifyExecuteMove(moves[i][0], moves[i][1], "0x00", "0x00", moves[i][2]);
//             console.log('processing moves list', result[0].toString());
//             assert.equal((await ChessLib.verifyExecuteMove(moves[i][0], moves[i][1], "0x00", "0x00", moves[i][2]))[0], moves[i][3])
//         }
//     });

//     it("bishop - test invalid movements", async () => {
//         const moves = [
//             // No move
//             ["0x0000000000000000000000000000000000002000000000000000000000000000", "0x6db", false, "inv move stale"],
//             // White same color in-between square
//             ["0x0000000000000000000000000000000000020000000020000000000000000000", "0x4e5", false, "inv move"],
//             // White diff color in-between square
//             ["0x0000000000000000000000000000000000090000000020000000000000000000", "0x4e5", false, "inv move"],
//             // White up
//             ["0x0000000000000000000000000000000000020000000000000000000000000000", "0x724", false, "inv move"],
//             // White down
//             ["0x0000000000000000000000000000000000020000000000000000000000000000", "0x714", false, "inv move"],
//             // White right
//             ["0x0000000000000000000000000000000000020000000000000000000000000000", "0x71d", false, "inv move"],
//             // White left
//             ["0x0000000000000000000000000000000000020000000000000000000000000000", "0x71b", false, "inv move"],
//             // White L move
//             ["0x0000000000000000000000000000000000002000000000000000000000000000", "0x6e5", false, "inv move"],
//         ];
//         for (let i = 0; i < moves.length; ++i) {
//             try {
//                 await ChessLib.verifyExecuteMove(moves[i][0], moves[i][1], "0x00", "0x00", moves[i][2]);
//                 assert.fail("Should fail with error", moves[i][3]);

//             } catch (error) {
//                 assert.include(error.message, moves[i][3]);
//             }
//         }

//     });



//     it("commit moves - test bishop movement", async () => {
//         const moves = [
//             ["0xcbaedabc99999999000000000000000000000000000000001111111143265234", "0x08", "0x10",
//                 "0xcbaedabc99999999000000000000000000000000000000011111111043265234"],

//             ["0xcbaedabc99999999000000000000000000000000000000001111111143265234", "0x01", "0x12",
//                 "0xcbaedabc99999999000000000000000000000000000003001111111143265204"],

//             ["0xcbaedabc99999099000000000000000000000000000009001111111143265234", "0x01", "0x12",
//                 "0xcbaedabc99999099000000000000000000000000000003001111111143265204"],

//             ["0x0baedabc099990990900000000000000c0000000000003001111111143265204", "0x1f", "0x3f",
//                 "0xcbaedabc09999099090000000000000000000000000003001111111143265204"],

//             ["0xcbaedabc09999099090000000000000000000000000003001111111143265204", "0x3f", "0x0f",
//                 "0x0baedabc0999909909000000000000000000000000000300c111111143265204"],

//             ["0x0baedabc0999909909000000000000000000000000000300c111111143265204", "0x3b", "0x20",
//                 "0x0bae0abc09999099090000000000000d0000000000000300c111111143265204"],

//             ["0x0bae0abc09999099090000000000000d0000000000000300c111111143265204", "0x3e", "0x2f",
//                 "0x00ae0abc09999099b90000000000000d0000000000000300c111111143265204"],

//             ["0x00ae0abc09999099b90000000000000d0000000000000300c111111143265204", "0x06", "0x15",
//                 "0x00ae0abc09999099b90000000000000d0000000000300300c111111140265204"],

//             ["0x00ae0abc09999099b90000000000000d0000000000300300c111111140265204", "0x33", "0x23",
//                 "0x00ae0abc09990099b90000000000900d0000000000300300c111111140265204"],

//         ];

//         for (let i = 0; i < moves.length; ++i) {
//             assert.equal(await ChessLib.commitMove(moves[i][0], moves[i][1], moves[i][2]), moves[i][3])
//         }
//     });

//     it("end game - test valid endgame", async () => {
//         const moves = [
//             // ##### Inconclusive Outcomes: Valid moves still available #####
//             // # King check evaded by 1-up
//             ["0x000cec0a0000000000000000000060000000000c000000000000000000000000", "0x000723ff", "0x383f3bff", 0],
//             // # King check evaded by 1-down
//             ["0x000cec0a000000000000000c0000600000000000000000000000000000000000", "0x000723ff", "0x383f3bff", 0],
//             // # King check evaded by 1-right
//             ["0x0000ec0a000000000000000c000060000000000c000000000000000000000000", "0x000723ff", "0x383f3bff", 0],
//             // # King check evaded by 1-left
//             ["0x000ce00a000000000000000c000060000000000c000000000000000000000000", "0x000723ff", "0x383f3bff", 0],

//             // # King check evaded by 1-up 1-left
//             ["0xe00cc00000000000000000000000600c0000000c000000000000000000000000", "0x000723ff", "0x383f3fff", 0],
//             // # King check evaded by 1-up 1-right
//             ["0xe000cc0000000000000000000000600c0000000c000000000000000000000000", "0x000723ff", "0x383f3fff", 0],
//             // # King check evaded by 1-down 1-left
//             ["0xe00cc000000000000000000c0000600c00000000000000000000000000000000", "0x000723ff", "0x383f3fff", 0],
//             // # King check evaded by 1-down 1-right
//             ["0xe000cc00000000000000000c0000600c00000000000000000000000000000000", "0x000723ff", "0x383f3fff", 0],

//             // # King's [White] check blocked by pawn [1-up]
//             ["0x00cec00000000000000000000000000c0006000d0000100c0000000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's [White] check blocked by pawn [2-up]
//             ["0x00cec0000000000000000000c0000000d0060000c00000000100000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's [White] check removed by pawn take [1-up 1-left]
//             ["0x00cec00000000000000000000000000c0006000d0000001c0000000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's [White] check removed by pawn take [1-up 1-right]
//             ["0x00cec0000000000000000000c0000000d0060000c10000000000000000000000", "0x00071cff", "0x383f3cff", 0],

//             // # King's [Black] check blocked by pawn [1-down]
//             ["0x0000000000000000400009000000e00540000000000000000000000000046400", "0x383f23ff", "0x000703ff", 0],
//             // # King's [Black] check blocked by pawn [2-down]
//             ["0x0000000000000900400000000000e00540000000000000000000000000046400", "0x383f23ff", "0x000703ff", 0],
//             // # King's [Black] check removed by pawn take [1-down 1-left]
//             ["0x0000000000000000900000040500e00000000004000000000000000000046400", "0x383f23ff", "0x000703ff", 0],
//             // # King's [Black] check removed by pawn take [1-down 1-right]
//             ["0x0000000000000000400000090000e05040000000000000000000000000046400", "0x383f23ff", "0x000703ff", 0],

//             // # King's check removed by knight [2-right,1-up]
//             ["0x00cec0000000000300000a000000000c000600000000000c0000000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's check removed by knight [1-right,2-up]
//             ["0x00cec0300000000000000a000000000c000600000000000c0000000000000000", "0x00071cff", "0x383f3cff", 0],

//             // # King's check removed by knight [1-left,2-up]
//             ["0x000cec00000000000000000c000060000000000c00a000000000000003000000", "0x000723ff", "0x383f3bff", 0],
//             // # King's check removed by knight [2-left,1-up]
//             ["0x000cec00000000000000000c000060000000000c00a000003000000000000000", "0x000723ff", "0x383f3bff", 0],

//             // # King's check removed by knight [2-left,1-down]
//             ["0x00cec000000000000000000c000600000000000c00000a000000000300000000", "0x000724ff", "0x383f3bff", 0],
//             // # King's check removed by knight [1-left,2-down]
//             ["0x00cec000000000000000000c000600000000000c00000a000000000000000030", "0x000724ff", "0x383f3bff", 0],

//             // # King's check removed by knight [1-right,2-down]
//             ["0x030cec000000000000a000000000000c000060000000000c0000000000000000", "0x00071bff", "0x383f3bff", 0],
//             // # King's check removed by knight [2-right,1-down]
//             ["0x000cec003000000000a000000000000c000060000000000c0000000000000000", "0x00071bff", "0x383f3bff", 0],

//             // # King's check removed by rook [up movement]
//             ["0x00cec0000000000000000a000000000c000600000000000c0000000000000400", "0x00071cff", "0x383f3cff", 0],
//             // # King's check removed by rook [down movement]
//             ["0x00cec4000000000000000a000000000c000600000000000c0000000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's check removed by rook [right movement]
//             ["0x00cec0000000000000000a040000000c000600000000000c0000000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's check removed by rook [left movement]
//             ["0x00cec0000000000040000a000000000c000600000000000c0000000000000000", "0x00071cff", "0x383f3cff", 0],

//             // # King's check removed by bishop [up-right movement]
//             ["0x00cec000000000000000000c000600000000000c00000a000000000000000002", "0x000724ff", "0x383f3cff", 0],
//             // # King's check removed by bishop [up-left movement]
//             ["0x000cec00000000000000000c000060000000000c00a000000000000020000000", "0x000723ff", "0x383f3bff", 0],
//             // # King's check removed by bishop [down-right movement]
//             ["0x00cec0020000000000000a000000000c000600000000000c0000000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's check removed by bishop [down-left movement]
//             ["0x200cec000000000000a000000000000c000060000000000c0000000000000000", "0x00071bff", "0x383f3bff", 0],

//             // # King's check removed by Queen [up movement]
//             ["0x00cec0000000000000000a000000000c000600000000000c0000000000000500", "0x00071cff", "0x383f3cff", 0],
//             // # King's check removed by Queen [down movement]
//             ["0x00cec5000000000000000a000000000c000600000000000c0000000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's check removed by Queen [right movement]
//             ["0x00cec0000000000000000a050000000c000600000000000c0000000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's check removed by Queen [left movement]
//             ["0x00cec0000000000050000a000000000c000600000000000c0000000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's check removed by Queen [up-right movement]
//             ["0x00cec000000000000000000c000600000000000c00000a000000000000000005", "0x000724ff", "0x383f3cff", 0],
//             // # King's check removed by Queen [up-left movement]
//             ["0x000cec00000000000000000c000060000000000c00a000000000000050000000", "0x000723ff", "0x383f3bff", 0],
//             // # King's check removed by Queen [down-right movement]
//             ["0x00cec0050000000000000a000000000c000600000000000c0000000000000000", "0x00071cff", "0x383f3cff", 0],
//             // # King's check removed by Queen [down-left movement]
//             ["0x500cec000000000000a000000000000c000060000000000c0000000000000000", "0x00071bff", "0x383f3bff", 0],

//             // ##### Conclusive Outcomes: No valid moves still available #####
//             // # King's check can't be removed by pawn take [1-up 1-right overflow]
//             ["0x00cec00000000000000000000000000c0006000d1000000c0000000000000000", "0x00071cff", "0x383f3cff", 2],
//         ];

//         for (let i = 0; i < moves.length; ++i) {
//             console.log('how come this worked?', await ChessLib.checkEndgame(moves[i][0], moves[i][1], moves[i][2]));
//             assert.equal(await ChessLib.checkEndgame(moves[i][0], moves[i][1], moves[i][2]), moves[i][3])
//         }

//     });
//     // Add more tests as needed, for example:
//     // - Test for nextPlay()
//     // - Test for renounceOwnership()
//     // - Test for makeNextMove()
//     // - Test for game completion, etc.

//     afterEach(async () => {
//         // Clean up, if necessary
//     });
// });
