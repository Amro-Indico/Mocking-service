const albumTemplate = (
  aid: string,
  title: string,
  description: string,
  tags: [string],
  usage: [{}],
  authorization: Object,
  xonbehalf: any,
  system: any
) => {
  return {
    aid,
    changedBy: {
      id: 'string',
      ref: 'string',
      system: 'BL'
    },
    createdBy: {
      id: xonbehalf,
      ref: xonbehalf,
      system
    },
    medieFiles: [],
    metadata: {
      authorization,
      description,
      tags,
      title,
      usage
    },
    timeChanged: '2019-12-13T13:00:43.693Z',
    timeCreated: '2019-12-13T13:00:43.693Z'
  }
}

export default albumTemplate
