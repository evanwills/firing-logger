// ========================================================
// START: stored data types


type kiln = {
  id: string,
  brand: string,
  model: string,
  name: string,
  installDate: DateTime,
  energy: energySource,
  type: kilnType,
  maxTemp: number,
  width: number,
  depth: number,
  height: number,
  glaze: boolean,
  bisque: boolean,
  singleFire: boolean,
  retired: false,
  isWorking: boolean,
  isInUse: boolean,
  isHot: boolean
}

type  equipmentLogEntry = {
  id: string,
  equipmentID: string,
  date: Date,
  type: equipmentLogType,
  user: string,
  shortDesc: string,
  longDesc: string,
  parentID: string | null,
  verifiedDate: Date | null,
  verifiedBy: string | null
}

type firingProgram = {
  id: string,
  kilnID: string,
  controllerProgramID: number,
  name: string,
  version: number,
  description: string,
  steps: [firingStep],
  created: Date,
  createdBy: string,
  superseded: boolean,
  used: boolean
}

type firingStep = {
  endTemp: number, // positive degrees
  rate: number,    // degrees per hour
  hold: number     // minutes to hold at end temperature
}


type firingLog = {
  id: string,
  kilnID: string,
  programID: string,
  diaryID: string,
  firingType: firingType,
  start: Date,
  end: Date,
  responsibleUserID: string,
  notes: string,
  tempLog: [temperatureLogEntry]
  responsibleLog: [responsibleLogEntry]
}

type temperatureLogEntry = {
  time: Date,
  tempExpected: number,
  tempActual: number,
  state: temperatureState,
  notes: string
}

type responsibleLogEntry = {
  time: Date,
  userID: string,
  isStart: boolean
}

type kilns = [kiln]
type allFiringPrograms = [firingProgram]
type firingLogs = [firingLog]
type equipmentLog = [equipmentLogEntry]
type users = [user]
type diary = [diaryEntry]

type studio = {
  kilns: [kiln],
  firingPrograms: allFiringPrograms,
  firingLogs: firingLogs,
  equipmentLogs: equipmentLog,
  users: users,
  diary: [diaryEntry]
}

type diaryEntry = {
    id: string,
    date: Date,
    kilnID: string,
    ownerID: string,
    approverID: string,
    programID: string,
    firingType: firingType,
    notes: string,
    confirmed: boolean,
    started: boolean,
}

type user = {
    id: string,
    firstName: string
    lastName: string,
    phone: string,
    email: string,
    canFire: boolean
    canPack: boolean
    canLog: boolean
}


//  END:  stored data types
// ========================================================
// START: view only types


type firingReport = {
    kilnName: string,
    program: firingProgram,
    firingType: firingType,
    state: firingState,
    responsible: string,
    startTime: Date,
    endTime: Date,
    firingState: firingState,
    tempState: temperatureState,
    log: [reportRow]
    currentRate: number
}

type reportRow = {
    time: Date,
    temp: number,
    expectedTemp: number,
    rate: number,
    expectedRate: number
}

type app = {
    currentUser: user,
    reports: [firingReport],
    view: view,
    stateSlice: kilns | allFiringPrograms | firingLogs | maintenance | issues | users | diary
}


//  END:  view only types
// ========================================================
// START: enums


enum firingType {
    bisque,
    glaze,
    single,
    luster,
    onglaze
}

enum firingState {
    pending,
    started,
    completed,
    aborted
}

enum temperatureState {
    nominal,
    over,
    under
}

enum view {
    diary,
    firings,
    kilns,
    programs,
    report,
    users
}

enum energySource {
  electric,
  gas,
  wood,
  oil,
}

enum kilnType {
  'general',
  'raku',
  'platter',
  'black firing',
  'annagamma'
}

enum equipmentLogType {
  usage,
  maintenance,
  problem
}

enum programStatus {
  unused,
  selected,
  used
}


//  END:  enums
// ========================================================

