# Kings' Counsel
![Kings' Counsel](./kingscounsel.jpeg)  
Written by Victa for the NAVH 2023 hackathon  
Going for the IYKYK Linea edition bounty.

## The deets
Kings Counsel is a multiplayer chess game that allows players to join a game of chess and vote for the next moves.


I deployed the two smart contracts and verified them. FKCController manages the game and FKCGame is the game state and game NFT that's minted once a game completes.


FKCController
https://lineascan.build/address/0x981d90e7b2144C55921A7B68A8aC85C655FfCD0a

FKCGame
https://lineascan.build/address/0x18291EB81DC1028F9797aaF7ca9225564d151fF2


## The Plan
I am building a social chess game called Kings' Counsel (same idea as Twitch Plays Pokemon). This game runs on two blockchains (polygon for black and linea for white). Each user must own FKC tokens to be able to play; and for the first 3 months we give away 1,000 tokens per $1 ETH or for free if you sign up with social login (web3auth, google).

Users choose black or white side (Linea for white because white has the advantage). Each move costs 1 FKC token and you are collaborating to win rather than playing outright. Users submit their move 'vote' and the play with the most votes is made. Users have 10 minutes to discuss among themselves before they vote. Winners split the pot.

When the game is complete, I generate an NFT that represents the entire game state (including the final board state represented as base64 image embedded on-chain). This NFT is auctioned off (ETH) and proceeds will go towards a DAO. At the end of the 3 month period a DeFi pool is created; FKC -> ETH using the collected proceeds in the DAO and the fees collected for users registering.

The game runs autonomously and users can browse, view and join any game that's currently running. I will create a few bots on the black and white side to play the game; and reward players with 1000 bonus FKC token for the first 3 months.

I was planning to integrate
- LINEA
- Truffle / Metamask
- Gelato Web3 (functions and their gasless solution)
- Push (for push notifications when its your turn)

## The actuals
URL: https://kingscounsel.netlify.app/ (I am having issues deploying it)

Targeting chess enthusiasts by rewarding them tokens when they win the game. A bit of fun where users can collaborate to battle. 

The tech used include:
- Linea blockchain
- Truffle
- React / Redux / React Hooks / Netlify
- Tailwind
- Solidity + Open Zeppelin
- AWS Serverless Lambda and Schedules
- Mythril for smart contract audit
- Web3 Auth for social logins

Proposed:
- Gelato for gasless meta transactions
- Push for notifications
