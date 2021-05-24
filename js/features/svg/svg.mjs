import { svg } from '../../vendor/lit-html/lit-html.mjs'
import { isBoolTrue, isBoolFalse, invalidNum } from '../../utilities/validation.mjs'
import { round } from '../../utilities/sanitisation.mjs'

const spacing = 100
const hBorder = 1.2
const vBorder = 1.1

/**
 * Get a line and text block indicating an hour guide for a firing
 * log graphic
 *
 * @param {number} temp    Temperature the guide is to indicate
 * @param {number} len     Length of the guide
 * @param {number} yOffset Height of the graph part of the firing log
 *                         infographic
 *
 * @returns {svg}
 */
const getTempGuide = (temp, len, yOffset) => {
  const isBig = (temp < 1000)
  const y = yOffset - temp
  const prefix = isBig ? '' : '0'
  const extra = isBig ? ' high-temp' : ''

  return svg`
    <path d="m${(spacing * 1.1)} ${y}h${len}" class="grid-line deg-line_${prefix}${temp}" />
    <text transform="rotate(-90)" x="-${y}" y="${(spacing * 1.05)}" class="unit-value${extra} deg-num_${prefix}${temp}">${temp}°</text>
  `
}

/**
 * Get a line and text block indicating an hour guide for a firing
 * log infographic
 *
 * @param {number} time    Hour the guide is to indicate
 * @param {number} len     Length of the guide
 * @param {number} yOffset Where to start the text
 *
 * @returns {svg}
 */
const getTimeGuide = (time, len, yOffset) => {
  const x = (spacing * hBorder) + (time * spacing)
  const prefix = (time < 10) ? '0' : ''

  return svg`
    <path d="m${x} ${len}v-${len}" class="grid-line hour-line_${prefix}${time}" />
    <text x="${x}" y="${yOffset}" class="unit-value hour-num_${prefix}${time}">${time}</text>
  `
}

/**
 * Get all the x/y coordinates for the firing log
 *
 * @param {array} steps
 *
 * @returns {string}
 */
const getLogPath = (steps) => {
  let output = ''
  let lastTemp = 0
  let lastTime = 0
  let sep = ''

  for (let a = 0; a < steps.length; a += 1) {
    const hours = round(((steps[a].time - lastTime) / 360), 4)
    let degrees = steps[a].actualTemp - lastTemp

    degrees *= (degrees > 0) ? -1 : 1

    output += sep + hours + degrees

    lastTemp = steps[a].actualTemp
    lastTime = steps[a].time
    sep = ' '
  }
  output += ' v' + lastTemp

  return output
}

/**
 * Get all the x/y coordinates for the firing program
 *
 * @param {array} steps
 *
 * @returns {string}
 */
const getProgramPath = (steps, solid, showCooling) => {
  let output = ''
  let b = 0
  let sep = ''

  for (let a = 0; a < steps.length; a += 1) {
    let degrees = steps[a].endTemp - b

    let hours = round(((degrees / steps[a].rate) * 100), 4)
    hours *= (hours < 0) ? -1 : 1

    let h = ''
    const hold = (steps[a].hold > 0) ? (steps[a].hold * (1 / 6) * 10) : 0
    if (hold > 0) {
      h = ' h' + round(hold, 4)
    }

    degrees *= -1

    output += sep + 'l ' + hours + ',' + degrees + h
    b = steps[a].endTemp
    sep = ' '
  }

  // console.group('getProgramPath()')
  // console.log('solid:', solid)
  // console.log('showCooling:', showCooling)
  // console.log('isBoolTrue(solid):', isBoolTrue(solid))
  // console.log('isBoolFalse(showCooling):', isBoolFalse(showCooling))
  // console.groupEnd()

  output += (isBoolTrue(solid) && isBoolFalse(showCooling)) ? ' v' + b : ''

  return output
}

/**
 * Get a visual representation of the program or firing log
 *
 * @param {number}  x            Horizontal starting coordinate
 * @param {number}  y            Vertical starting coordinate
 * @param {array}   steps        Steps that form the path of the output
 * @param {boolean} lineOnly     Whether or not the output path should be
 *                               a line or a solid shape
 * @param {boolean} showCooling  Whether or not to show the cooling
 *                               part of the firing
 * @returns {svg, string}
 */
const stepGraph = (x, y, steps, lineOnly, showCooling) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    // There's nothing here to work with. Give up now
    return ''
  }
  // Determin what we're graphing by a property in the first item
  const isLog = (!invalidNum('actualTem', steps[0]))
  const id = (isLog) ? 'log' : 'program'
  const gId = (isLog) ? 'firing-log' : 'program'
  const className = (isLog) ? 'log-data' : 'program'
  const path = (isLog) ? getLogPath : getProgramPath

  // Switch negative line only to positive `isSolid`
  const isSolid = !isBoolTrue(lineOnly)
  const extra = isSolid ? ' program-solid' : ''

  // console.log('isLog:', isLog)
  // console.log('lineOnly:', lineOnly)
  // console.log('showCooling:', showCooling)
  // console.log('isSolid:', isSolid)
  // console.log('extra:', extra)
  // console.log('isBoolTrue(lineOnly):', isBoolTrue(lineOnly))
  // console.log('!isBoolTrue(lineOnly):', !isBoolTrue(lineOnly))
  // console.log('isBoolFalse(lineOnly):', isBoolFalse(lineOnly))

  return svg`
  <g class="${gId}">
    <path class="${className}${extra} ${id}" d="m${x} ${y} ${path(steps, isSolid, showCooling)}" />
  </g>
  `
}

