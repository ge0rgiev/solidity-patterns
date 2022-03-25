/* eslint-disable no-unused-expressions */

import chai from "chai";
import { ethers, run } from "hardhat";
import { AddressSet } from "../../typechain";
import { deploy, data } from "./address.set.data";

const { expect } = chai;

describe("AddressSet", async () => {
  let addressSet: AddressSet;
  const { sources } = data;

  before(async () => {
    await run("compile");
  });

  beforeEach(async () => {
    ({ addressSet } = await deploy());
  });

  describe("Get Sources", async () => {
    it("Should get deployed sources", async () => {
      await addressSet
        .getSources()
        .then((_sources) => expect(sources).to.be.deep.equal(_sources));

      await addressSet
        .sourcesCount()
        .then((_sourceCount) =>
          expect(_sourceCount).to.be.equal(sources.length)
        );
    });
  });

  describe("Add Sources", async () => {
    it("Should fail to add the Zero Address as a source", async () => {
      await expect(
        addressSet.addSource(ethers.constants.AddressZero)
      ).to.be.revertedWith("AddressSet: INVALID_SOURCE");
    });

    it("Should fail to add the SENTIEL_SOURCE address as a source", async () => {
      await expect(
        addressSet.addSource("0x0000000000000000000000000000000000000001")
      ).to.be.revertedWith("AddressSet: INVALID_SOURCE");
    });

    it("Should fail to add the Contract address as a source", async () => {
      await expect(addressSet.addSource(addressSet.address)).to.be.revertedWith(
        "AddressSet: INVALID_SOURCE"
      );
    });

    it("Should fail to add already active source", async () => {
      await expect(addressSet.addSource(sources[0])).to.be.revertedWith(
        "AddressSet: ALREADY_ACTIVE_SOURCE"
      );
    });

    it("Should successfully add new source", async () => {
      const _source = ethers.Wallet.createRandom().address;
      await addressSet.addSource(_source);

      await addressSet.getSources().then((_sources) => {
        expect(_sources).to.contain(_source);
      });

      await addressSet
        .sourcesCount()
        .then((_sourceCount) =>
          expect(_sourceCount).to.be.equal(sources.length + 1)
        );
    });
  });

  describe("Remove Sources", async () => {
    it("Should fail to remove the Zero Address as a source", async () => {
      await expect(
        addressSet.removeSource(ethers.constants.AddressZero)
      ).to.be.revertedWith("AddressSet: INVALID_SOURCE");
    });

    it("Should fail to remove the SENTIEL_SOURCE address as a source", async () => {
      await expect(
        addressSet.removeSource("0x0000000000000000000000000000000000000001")
      ).to.be.revertedWith("AddressSet: INVALID_SOURCE");
    });

    it("Should fail to remove the Contract address as a source", async () => {
      await expect(
        addressSet.removeSource(addressSet.address)
      ).to.be.revertedWith("AddressSet: INVALID_SOURCE");
    });

    it("Should fail to remove the nonexistent source", async () => {
      await expect(
        addressSet.removeSource(ethers.Wallet.createRandom().address)
      ).to.be.revertedWith("AddressSet: NONEXISTENT_SOURCE");
    });

    it("Should successfully remove source", async () => {
      const _source = sources[0];
      await addressSet.removeSource(_source);

      await addressSet.getSources().then((_sources) => {
        expect(_sources).to.not.contain(_source);
      });

      await addressSet
        .sourcesCount()
        .then((_sourceCount) =>
          expect(_sourceCount).to.be.equal(sources.length - 1)
        );
    });
  });
});
