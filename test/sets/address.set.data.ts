import { ethers } from "hardhat";

const sources = [
  ethers.Wallet.createRandom().address,
  ethers.Wallet.createRandom().address,
  ethers.Wallet.createRandom().address,
  ethers.Wallet.createRandom().address,
  ethers.Wallet.createRandom().address,
];

const data = {
  sources,
};

const prepareDeploy = (data: any) => async () => {
  const { sources } = data;

  const addressSet = await (
    await ethers.getContractFactory("AddressSet")
  ).deploy(sources);

  return { addressSet };
};

const deploy = prepareDeploy(data);

export { deploy, data };
