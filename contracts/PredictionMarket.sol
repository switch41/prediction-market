// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract PredictionMarket {
    enum PredictionStatus { Active, Resolved }
    
    struct Prediction {
        address creator;
        string description;
        uint256 endTime;
        PredictionStatus status;
        bool outcome;
        uint256 totalYes;
        uint256 totalNo;
        mapping(address => uint256) yesBets;
        mapping(address => uint256) noBets;
    }

    Prediction[] public predictions;
    address public owner;
    
    event PredictionCreated(uint256 id, string description);
    event BetPlaced(uint256 id, address indexed better, bool outcome, uint256 amount);
    event PredictionResolved(uint256 id, bool outcome);

    constructor() public {
        owner = msg.sender;
    }

    function createPrediction(string memory _description, uint256 _duration) public {
        require(bytes(_description).length > 0, "Empty description");
        require(_duration > 3600, "Duration too short");
        
        predictions.push(Prediction({
            creator: msg.sender,
            description: _description,
            endTime: now + _duration,
            status: PredictionStatus.Active,
            outcome: false,
            totalYes: 0,
            totalNo: 0
        }));
        emit PredictionCreated(predictions.length - 1, _description);
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
        emit BetPlaced(_id, msg.sender, _outcome, msg.value);
    }

    function resolvePrediction(uint256 _id, bool _outcome) public {
        require(msg.sender == owner, "Only owner can resolve");
        Prediction storage p = predictions[_id];
        require(p.status == PredictionStatus.Active, "Already resolved");
        require(now >= p.endTime, "Too early to resolve");
        
        p.status = PredictionStatus.Resolved;
        p.outcome = _outcome;
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
        
        msg.sender.transfer(amount);
    }

    function getPredictionsCount() public view returns(uint256) {
        return predictions.length;
    }
}