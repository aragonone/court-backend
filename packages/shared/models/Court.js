module.exports = class {
  constructor(instance, environment) {
    this.instance = instance
    this.environment = environment
  }

  async anj() {
    if (!this._anj) {
      const registry = await this.registry()
      const address = await registry.token()
      const MiniMeToken = await this.environment.getArtifact('MiniMeToken', '@aragon/minime')
      this._anj = await MiniMeToken.at(address)
    }
    return this._anj
  }

  async feeToken() {
    if (!this._feeToken) {
      const subscriptions = await this.subscriptions()
      const address = await subscriptions.currentFeeToken()
      const MiniMeToken = await this.environment.getArtifact('MiniMeToken', '@aragon/minime')
      this._feeToken = await MiniMeToken.at(address)
    }
    return this._feeToken
  }

  async registry() {
    if (!this._registry) {
      const address = await this.instance.getJurorsRegistry()
      const JurorsRegistry = await this.environment.getArtifact('JurorsRegistry', '@aragon/court')
      this._registry = await JurorsRegistry.at(address)
    }
    return this._registry
  }

  async subscriptions() {
    if (!this._subscriptions) {
      const address = await this.instance.getSubscriptions()
      const Subscriptions = await this.environment.getArtifact('CourtSubscriptions', '@aragon/court')
      this._subscriptions = await Subscriptions.at(address)
    }
    return this._subscriptions
  }
}
