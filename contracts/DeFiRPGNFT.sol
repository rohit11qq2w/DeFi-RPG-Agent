// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title DeFiRPGNFT
 * @dev ERC721 contract for DeFi RPG achievement NFTs
 */
contract DeFiRPGNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Achievement metadata
    struct Achievement {
        string name;
        string description;
        string rarity; // common, rare, epic, legendary
        uint256 xpReward;
        uint256 timestamp;
    }
    
    // Mapping from token ID to achievement data
    mapping(uint256 => Achievement) public achievements;
    
    // Mapping from player address to earned achievements
    mapping(address => uint256[]) public playerAchievements;
    
    // Events
    event AchievementMinted(
        address indexed player,
        uint256 indexed tokenId,
        string name,
        string rarity,
        uint256 xpReward
    );
    
    constructor() ERC721("DeFi RPG Achievement", "DRPG") {}
    
    /**
     * @dev Mint an achievement NFT to a player
     */
    function mintAchievement(
        address to,
        string memory name,
        string memory description,
        string memory rarity,
        uint256 xpReward,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        achievements[tokenId] = Achievement({
            name: name,
            description: description,
            rarity: rarity,
            xpReward: xpReward,
            timestamp: block.timestamp
        });
        
        playerAchievements[to].push(tokenId);
        
        emit AchievementMinted(to, tokenId, name, rarity, xpReward);
        
        return tokenId;
    }
    
    /**
     * @dev Get all achievements for a player
     */
    function getPlayerAchievements(address player) 
        public 
        view 
        returns (uint256[] memory) 
    {
        return playerAchievements[player];
    }
    
    /**
     * @dev Get achievement details by token ID
     */
    function getAchievement(uint256 tokenId) 
        public 
        view 
        returns (Achievement memory) 
    {
        require(_exists(tokenId), "Achievement does not exist");
        return achievements[tokenId];
    }
    
    /**
     * @dev Check if player has a specific achievement
     */
    function hasAchievement(address player, string memory achievementName) 
        public 
        view 
        returns (bool) 
    {
        uint256[] memory playerTokens = playerAchievements[player];
        
        for (uint256 i = 0; i < playerTokens.length; i++) {
            if (keccak256(bytes(achievements[playerTokens[i]].name)) == 
                keccak256(bytes(achievementName))) {
                return true;
            }
        }
        
        return false;
    }
    
    // Override required functions
    function _burn(uint256 tokenId) 
        internal 
        override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}