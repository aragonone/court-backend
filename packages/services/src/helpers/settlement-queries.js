const ruledDisputes = `
{
  disputes(where: {state: Ruled, settledPenalties: false}, orderBy: createdAt) {
    id
  }
}`

const adjudicatingDisputes = `
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

const appealedDisputes = `
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
    query: ruledDisputes,
    ongoingDispute: false,
  },
  {
    title: 'Disputes in Adjudicating state with last round ended',
    query: adjudicatingDisputes,
    ongoingDispute: true,
  },
  {
    title: 'Disputes in Adjudicating state with last round appealing',
    query: appealedDisputes,
    ongoingDispute: true,
  },
]
