// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BuyMeACoffee {
    address payable public owner;

    event DonationReceived(address indexed donor, uint256 donationAmount);

    constructor() {
        owner = payable(msg.sender);
    }

    // Donate ETH to the contract owner
    function donate() external payable {
        require(msg.value > 0, "Donation amount must be greater than zero");

        // Transfer the donated amount to the contract owner
        owner.transfer(msg.value);

        // Emit the DonationReceived event with the donation details
        emit DonationReceived(msg.sender, msg.value);
    }
}
