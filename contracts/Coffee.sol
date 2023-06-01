// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Coffee {
    address public owner;
    uint public totalDonations;

    event DonationReceived(address indexed donor, uint amount);

    constructor() {
        owner = msg.sender;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation amount must be greater than zero");

        // Update the total donations
        totalDonations += msg.value;

        // Emit the DonationReceived event
        emit DonationReceived(msg.sender, msg.value);

        // You can implement additional logic here, such as storing the donor's address and the donation amount
    }
}
