
// ========================================================
// START: REDUX types

interface action {
  type: string,
  payload: object,
  meta: {
    date: Date,
    user: string
  }
}

//  END:  REDUX types
// ========================================================
// START: stored data types


interface kiln {
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

interface  equipmentLogEntry {
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

interface firingProgram {
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

interface firingStep {
  endTemp: number, // positive degrees
  rate: number,    // degrees per hour
  hold: number     // minutes to hold at end temperature
}


interface firingLog {
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

interface temperatureLogEntry {
  time: Date,
  tempExpected: number,
  tempActual: number,
  state: temperatureState,
  notes: string
}

interface responsibleLogEntry {
  time: Date,
  userID: string,
  isStart: boolean
}

interface kilns {
  all: [kiln],
  tmp: kiln
}

interface allFiringPrograms {
  all: [firingProgram]
  tmp: firingProgram
}

type firingLogs = [firingLog]
type equipmentLog = [equipmentLogEntry]
type users = [user]
type calendar = [diaryEntry]

interface diaryEntry {
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

interface user {
    id: string,
    firstName: string
    lastName: string,
    phone: string,
    email: string,
    canFire: boolean
    canPack: boolean
    canLog: boolean
}

interface studio {
  kilns: [kiln],
  firingPrograms: allFiringPrograms,
  firingLogs: firingLogs,
  equipmentLogs: equipmentLog,
  users: users,
  diary: calendar
}


//  END:  stored data types
// ========================================================
// START: view only types


interface firingReport {
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

interface reportRow {
    time: Date,
    temp: number,
    expectedTemp: number,
    rate: number,
    expectedRate: number
}

interface app {
    currentUser: user,
    reports: [firingReport],
    view: view,
    stateSlice: kilns | allFiringPrograms | firingLogs | maintenance | issues | users | diary
}


//  END:  view only types
// ========================================================
// START: enums


enum firinginterface {
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

enum kilninterface {
  'general',
  'raku',
  'platter',
  'black firing',
  'annagamma'
}

enum equipmentLoginterface {
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

