// ========================================================
// START: stored data types


type kiln = {
    id: string,
    name: string,
    brand: string,
    width: number,
    depth: number,
    height: number,
    maxTemp: number,
    glaze: boolean,
    bisque: boolean,
    singleFire: boolean,
    electric: boolean
}

type kilnMaintenanceLogEntry = {
    kilnID: string,
    date: Date,
    person: string,
    action: string,
    notes: string
}

type kilnIssueLogEntry = {
    kilnID: string,
    date: Date,
    reporter: string,
    shortDesc: string,
    Description: string
}

type firingProgram = {
    id: string,
    name: string,
    description: string,
    steps: [firingStep],
    created: Date,
    createdBy: string
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
    temp: number,
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
type maintenance = [kilnMaintenanceLogEntry]
type issues = [kilnIssueLogEntry]
type users = [user]
type diary = [diaryEntry]

type studio = {
    kilns: [kiln],
    firingPrograms: allFiringPrograms,
    firingLogs: firingLogs,
    maintenance: maintenance,
    issues: issues,
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
    reports: [firingReport]
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


//  END:  enums
// ========================================================

