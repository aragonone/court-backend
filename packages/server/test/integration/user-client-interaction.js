import chai from 'chai'
import chaiHttp from 'chai-http'
import HttpStatus from 'http-status-codes'
import { ethers } from 'ethers'

import { User } from '../../src/models/objection'
import dbCleanup from '../helpers/dbCleanup'
const serverPort = process.env.SERVER_PORT || 8000
const { expect } = chai
chai.use(chaiHttp)
const TEST_EMAIL = 'user@client.test'
const TEST_PRIVATE_KEY = '0x3141592653589793238462643383279502884197169399375105820974944592'
const TEST_ADDR = '0x7357589f8e367c2c31f51242fb77b350a11830f3'
const wallet = new ethers.Wallet(TEST_PRIVATE_KEY)

// test another address for the same email
const TEST_PRIVATE_KEY2 = '11966d3e21165a13ba565bccf7685cb59afc552e7136e244df283f5e0bc59e3a'
const TEST_ADDR2 = '0x60AE14A674532B680e8eE77De4d46923ea7Dd595'
const wallet2 = new ethers.Wallet(TEST_PRIVATE_KEY2)

describe('Client user interaction', () => {

  // agent is used to persist authentication cookie across multiple tests
  const agent = chai.request.agent(`http://localhost:${serverPort}`)
  const agent2 = chai.request.agent(`http://localhost:${serverPort}`)
  after(async () => {
    agent.close()
    agent2.close()
    await dbCleanup(TEST_ADDR)
    await dbCleanup(TEST_ADDR2)
  })

  it('should welcome user to the api', async () => {
    const res = await agent.get('/')
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body.message).to.equal('Welcome to Aragon Court server')
  })

  it('should return session cookie', async () => {
    const timestamp = Date.now()
    const signature = await wallet.signMessage(timestamp.toString())
    const res = await agent.post(`/users/${TEST_ADDR}/sessions`).send({
      signature,
      timestamp
    })
    expect(res).to.have.status(HttpStatus.OK)
    expect(res).to.have.cookie('aragonCourtSessionID')
    expect(res.body).to.deep.equal({
      authenticated: true
    })
  })

  it('should set user email', async () => {
    const res = await agent.put(`/users/${TEST_ADDR}/email`).send({
      email: TEST_EMAIL
    })
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      email: TEST_EMAIL,
      sent: true
    })
  })

  it('should resend verification email', async () => {
    const res = await agent.post(`/users/${TEST_ADDR}/email:resend`)
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      sent: true
    })
  })

  it('should return user email', async () => {
    const res = await agent.get(`/users/${TEST_ADDR}/email`)
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      email: TEST_EMAIL
    })
  })

  it('should set same email for second user with no errors', async () => {
    const timestamp = Date.now()
    const signature = await wallet2.signMessage(timestamp.toString())
    await agent2.post(`/users/${TEST_ADDR2}/sessions`).send({
      signature,
      timestamp
    })
    let res = await agent2.put(`/users/${TEST_ADDR2}/email`).send({
      email: TEST_EMAIL
    })
    expect(res).to.have.status(HttpStatus.OK)
    res = await agent2.get(`/users/${TEST_ADDR2}/email`)
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      email: TEST_EMAIL
    })
  })

  it('should verify user email', async () => {
    const user = await User.query().findOne({address: TEST_ADDR}).withGraphFetched('emailVerificationToken')
    const res = await agent.post(`/users/${TEST_ADDR}/email:verify`).send({
      token: user.emailVerificationToken.token
    })
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      verified: true
    })
  })

  it('should disable user notifications', async () => {
    const res = await agent.put(`/users/${TEST_ADDR}/notifications`).send({disabled: true})
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      disabled: true
    })
  })
  
  it('should return user with all properties true', async () => {
    const res = await agent.get(`/users/${TEST_ADDR}`).send({disabled: true})
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      emailExists: true,
      emailVerified: true,
      addressVerified: true,
      notificationsDisabled: true,
    })
  })
  
  it('should delete user email', async () => {
    const res = await agent.delete(`/users/${TEST_ADDR}/email`).send({disabled: true})
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      deleted: true,
    })
  })
  
  it('should return user with only addressVerified: true', async () => {
    const res = await agent.get(`/users/${TEST_ADDR}`).send({disabled: true})
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      emailExists: false,
      emailVerified: false,
      addressVerified: true,
      notificationsDisabled: false,
    })
  })

  it('should logout current session', async () => {
    const res = await agent.delete(`/users/${TEST_ADDR}/sessions:current`).send({disabled: true})
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      deleted: true,
    })
  })
  
  it('should return authentication error', async () => {
    const res = await agent.get(`/users/${TEST_ADDR}/email`)
    expect(res).to.have.status(HttpStatus.UNAUTHORIZED)
  })

  it('should return session cookie', async () => {
    const timestamp = Date.now()
    const signature = await wallet.signMessage(timestamp.toString())
    const res = await agent.post(`/users/${TEST_ADDR}/sessions`).send({
      signature,
      timestamp
    })
    expect(res).to.have.status(HttpStatus.OK)
    expect(res).to.have.cookie('aragonCourtSessionID')
    expect(res.body).to.deep.equal({
      authenticated: true
    })
  })

  it('should logout all sessions', async () => {
    const res = await agent.delete(`/users/${TEST_ADDR}/sessions`).send({disabled: true})
    expect(res).to.have.status(HttpStatus.OK)
    expect(res.body).to.deep.equal({
      deleted: true,
    })
  })
  
  it('should return authentication error', async () => {
    const res = await agent.get(`/users/${TEST_ADDR}/email`)
    expect(res).to.have.status(HttpStatus.UNAUTHORIZED)
  })  

})
