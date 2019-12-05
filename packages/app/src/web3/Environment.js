import Artifacts from './Artifacts'

export default class {
  constructor(provider) {
    this.provider = provider
  }

  async getArtifact(contractName, dependency = undefined) {
    const artifacts = await this.getArtifacts()
    return artifacts.require(contractName, dependency)
  }

  async getArtifacts() {
    if (!this.artifacts) this.artifacts = new Artifacts(this.provider)
    return this.artifacts
  }
}
