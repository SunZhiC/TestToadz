const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TestToadz", function () {
    it("Should do something", async function () {
        const TestToadz = await ethers.getContractFactory("TestToadz");
        const testToadz = await TestToadz.deploy();
        await testToadz.deployed();

        // Your test assertions go here
        expect(await testToadz.getNumAvailableTokens()).to.equal(6969);
    });
});

describe("TestToadz", function () {
    it("Should return correct tokenURI", async function () {
        const TestToadz = await ethers.getContractFactory("TestToadz");
        const testToadz = await TestToadz.deploy();
        await testToadz.deployed();

        const serialId = 333; // Change this value to the appropriate serialId you want to test

        // Your test assertions go here
        const expectedTokenURI = "ipfs://QmWEFSMku6yGLQ9TQr66HjSd9kay8ZDYKbBEfjNi4pLtrr/333"; // Replace this with the expected tokenURI for the serialId you're testing
        expect(await testToadz.tokenURI(serialId)).to.equal(expectedTokenURI);
    });
});

it("Should mint tokens", async function () {
    const TestToadz = await ethers.getContractFactory("TestToadz");
    const testToadz = await TestToadz.deploy();
    await testToadz.deployed();

    const [deployer] = await ethers.getSigners(); // Get the deployer's wallet
    const deployerAddress = deployer.address;
    const quantity = 5; // Change this to the desired mint quantity

    const ownerBalanceBefore = await testToadz.balanceOf(deployerAddress);

    await testToadz.connect(deployer).mint(quantity);

    const ownerBalanceAfter = await testToadz.balanceOf(deployerAddress);

    // Test assertions
    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.add(quantity));
});

it("Should mint special tokens", async function () {
    const TestToadz = await ethers.getContractFactory("TestToadz");
    const testToadz = await TestToadz.deploy();
    await testToadz.deployed();
  
    const [deployer] = await ethers.getSigners(); // Get the deployer's wallet
    const deployerAddress = deployer.address;
    

    const specialIds = [1, 2, 3]; // Change this to the desired array of special token IDs
    const quantity = specialIds.length;
    
    await testToadz.mintSpecial(specialIds);
  
    const ownerBalanceBefore = await testToadz.balanceOf(deployerAddress);

    await testToadz.connect(deployer).mint(quantity);

    const ownerBalanceAfter = await testToadz.balanceOf(deployerAddress);

    // Test assertions
    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.add(quantity));
  });
  