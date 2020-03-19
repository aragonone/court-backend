const ruledQuery = `
{
  disputes(where: {state: Ruled, settledPenalties: false}, orderBy: createdAt) {
    id
  }
}`

const endedQuery = `
{
  disputes(where: {state: Adjudicating}, orderBy: createdAt) {
    id
    lastRoundId
    rounds(where: {state: Ended}, orderBy: id, orderDirection: desc) {
      id
    }
  }
}
`

const appealingQuery = `
{
  disputes(where: {state: Adjudicating}, orderBy: createdAt) {
    id
    lastRoundId
    rounds(where: {stateInt_in: [3, 4]}, orderBy: id, orderDirection: desc) {
      id
    }
  }
}
`

export default [
  {
    title: 'Disputes in Ruled state',
    query: ruledQuery,
    checkCanSettle: false,
    executeRuling: false
  },
  {
    title: 'Disputes in Adjudicating state with last round ended',
    query: endedQuery,
    checkCanSettle: false,
    executeRuling: true
  },
  {
    title: 'Disputes in Adjudicating state with last round appealing',
    query: appealingQuery,
    checkCanSettle: true,
    executeRuling: true
  },
]
