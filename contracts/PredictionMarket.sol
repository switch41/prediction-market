// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract PredictionMarket {
    enum PredictionStatus { Active, Resolved }
    enum Category { Politics, Sports, Finance, Technology, Weather, Other }
    
    struct Prediction {
        address creator;
        string description;
        uint256 endTime;
        PredictionStatus status;
        bool outcome;
        uint256 totalYes;
        uint256 totalNo;
        Category category;
        uint256 creationTime;
        uint256 resolutionTime;
        mapping(address => uint256) yesBets;
        mapping(address => uint256) noBets;
    }

    struct UserStats {
        uint256 totalPredictions;
        uint256 correctPredictions;
        uint256 totalBets;
        uint256 totalWinnings;
    }

    Prediction[] public predictions;
    address public owner;
    
    // Mapping to track user statistics
    mapping(address => UserStats) public userStats;
    // Mapping to track category statistics
    mapping(uint8 => uint256) public categoryTotalPredictions;
    mapping(uint8 => uint256) public categoryCorrectPredictions;
    
    event PredictionCreated(uint256 id, string description, Category category);
    event BetPlaced(uint256 id, address indexed better, bool outcome, uint256 amount);
    event PredictionResolved(uint256 id, bool outcome);
    event UserStatsUpdated(address indexed user, uint256 totalPredictions, uint256 correctPredictions);

    constructor() public {
        owner = msg.sender;
    }

    function createPrediction(string memory _description, uint256 _duration, Category _category) public {
        require(bytes(_description).length > 0, "Empty description");
        require(_duration > 3600, "Duration too short");
        
        predictions.push(Prediction({
            creator: msg.sender,
            description: _description,
            endTime: now + _duration,
            status: PredictionStatus.Active,
            outcome: false,
            totalYes: 0,
            totalNo: 0,
            category: _category,
            creationTime: now,
            resolutionTime: 0
        }));

        userStats[msg.sender].totalPredictions++;
        categoryTotalPredictions[uint8(_category)]++;
        
        emit PredictionCreated(predictions.length - 1, _description, _category);
    }

    function placeBet(uint256 _id, bool _outcome) public payable {
        Prediction storage p = predictions[_id];
        require(p.status == PredictionStatus.Active, "Market closed");
        require(msg.value > 0, "Zero value bet");
        
        if(_outcome) {
            p.yesBets[msg.sender] += msg.value;
            p.totalYes += msg.value;
        } else {
            p.noBets[msg.sender] += msg.value;
            p.totalNo += msg.value;
        }
        
        userStats[msg.sender].totalBets++;
        emit BetPlaced(_id, msg.sender, _outcome, msg.value);
    }

    function resolvePrediction(uint256 _id, bool _outcome) public {
        require(msg.sender == owner, "Only owner can resolve");
        Prediction storage p = predictions[_id];
        require(p.status == PredictionStatus.Active, "Already resolved");
        require(now >= p.endTime, "Too early to resolve");
        
        p.status = PredictionStatus.Resolved;
        p.outcome = _outcome;
        p.resolutionTime = now;

        // Update category statistics
        if (_outcome) {
            categoryCorrectPredictions[uint8(p.category)]++;
        }

        emit PredictionResolved(_id, _outcome);
    }

    function withdrawWinnings(uint256 _id) public {
        Prediction storage p = predictions[_id];
        require(p.status == PredictionStatus.Resolved, "Not resolved");

        uint256 amount = p.outcome ? p.yesBets[msg.sender] : p.noBets[msg.sender];
        require(amount > 0, "No winnings");
        
        if(p.outcome) {
            p.yesBets[msg.sender] = 0;
        } else {
            p.noBets[msg.sender] = 0;
        }
        
        userStats[msg.sender].totalWinnings += amount;
        msg.sender.transfer(amount);
    }

    // New functions for insights and analytics

    function getMarketConfidence(uint256 _id) public view returns (uint256) {
        Prediction storage p = predictions[_id];
        require(p.status == PredictionStatus.Active, "Market closed");
        
        uint256 total = p.totalYes + p.totalNo;
        if (total == 0) return 50; // 50% if no bets
        
        return (p.totalYes * 100) / total;
    }

    function getUserAccuracy(address _user) public view returns (uint256) {
        UserStats storage stats = userStats[_user];
        if (stats.totalPredictions == 0) return 0;
        
        return (stats.correctPredictions * 100) / stats.totalPredictions;
    }

    function getCategoryAccuracy(Category _category) public view returns (uint256) {
        uint256 total = categoryTotalPredictions[uint8(_category)];
        if (total == 0) return 0;
        
        return (categoryCorrectPredictions[uint8(_category)] * 100) / total;
    }

    function getPredictionDetails(uint256 _id) public view returns (
        address creator,
        string memory description,
        uint256 endTime,
        PredictionStatus status,
        bool outcome,
        uint256 totalYes,
        uint256 totalNo,
        Category category,
        uint256 creationTime,
        uint256 resolutionTime
    ) {
        Prediction storage p = predictions[_id];
        return (
            p.creator,
            p.description,
            p.endTime,
            p.status,
            p.outcome,
            p.totalYes,
            p.totalNo,
            p.category,
            p.creationTime,
            p.resolutionTime
        );
    }

    function getPredictionsCount() public view returns(uint256) {
        return predictions.length;
    }
}