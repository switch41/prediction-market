const PredictionMarket = artifacts.require("PredictionMarket");
const { expectRevert, time } = require('@openzeppelin/test-helpers');

contract("PredictionMarket", (accounts) => {
  let pm;
  const [owner, user1, user2] = accounts;
  const initialDeposit = web3.utils.toWei('1', 'ether');
  const testDescription = "ETH price > $3000 by 2024";
  const testDuration = 3600; // 1 hour in seconds

  beforeEach(async () => {
    pm = await PredictionMarket.new({ from: owner });
  });

  describe("Prediction Creation", () => {
    it("should create a new prediction", async () => {
      await pm.createPrediction(testDescription, testDuration, { from: user1 });
      const count = await pm.getPredictionsCount();
      assert.equal(count, 1, "Prediction count mismatch");
    });

    it("should prevent empty description", async () => {
      await expectRevert(
        pm.createPrediction("", testDuration, { from: user1 }),
        "Empty description"
      );
    });

    it("should prevent short durations", async () => {
      await expectRevert(
        pm.createPrediction(testDescription, 3599, { from: user1 }),
        "Duration too short"
      );
    });
  });

  describe("Betting", () => {
    beforeEach(async () => {
      await pm.createPrediction(testDescription, testDuration, { from: owner });
    });

    it("should accept YES bets", async () => {
      await pm.placeBet(0, true, { from: user1, value: initialDeposit });
      const prediction = await pm.predictions(0);
      assert.equal(prediction.totalYes, initialDeposit, "YES total mismatch");
    });

    it("should accept NO bets", async () => {
      await pm.placeBet(0, false, { from: user1, value: initialDeposit });
      const prediction = await pm.predictions(0);
      assert.equal(prediction.totalNo, initialDeposit, "NO total mismatch");
    });

    it("should prevent zero-value bets", async () => {
      await expectRevert(
        pm.placeBet(0, true, { from: user1, value: 0 }),
        "Zero value bet"
      );
    });
  });

  describe("Resolution", () => {
    beforeEach(async () => {
      await pm.createPrediction(testDescription, testDuration, { from: owner });
      await time.increase(testDuration + 1);
    });

    it("should allow owner to resolve", async () => {
      await pm.resolvePrediction(0, true, { from: owner });
      const prediction = await pm.predictions(0);
      assert.equal(prediction.status, 1, "Not resolved");
    });

    it("should prevent non-owners from resolving", async () => {
      await expectRevert(
        pm.resolvePrediction(0, true, { from: user1 }),
        "Ownable: caller is not the owner"
      );
    });

    it("should prevent early resolution", async () => {
      await expectRevert(
        pm.resolvePrediction(0, true, { from: owner }),
        "Too early to resolve"
      );
    });
  });

  describe("Withdrawals", () => {
    beforeEach(async () => {
      await pm.createPrediction(testDescription, testDuration, { from: owner });
      await pm.placeBet(0, true, { from: user1, value: initialDeposit });
      await time.increase(testDuration + 1);
      await pm.resolvePrediction(0, true, { from: owner });
    });

    it("should allow winning withdrawals", async () => {
      const initialBalance = web3.utils.toBN(await web3.eth.getBalance(user1));
      const tx = await pm.withdrawWinnings(0, { from: user1 });
      const gasUsed = web3.utils.toBN(tx.receipt.gasUsed * 1e9);
      const finalBalance = web3.utils.toBN(await web3.eth.getBalance(user1));
      
      assert.isTrue(
        finalBalance.add(gasUsed).sub(initialBalance).eq(web3.utils.toBN(initialDeposit)),
        "Balance mismatch"
      );
    });

    it("should prevent double withdrawals", async () => {
      await pm.withdrawWinnings(0, { from: user1 });
      await expectRevert(
        pm.withdrawWinnings(0, { from: user1 }),
        "No winnings"
      );
    });
  });

  describe("Security", () => {
    it("should prevent reentrancy attacks", async () => {
      // Deploy malicious contract
      const MaliciousBettor = artifacts.require("MaliciousBettor");
      const attacker = await MaliciousBettor.new(pm.address);
      
      // Create and resolve prediction
      await pm.createPrediction(testDescription, testDuration, { from: owner });
      await pm.placeBet(0, true, { 
        from: attacker.address, 
        value: initialDeposit 
      });
      await time.increase(testDuration + 1);
      await pm.resolvePrediction(0, true, { from: owner });

      // Attempt attack
      await expectRevert(
        attacker.attack(0),
        "Reentrant call"
      );
    });
  });
});