// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./DeFiRPGXP.sol";
import "./DeFiRPGNFT.sol";

/**
 * @title DeFiRPGQuests
 * @dev Contract for managing quests and group challenges
 */
contract DeFiRPGQuests is Ownable, ReentrancyGuard {
    
    DeFiRPGXP public xpContract;
    DeFiRPGNFT public nftContract;
    
    struct Quest {
        uint256 id;
        string title;
        string description;
        uint256 questType; // 0 = individual, 1 = group
        uint256 deadline;
        uint256 xpReward;
        string nftReward; // NFT metadata URI
        bool active;
        uint256 requiredAction; // 0 = swap, 1 = liquidity, 2 = stake, 3 = bridge
        uint256 requiredAmount;
    }
    
    struct QuestProgress {
        uint256 questId;
        address player;
        uint256 progress;
        bool completed;
        uint256 completedAt;
    }
    
    mapping(uint256 => Quest) public quests;
    mapping(uint256 => address[]) public questParticipants;
    mapping(uint256 => mapping(address => QuestProgress)) public questProgress;
    mapping(address => uint256[]) public playerQuests;
    
    uint256 public questCounter;
    
    // Events
    event QuestCreated(
        uint256 indexed questId,
        string title,
        uint256 questType,
        uint256 deadline,
        uint256 xpReward
    );
    
    event QuestJoined(uint256 indexed questId, address indexed player);
    event QuestCompleted(uint256 indexed questId, address indexed player);
    event QuestProgressUpdated(
        uint256 indexed questId, 
        address indexed player, 
        uint256 progress
    );
    
    constructor(address _xpContract, address _nftContract) {
        xpContract = DeFiRPGXP(_xpContract);
        nftContract = DeFiRPGNFT(_nftContract);
    }
    
    /**
     * @dev Create a new quest
     */
    function createQuest(
        string memory title,
        string memory description,
        uint256 questType,
        uint256 duration, // in seconds
        uint256 xpReward,
        string memory nftReward,
        uint256 requiredAction,
        uint256 requiredAmount
    ) external onlyOwner returns (uint256) {
        uint256 questId = questCounter++;
        
        quests[questId] = Quest({
            id: questId,
            title: title,
            description: description,
            questType: questType,
            deadline: block.timestamp + duration,
            xpReward: xpReward,
            nftReward: nftReward,
            active: true,
            requiredAction: requiredAction,
            requiredAmount: requiredAmount
        });
        
        emit QuestCreated(questId, title, questType, block.timestamp + duration, xpReward);
        
        return questId;
    }
    
    /**
     * @dev Join a quest
     */
    function joinQuest(uint256 questId) external {
        require(quests[questId].active, "Quest not active");
        require(block.timestamp < quests[questId].deadline, "Quest expired");
        require(
            questProgress[questId][msg.sender].questId == 0, 
            "Already joined quest"
        );
        
        questParticipants[questId].push(msg.sender);
        playerQuests[msg.sender].push(questId);
        
        questProgress[questId][msg.sender] = QuestProgress({
            questId: questId,
            player: msg.sender,
            progress: 0,
            completed: false,
            completedAt: 0
        });
        
        emit QuestJoined(questId, msg.sender);
    }
    
    /**
     * @dev Update quest progress
     */
    function updateQuestProgress(
        uint256 questId,
        address player,
        uint256 actionType,
        uint256 amount
    ) external onlyOwner {
        require(quests[questId].active, "Quest not active");
        require(block.timestamp < quests[questId].deadline, "Quest expired");
        require(
            questProgress[questId][player].questId != 0,
            "Player not in quest"
        );
        require(!questProgress[questId][player].completed, "Quest already completed");
        
        Quest memory quest = quests[questId];
        
        // Check if action matches quest requirement
        if (actionType == quest.requiredAction) {
            questProgress[questId][player].progress += amount;
            
            emit QuestProgressUpdated(questId, player, questProgress[questId][player].progress);
            
            // Check if quest is completed
            if (questProgress[questId][player].progress >= quest.requiredAmount) {
                _completeQuest(questId, player);
            }
        }
    }
    
    /**
     * @dev Complete a quest for a player
     */
    function _completeQuest(uint256 questId, address player) internal {
        questProgress[questId][player].completed = true;
        questProgress[questId][player].completedAt = block.timestamp;
        
        Quest memory quest = quests[questId];
        
        // Award XP
        if (quest.xpReward > 0) {
            xpContract.awardXP(player, quest.xpReward, quest.title);
        }
        
        // Award NFT if specified
        if (bytes(quest.nftReward).length > 0) {
            nftContract.mintAchievement(
                player,
                quest.title,
                quest.description,
                "quest",
                quest.xpReward,
                quest.nftReward
            );
        }
        
        emit QuestCompleted(questId, player);
    }
    
    /**
     * @dev Get quest participants
     */
    function getQuestParticipants(uint256 questId) 
        external 
        view 
        returns (address[] memory) 
    {
        return questParticipants[questId];
    }
    
    /**
     * @dev Get player's quests
     */
    function getPlayerQuests(address player) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return playerQuests[player];
    }
    
    /**
     * @dev Get quest details
     */
    function getQuest(uint256 questId) 
        external 
        view 
        returns (Quest memory) 
    {
        return quests[questId];
    }
    
    /**
     * @dev Get quest progress for a player
     */
    function getQuestProgress(uint256 questId, address player) 
        external 
        view 
        returns (QuestProgress memory) 
    {
        return questProgress[questId][player];
    }
    
    /**
     * @dev Deactivate expired quests
     */
    function deactivateExpiredQuests(uint256[] calldata questIds) 
        external 
        onlyOwner 
    {
        for (uint256 i = 0; i < questIds.length; i++) {
            if (block.timestamp >= quests[questIds[i]].deadline) {
                quests[questIds[i]].active = false;
            }
        }
    }
}