/**
 * Get a complete firing log / program diagram
 *
 * @param {number}  maxDeg       Top temperature the firing is
 *                               supposed to reach
 * @param {number}  duration     Total firing (heating) time
 * @param {array}   programSteps Firing program steps
 * @param {array}   firingLog    (optional) Firing log records
 * @param {boolean} showCooling  Whether or not to show the cooling
 *                               part of the firing
 *
 * @returns {svg}
 */
export const getFiringLogSVG = (maxDeg, duration, programSteps, firingLog, showCooling) => {
  const hours = Math.floor(duration / 3600)
  const cool = isBoolTrue(showCooling)
  const totlaHrs = (cool === true) ? hours * 2 : hours
  const xOffset = ((totlaHrs * spacing) + spacing)
  const yOffset = ((maxDeg * 1) + spacing)
  const x = (xOffset + (spacing * hBorder))
  const y = (yOffset + (spacing * vBorder))
  const hGuide = xOffset + (spacing * 0.1)
  const vGuide = yOffset + (spacing * 0.1)
  const vStart = yOffset + (spacing * 0.4)
  const tempGuides = []
  const timeGuides = []
  let firingLogPath = ''

  console.group('getFiringLogSVG()')
  console.log('maxDeg:', maxDeg)
  console.log('duration:', duration)
  console.log('programSteps:', programSteps)
  console.log('hours:', hours)
  console.log('totlaHrs:', totlaHrs)
  console.log('totlaHrs:', totlaHrs)
  console.log('xOffset:', xOffset)
  console.log('yOffset:', yOffset)

  // Build list of temperature guides
  for (let a = 100; a <= maxDeg; a += 100) {
    tempGuides.push(getTempGuide(a, hGuide, yOffset))
  }
  // Build list of time/hour guides
  for (let a = 1; a <= totlaHrs; a += 1) {
    timeGuides.push(getTimeGuide(a, vGuide, vStart))
  }

  const pSteps = [...programSteps]
  if (showCooling === true) {
    pSteps.push({
      endTemp: 0,
      rate: Math.round(maxDeg / (duration / 3600)),
      hold: 0
    })
  }

  const fLog = (Array.isArray(firingLog)) ? [...firingLog] : []
  // Show firing log if supplied
  if (fLog.length > 1) {
    if (fLog === true) {
      pSteps.push({
        endTemp: 0,
        rate: Math.round(maxDeg / (duration / 3600)),
        hold: 0
      })
    }

    firingLogPath = svg`
      <g class="firing-log">
        ${stepGraph(spacing, yOffset, fLog, false, cool)}
        ${stepGraph(spacing * hBorder, yOffset, pSteps, true, cool)}
      </g>
    `
  }

  console.groupEnd()

  if (pSteps.length > 0 && pSteps[0].endTemp > 0 && pSteps[0].rate > 0) {
    // Only render SVG when there's some usable data worth rendering
    return svg`
      <svg version="1.1" viewBox="0 0 ${(x + 1)} ${y}" xmlns="http://www.w3.org/2000/svg" class="firing-log">
        <g class="base">
          <rect width="${x}" height="${y}" class="frame image-frame" />
          <rect x="${spacing * 1.2}" width="${xOffset}" height="${yOffset}" class="frame program-frame" />
        </g>


        ${stepGraph(spacing * hBorder, yOffset, pSteps, false, cool)}

        ${firingLogPath}

        <g class="degrees">
          <text id="unit-label--deg" transform="rotate(-90)" x="-${((y / 2) + (spacing * 0.2))}" y="${spacing * 0.32}" class="unit-text">Degrees</text>

          ${tempGuides}
        </g>

        <g class="hours">
          <text id="unit-label--hrs" x="${((x / 2) - (spacing * 0.3))}" y="${(yOffset + (spacing * 0.95))}" class="unit-text">Hours</text>

          ${timeGuides}
        </g>
      </svg>
    `
  } else {
    return ''
  }
}

export const getFiringGraphSVG = (maxDeg, duration, steps, showCooling) => {
  const hours = Math.floor(duration / 3600)
  const totlaHrs = isBoolTrue(showCooling) ? hours * 2 : hours
  const xOffset = ((Math.floor(totlaHrs) * spacing) + spacing)
  const yOffset = Math.floor(maxDeg + spacing)
  console.group('getFiringGraphSVG()')
  console.log('steps:', steps)
  console.groupEnd()

  if (steps.length > 0 && steps[0].endTemp > 0 && steps[0].rate > 0) {
    return svg`
      <svg version="1.1" viewBox="0 0 ${xOffset} ${yOffset}" xmlns="http://www.w3.org/2000/svg" class="firing-graph">
        ${stepGraph(0, yOffset, steps, true)}
      </svg>
    `
  } else {
    return ''
  }
}
