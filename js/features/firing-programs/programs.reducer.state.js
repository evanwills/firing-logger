export const initialPrograms = [{
  id: 1,
  kilnID: 'woodrow1',
  controllerProgramID: '1',
  type: 'bisque',
  name: 'Slow bisque',
  description: 'Good for large work, or small work that\'s not completely dry',
  steps: [
    {
      id: 1,
      endTemp: 200,
      rate: 50,
      hold: 0
    },
    {
      id: 2,
      endTemp: 520,
      rate: 100,
      hold: 0
    },
    {
      id: 3,
      endTemp: 600,
      rate: 80,
      hold: 0
    },
    {
      id: 4,
      endTemp: 1000,
      rate: 150,
      hold: 10
    }
  ],
  created: '2021-05-06T21:13:25+1000',
  createdBy: 'evanwills'
}]
