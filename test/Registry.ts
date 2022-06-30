import { BigNumber } from "ethers"
import chai from "chai"
import chaiAsPromised from "chai-as-promised"
import { solidity } from "ethereum-waffle"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "hardhat"
import { IRegistry } from "../typechain/IRegistry"

const { expect } = chai
chai.use(chaiAsPromised)
chai.use(solidity)

describe("Registry tests", function () {
  let deployer: SignerWithAddress
  let registry: IRegistry

  beforeEach(async function () {
    ;[deployer] = await ethers.getSigners()
    console.log(`deployer: ${deployer.address}`)
    const RegistryFact = await ethers.getContractFactory("Registry")
    registry = await RegistryFact.deploy(
      "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      1,
      1,
      1
    )
  })

  describe("General tests", function () {
    it("Register Story", async function () {
      expect(
        await registry.registerStory({
          profileId: BigNumber.from("0"),
          pubId: BigNumber.from("0"),
        })
      ).emit(registry, "storyRegistered")
    })
    it("Get Story", async function () {
      await registry.registerStory({
        profileId: BigNumber.from("1"),
        pubId: BigNumber.from("2"),
      })
      const story = await registry.getStory({
        profileId: BigNumber.from("1"),
        pubId: BigNumber.from("2")
      })
      expect(story[0][0]).is.equal(BigNumber.from("1"))
      expect(story[0][1]).is.equal(BigNumber.from("2"))

    })
  })
})
