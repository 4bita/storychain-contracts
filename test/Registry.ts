import { BigNumber } from "ethers"
import chai from "chai"
import chaiAsPromised from "chai-as-promised"
import { solidity } from "ethereum-waffle"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "hardhat"
import { Registry } from "../typechain/Registry"

const { expect } = chai
chai.use(chaiAsPromised)
chai.use(solidity)

describe("Registry tests", function () {
  let deployer: SignerWithAddress
  let registry: Registry

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
      pubId: BigNumber.from("2"),
    })
    expect(story[0][0]).is.equal(BigNumber.from("1"))
    expect(story[0][1]).is.equal(BigNumber.from("2"))
  })

  it("Add candidate", async function () {
    const head = {
      profileId: BigNumber.from("1"),
      pubId: BigNumber.from("2"),
    }

    const item1 = {
      profileId: BigNumber.from("1"),
      pubId: BigNumber.from("3"),
    }

    const item2 = {
      profileId: BigNumber.from("1"),
      pubId: BigNumber.from("3"),
    }

    await registry.registerStory(head)
    await registry.appendStoryItemCandidate(head, 0, item1)
    await registry.appendStoryItemCandidate(head, 0, item2)

    const candidates = await registry.listStoryItemCandidates(
      head,
      BigNumber.from(0)
    )

    expect(candidates.length).is.equal(2)
  })

  it("Check allStories and getStoryByHash", async function () {
    await registry.registerStory({
      profileId: BigNumber.from("1"),
      pubId: BigNumber.from("2"),
    })
    const _hash = await registry.allStories(0)
    const story = await registry.getStoryByHash(_hash)
    expect(story[0][0]).is.equal(BigNumber.from("1"))
    expect(story[0][1]).is.equal(BigNumber.from("2"))
  })
})
