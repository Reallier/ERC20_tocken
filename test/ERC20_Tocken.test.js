const { expect } = require("chai");
// import { expect } from 'chai';

const { ethers } = require("hardhat");


describe("BaseERC20 Contract", function () {
    let BaseERC20;
    let baseERC20;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        // 获取合约工厂
        BaseERC20 = await ethers.getContractFactory("BaseERC20");
        // 部署合约
        baseERC20 = await BaseERC20.deploy();
        // 获取账户地址
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await baseERC20.balanceOf(owner.address)).to.equal(
                await baseERC20.totalSupply()
            );
        });

        it("Should have the correct name and symbol", async function () {
            expect(await baseERC20.name()).to.equal("BaseERC20");
            expect(await baseERC20.symbol()).to.equal("BERC20");
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            await baseERC20.transfer(addr1.address, 50);

            const addr1Balance = await baseERC20.balanceOf(addr1.address);
            expect(addr1Balance.toString()).to.equal("50"); // 使用 toString() 方法进行比较

            await baseERC20.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await baseERC20.balanceOf(addr2.address);
            expect(addr2Balance.toString()).to.equal("50"); // 使用 toString() 方法进行比较
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            const initialOwnerBalance = await baseERC20.balanceOf(owner.address);

            await expect(
                baseERC20.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

            // Owner balance shouldn't have changed
            expect(await baseERC20.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it("Should update balances after transfers", async function () {
            await baseERC20.transfer(addr1.address, 100);
            await baseERC20.transfer(addr2.address, 50);

            const ownerBalance = await baseERC20.balanceOf(owner.address);
            expect(ownerBalance).to.equal(
                (await baseERC20.totalSupply()).sub(100).sub(50)
            );

            const addr1Balance = await baseERC20.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await baseERC20.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
    });

    describe("Minting and Burning", function () {
        it("Should mint new tokens", async function () {
            await baseERC20.mint(addr1.address, 100);
            expect(await baseERC20.balanceOf(addr1.address)).to.equal(100);
            expect(await baseERC20.totalSupply()).to.equal(
                (await baseERC20.totalSupply()).add(100)
            );
        });

        it("Should burn tokens", async function () {
            await baseERC20.burn(50);
            expect(await baseERC20.balanceOf(owner.address)).to.equal(
                (await baseERC20.totalSupply()).sub(50)
            );
            expect(await baseERC20.totalSupply()).to.equal(
                (await baseERC20.totalSupply()).sub(50)
            );
        });

        it("Should fail to burn more tokens than available", async function () {
            await expect(baseERC20.burn(1000000)).to.be.revertedWith(
                "ERC20: burn amount exceeds balance"
            );
        });
    });

    describe("Role Management", function () {
        it("Should allow the owner to add a new owner", async function () {
            await baseERC20.addOwner(addr1.address);
            expect(await baseERC20._roles(addr1.address, baseERC20.OWNER_ROLE)).to.be.true;
        });

        it("Should allow the owner to remove an owner", async function () {
            await baseERC20.addOwner(addr1.address);
            await baseERC20.removeOwner(addr1.address);
            expect(await baseERC20._roles(addr1.address, baseERC20.OWNER_ROLE)).to.be.false;
        });

        it("Should fail when a non-owner tries to add an owner", async function () {
            await expect(baseERC20.connect(addr1).addOwner(addr2.address)).to.be.revertedWith("Caller is not the owner");
        });
    });
});
