const chai = require('chai')
const chaiHttp = require('chai-http')
const serverPort = process.env.SERVER_PORT || 8000

const { expect } = chai
chai.use(chaiHttp)

describe(`Server Endpoints`, () => {

  // agent is used to persist authentication cookie across multiple tests
  const agent = chai.request.agent(`http://localhost:${serverPort}`)
  after(() => agent.close())

  it('should welcome user to the api', async () => {
    const res = await agent.get('/')
    expect(res).to.have.status(200)
    expect(res.body.message).to.equal('Welcome to Aragon Court server')
  })

  it('should return session cookie', async () => {
    const res = await agent.post('/users/testaddr/sessions').send({signature: 'test'})
    expect(res).to.have.status(200)
    expect(res).to.have.cookie('aragonCourtSessionID')
    expect(res.body).to.deep.equal({
      authenticated: true
    })
  })

  it('should set user email', async () => {
    const res = await agent.put('/users/testaddr/email').send({
      email: 'test@test.com'
    })
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      email: 'test@test.com',
      sent: true
    })
  })

  it('should resend verification email', async () => {
    const res = await agent.post('/users/testaddr/email:send').send({token: 'test'})
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      sent: true
    })
  })

  it('should return user email', async () => {
    const res = await agent.get('/users/testaddr/email')
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      email: 'test@test.com'
    })
  })

  it('should verify user email', async () => {
    const res = await agent.post('/users/testaddr/email:verify').send({token: 'test'})
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      verified: true
    })
  })

  it('should disable user notifications', async () => {
    const res = await agent.put('/users/testaddr/notifications').send({disabled: true})
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      disabled: true
    })
  })
  
  it('should return user with all properties true', async () => {
    const res = await agent.get('/users/testaddr').send({disabled: true})
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      emailExists: true,
      emailVerified: true,
      addressVerified: true,
      notificationsDisabled: true,
    })
  })
  
  it('should delete user email', async () => {
    const res = await agent.delete('/users/testaddr/email').send({disabled: true})
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      deleted: true,
    })
  })
  
  it('should return user with only addressVerified: true', async () => {
    const res = await agent.get('/users/testaddr').send({disabled: true})
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      emailExists: false,
      emailVerified: false,
      addressVerified: true,
      notificationsDisabled: false,
    })
  })

  it('should logout current session', async () => {
    const res = await agent.delete('/users/testaddr/sessions:current').send({disabled: true})
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      deleted: true,
    })
  })
  
  it('should return authentication error', async () => {
    const res = await agent.get('/users/testaddr/email')
    expect(res).to.have.status(403)
  })

  it('should return session cookie', async () => {
    const res = await agent.post('/users/testaddr/sessions').send({signature: 'test'})
    expect(res).to.have.status(200)
    expect(res).to.have.cookie('aragonCourtSessionID')
    expect(res.body).to.deep.equal({
      authenticated: true
    })
  })

  it('should logout all sessions', async () => {
    const res = await agent.delete('/users/testaddr/sessions').send({disabled: true})
    expect(res).to.have.status(200)
    expect(res.body).to.deep.equal({
      deleted: true,
    })
  })
  
  it('should return authentication error', async () => {
    const res = await agent.get('/users/testaddr/email')
    expect(res).to.have.status(403)
  })  

})
