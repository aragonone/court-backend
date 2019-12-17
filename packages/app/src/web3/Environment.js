import Artifacts from './Artifacts'

export default class {
  constructor(provider, from) {
    this.provider = provider
    this.from = from
  }

  async getArtifact(contractName, dependency = undefined) {
    const artifacts = await this.getArtifacts()
    return artifacts.require(contractName, dependency)
  }

  async getArtifacts() {
    if (!this.artifacts) this.artifacts = new Artifacts(this.provider, { from: this.from })
    return this.artifacts
  }
}
