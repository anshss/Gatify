//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

/* based on erc1155 nfts */
contract Gatfiy is ERC1155URIStorage, ERC1155Holder {

    address owner;

    constructor() ERC1155("") {
        owner = payable(msg.sender);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, ERC1155Receiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    struct Comm {
        uint id;
        string logoLink;
        string name;
        address host;
        address entryContract;
        uint entryTokenId;
        string discordLink;
    }

        uint public id;
    mapping (uint => Comm) public idToComm;

    struct Nft {
        uint tokenId;
        uint price;
        uint supply;
    }

    uint public tokenId;
     mapping (uint => Nft) public idToNft;


    function host(string memory logoLink, string memory _name, address _entryContract, uint _entryTokenId, string memory discordLink) public {
        id++ ;
        idToComm[id] = Comm(id, logoLink, _name, msg.sender, _entryContract, _entryTokenId, discordLink);
    }

    function mintNft(string memory _uri, uint _supply, uint _price) public {
        tokenId++ ;
        idToNft[tokenId] = Nft(tokenId, _price, _supply);
        _mint(address(this), tokenId, _supply, "");
        _setURI(tokenId, _uri);
    }

    function buyNft(uint _tokenId) public payable returns (bool) {
        Nft storage nft = idToNft[_tokenId];
        require(msg.value == nft.price, "Amount sent is not equal to price");
        if(balanceOf(msg.sender, _tokenId) == 0) {
            _safeTransferFrom(address(this), msg.sender, _tokenId, 1, "");
            return true;
        }
        return false;
    }

    function activeComms() public view returns (Comm[] memory) {
        uint counter = 0;
        Comm[] memory myComm = new Comm[](id);
        
        for (uint i = 1; i <= id; i++) {
            Comm storage currentItem = idToComm[i];
            myComm[counter] = currentItem;
            counter++; 
        }
        return myComm;
    }

    function joinedComms() public view returns (Comm[] memory) {
            uint counter = 0 ;
            uint length ;

            for (uint i = 1; i <= id; i++) {
                Comm storage comm = idToComm[i];
                IERC1155 nftContractInstance = IERC1155(comm.entryContract);
                if (nftContractInstance.balanceOf(msg.sender, comm.entryTokenId) > 0) {
                    length++;
                }
            }

            Comm[] memory myComm = new Comm[](length);
            for (uint i = 1; i <= id; i++) {
                Comm storage comm = idToComm[i];
                IERC1155 nftContractInstance = IERC1155(comm.entryContract);
                if (nftContractInstance.balanceOf(msg.sender, comm.entryTokenId) > 0) {
                    Comm storage currentItem = idToComm[i];
                    myComm[counter] = currentItem;
                    counter++;
                }
            }
            return myComm;
    }

    function hostedComms() public view  returns (Comm[] memory) {
                    uint counter = 0;
            uint length ;

            for (uint i = 0; i < id; i++) {
                if (idToComm[i].host == msg.sender) {
                    length++;
                }
            }

            Comm[] memory myComm = new Comm[](length);
            for (uint i = 1; i <= id; i++) {
                if (idToComm[i].host == msg.sender) {
                    Comm storage currentItem = idToComm[i];
                    myComm[counter] = currentItem;
                    counter++;
                }
            }
            return myComm;
    }
}