
// ========================================================
// START: REDUX types

interface Action {
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


interface Kiln {
  id: string,
  brand: string,
  model: string,
  name: string,
  installDate: DateTime,
  energy: energySource,
  type: kilnType,
  maxTemp: number,
  maxProgramID: number,
  width: number,
  depth: number,
  height: number,
  glaze: boolean,
  bisque: boolean,
  luster: boolean,
  onglaze: boolean,
  singleFire: boolean,
  retired: false,
  isWorking: boolean,
  isInUse: boolean,
  isHot: boolean
}

interface  EquipmentLogEntry {
  id: string,
  equipmentID: string,
  date: number,
  type: equipmentLogType,
  user: string,
  shortDesc: string,
  longDesc: string,
  parentID: string | null,
  verifiedDate: number | null,
  verifiedBy: string | null
}

interface FiringProgram {
  id: string,
  kilnID: string,
  controllerProgramID: number,
  type: firingType,
  name: string,
  version: number,
  description: string,
  maxTemp: number,
  duration: number,
  averageRate: number,
  steps: [firingStep],
  created: number,
  createdBy: string,
  superseded: boolean,
  used: boolean,
  useCount: number,
  deleted: boolean,
  locked: boolean
}

interface FiringProgramTmp implements FiringProgram {
  confirmed: boolean,
  errors: object,
  lastField: string,
  mode: string
}

interface FiringStep {
  endTemp: number, // positive degrees
  rate: number,    // degrees per hour
  hold: number     // minutes to hold at end temperature
}


interface FiringLog {
  id: string,
  kilnID: string,
  programID: string,
  diaryID: string,
  firingType: firingType,
  start: number,
  end: number,
  responsibleUserID: string,
  notes: string,
  tempLog: [temperatureLogEntry]
  responsibleLog: [responsibleLogEntry]
}

interface TemperatureLogEntry {
  time: number,
  tempExpected: number,
  tempActual: number,
  state: temperatureState,
  notes: string
}

interface ResponsibleLogEntry {
  time: Date,
  userID: string,
  isStart: boolean
}

interface Kilns {
  all: [kiln],
  tmp: kiln
}

interface AllFiringPrograms {
  all: [firingProgram]
  tmp: firingProgram
}

type FiringLogs = [firingLog]
type equipmentLog = [equipmentLogEntry]
type users = [user]
type calendar = [diaryEntry]

interface DiaryEntry {
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

interface User {
    id: string,
    firstName: string
    lastName: string,
    phone: string,
    email: string,
    canFire: boolean
    canPack: boolean
    canLog: boolean
}

interface Studio {
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


interface FiringReport {
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

interface ReportRow {
    time: Date,
    temp: number,
    expectedTemp: number,
    rate: number,
    expectedRate: number
}

interface App {
    currentUser: user,
    reports: [firingReport],
    view: view,
    stateSlice: kilns | allFiringPrograms | firingLogs | maintenance | issues | users | diary
}

function view (state: object, eHandler: function, routes: array) : html


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

