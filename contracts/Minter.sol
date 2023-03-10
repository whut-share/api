// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Minter is ERC1155Burnable, Ownable {

  event NftMinted(
    bytes32 mint_request_id,
    address indexed to, 
    uint256 indexed nft_id,
    bytes32 project_id
  );

  mapping(address => bool) public can_mint;
  uint public nft_index = 1;

  constructor(string memory uri_) ERC1155(uri_) {}

  function mint(
    bytes32 mint_request_id_,
    address owner_, 
    bytes32 project_id_, 
    uint amount_, 
    bytes calldata data_
  ) external {
    require(can_mint[msg.sender], "You are not allowed to mint");

    if(amount_ == 0) {
      amount_ = 1;
    }

    _mint(owner_, nft_index, amount_, data_);

    emit NftMinted(mint_request_id_, owner_, nft_index, project_id_);

    nft_index++;
  }

  //** ADMIN METHODS */

  function setMintPermission(address address_, bool can_mint_) external onlyOwner {
    can_mint[address_] = can_mint_;
  }

  function setUri(string memory uri_) external onlyOwner {
    _setURI(uri_);
  }
}
