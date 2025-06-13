// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DeFiRPGXP
 * @dev ERC1155 contract for DeFi RPG XP tokens and class items
 */
contract DeFiRPGXP is ERC1155, Ownable, ReentrancyGuard {
    
    // Token IDs
    uint256 public constant XP_TOKEN = 0;
    uint256 public constant SWAPPER_CLASS = 1;
    uint256 public constant FARMER_CLASS = 2;
    uint256 public constant STAKER_CLASS = 3;
    uint256 public constant BRIDGER_CLASS = 4;
    
    // Player data
    struct Player {
        uint256 level;
        uint256 totalXP;
        uint256 currentClass;
        bool initialized;
    }
    
    mapping(address => Player) public players;
    mapping(address => mapping(uint256 => uint256)) public playerStats; // player => stat type => value
    
    // Stat types
    uint256 public constant STAT_SWAPS = 0;
    uint256 public constant STAT_LIQUIDITY = 1;
    uint256 public constant STAT_STAKING = 2;
    uint256 public constant STAT_BRIDGING = 3;
    
    // Events
    event PlayerInitialized(address indexed player, uint256 class);
    event XPGained(address indexed player, uint256 amount, string action);
    event LevelUp(address indexed player, uint256 newLevel);
    event ClassChanged(address indexed player, uint256 newClass);
    event StatUpdated(address indexed player, uint256 statType, uint256 newValue);
    
    constructor() ERC1155("https://api.defirpg.com/metadata/{id}.json") {}
    
    /**
     * @dev Initialize a new player
     */
    function initializePlayer(address player, uint256 initialClass) 
        external 
        onlyOwner 
    {
        require(!players[player].initialized, "Player already initialized");
        require(initialClass >= 1 && initialClass <= 4, "Invalid class");
        
        players[player] = Player({
            level: 1,
            totalXP: 0,
            currentClass: initialClass,
            initialized: true
        });
        
        // Mint class token
        _mint(player, initialClass, 1, "");
        
        emit PlayerInitialized(player, initialClass);
    }
    
    /**
     * @dev Award XP to a player
     */
    function awardXP(
        address player, 
        uint256 amount, 
        string memory action
    ) external onlyOwner {
        require(players[player].initialized, "Player not initialized");
        
        players[player].totalXP += amount;
        
        // Calculate new level (1000 XP per level)
        uint256 newLevel = (players[player].totalXP / 1000) + 1;
        
        if (newLevel > players[player].level) {
            players[player].level = newLevel;
            emit LevelUp(player, newLevel);
        }
        
        // Mint XP tokens
        _mint(player, XP_TOKEN, amount, "");
        
        emit XPGained(player, amount, action);
    }
    
    /**
     * @dev Update player stats
     */
    function updatePlayerStat(
        address player,
        uint256 statType,
        uint256 value
    ) external onlyOwner {
        require(players[player].initialized, "Player not initialized");
        require(statType <= 3, "Invalid stat type");
        
        playerStats[player][statType] = value;
        
        emit StatUpdated(player, statType, value);
        
        // Check for class changes based on stats
        _checkClassRequirements(player);
    }
    
    /**
     * @dev Check if player meets requirements for class changes
     */
    function _checkClassRequirements(address player) internal {
        uint256 swaps = playerStats[player][STAT_SWAPS];
        uint256 liquidity = playerStats[player][STAT_LIQUIDITY];
        uint256 staking = playerStats[player][STAT_STAKING];
        uint256 bridging = playerStats[player][STAT_BRIDGING];
        
        uint256 newClass = players[player].currentClass;
        
        // Determine best class based on highest activity
        if (liquidity >= 1000 && liquidity > swaps && liquidity > staking && liquidity > bridging) {
            newClass = FARMER_CLASS;
        } else if (staking >= 500 && staking > swaps && staking > liquidity && staking > bridging) {
            newClass = STAKER_CLASS;
        } else if (bridging >= 5 && bridging > swaps && bridging > liquidity && bridging > staking) {
            newClass = BRIDGER_CLASS;
        } else if (swaps >= 10) {
            newClass = SWAPPER_CLASS;
        }
        
        if (newClass != players[player].currentClass) {
            // Burn old class token
            _burn(player, players[player].currentClass, 1);
            
            // Mint new class token
            _mint(player, newClass, 1, "");
            
            players[player].currentClass = newClass;
            
            emit ClassChanged(player, newClass);
        }
    }
    
    /**
     * @dev Get player information
     */
    function getPlayer(address player) 
        external 
        view 
        returns (
            uint256 level,
            uint256 totalXP,
            uint256 currentClass,
            bool initialized
        ) 
    {
        Player memory p = players[player];
        return (p.level, p.totalXP, p.currentClass, p.initialized);
    }
    
    /**
     * @dev Get player stats
     */
    function getPlayerStats(address player) 
        external 
        view 
        returns (
            uint256 swaps,
            uint256 liquidity,
            uint256 staking,
            uint256 bridging
        ) 
    {
        return (
            playerStats[player][STAT_SWAPS],
            playerStats[player][STAT_LIQUIDITY],
            playerStats[player][STAT_STAKING],
            playerStats[player][STAT_BRIDGING]
        );
    }
    
    /**
     * @dev Calculate XP to next level
     */
    function getXPToNextLevel(address player) external view returns (uint256) {
        if (!players[player].initialized) return 0;
        
        uint256 currentLevelXP = (players[player].level - 1) * 1000;
        uint256 nextLevelXP = players[player].level * 1000;
        
        return nextLevelXP - players[player].totalXP;
    }
}