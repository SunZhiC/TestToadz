// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToadz is ERC721, Ownable {
    uint256 public constant maxTokens = 6969;
    uint256 public numAvailableTokens = 6969;
    uint256 public constant maxMintsPerTx = 5;
    mapping(address => uint256) public addressToNumOwned;
    string private _contractURI;
    bool public devMintLocked = false;
    uint256[10000] private _availableTokens;

    constructor() ERC721("TestToadz", "TESTTOADZ") {}

    // metadata URI
    string private _baseTokenURI =
        "ipfs://QmWEFSMku6yGLQ9TQr66HjSd9kay8ZDYKbBEfjNi4pLtrr/";

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 _serialId)
        public
        view
        override
        returns (string memory)
    {
        string memory base = _baseURI();
        string memory _tokenURI = Strings.toString(_serialId);

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }

        return string(abi.encodePacked(base, _tokenURI));
    }

    function getNumAvailableTokens() public view returns (uint256) {
        return numAvailableTokens;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    //Minting
    function mint(uint256 quantity) public {
        uint256 updatedNumAvailableTokens = numAvailableTokens;
        require(
            block.timestamp >= 1337133769,
            "Sale starts at whatever this time is"
        );
        require(
            quantity <= maxMintsPerTx,
            "There is a limit on minting too many at a time!"
        );
        require(
            updatedNumAvailableTokens - quantity >= 0,
            "Minting this many would exceed supply!"
        );
        require(
            addressToNumOwned[msg.sender] + quantity <= 40,
            "Can't own more than 20 toadz"
        );
        require(msg.sender == tx.origin, "No contracts!");
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = getRandomSerialToken(quantity, i);
            _safeMint(msg.sender, tokenId);
            updatedNumAvailableTokens--;
        }
        numAvailableTokens = updatedNumAvailableTokens;
        addressToNumOwned[msg.sender] =
            addressToNumOwned[msg.sender] +
            quantity;
    }

    function mintTo(address to, uint256 quantity) public {
        uint256 updatedNumAvailableTokens = numAvailableTokens;
        require(
            block.timestamp >= 1337133769,
            "Sale starts at whatever this time is"
        );
        require(
            quantity <= maxMintsPerTx,
            "There is a limit on minting too many at a time!"
        );
        require(
            updatedNumAvailableTokens - quantity >= 0,
            "Minting this many would exceed supply!"
        );
        require(
            addressToNumOwned[to] + quantity <= 40,
            "Can't own more than 20 toadz"
        );
        require(msg.sender == tx.origin, "No contracts!");
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = getRandomSerialToken(quantity, i);
            _safeMint(to, tokenId);
            updatedNumAvailableTokens--;
        }
        numAvailableTokens = updatedNumAvailableTokens;
        addressToNumOwned[to] =
            addressToNumOwned[to] +
            quantity;
    }

    //Dev mint special tokens
    function mintSpecial(uint256[] memory specialIds) external onlyOwner {
        require(!devMintLocked, "Dev Mint Permanently Locked");
        uint256 num = specialIds.length;
        for (uint256 i = 0; i < num; i++) {
            uint256 specialId = specialIds[i];
            _safeMint(msg.sender, specialId);
        }
    }

    function getRandomSerialToken(uint256 _numToFetch, uint256 _i)
        internal
        returns (uint256)
    {
        uint256 randomNum = uint256(
            keccak256(
                abi.encode(
                    msg.sender,
                    tx.gasprice,
                    block.number,
                    block.timestamp,
                    blockhash(block.number - 1),
                    _numToFetch,
                    _i
                )
            )
        );
        uint256 randomIndex = randomNum % numAvailableTokens;
        uint256 valAtIndex = _availableTokens[randomIndex];
        uint256 result;
        if (valAtIndex == 0) {
            result = randomIndex;
        } else {
            result = valAtIndex;
        }

        uint256 lastIndex = numAvailableTokens - 1;
        if (randomIndex != lastIndex) {
            uint256 lastValInArray = _availableTokens[lastIndex];
            if (lastValInArray == 0) {
                _availableTokens[randomIndex] = lastIndex;
            } else {
                _availableTokens[randomIndex] = lastValInArray;
            }
        }

        numAvailableTokens--;
        return result;
    }

    function lockDevMint() public onlyOwner {
        devMintLocked = true;
    }
}
