import { svg } from '../../vendor/lit-html/lit-html.msj'
import { isBoolTrue } from '../../utilities/validation.mjs'

const tempGuide = (temp, xOffset, yOffset) => {
  const y = yOffset - ((temp / 100) * 50)
  const len = 5 + xOffset
  const prefix = (temp < 1000) ? '0' : ''

  return svg`
    <path d="m45 ${y}h${len}" class="grid-line deg-line_${prefix}${temp}" />
    <text transform="rotate(-90)" x="-${7}" y="42.25" class="temp-value deg-num_${prefix}${temp}">${temp}°</text>
  `
}

const timeGuide = (time, len, yOffset) => {
  const x = 50 + (time * 50)
  const lineY = yOffset + 5
  const textY = yOffset + 20
  const _len = (5 + len)
  const prefix = (time < 10) ? '0' : ''

  return svg`
    <path d="m${x} ${lineY}v-${_len}" class="grid-line hour-line_${prefix}${time}" />
    <text x="${x}" y="${textY}" class="time-value hour-num_${prefix}${time}">${time}</text>
  `
}

const stepGraph = (x, y, steps, isLog) => {
  const _isLog = isBoolTrue(isLog)
  const id = (_isLog) ? 'log' : 'program'
  const gId = (_isLog) ? 'firing-log' : 'program'
  const className = (_isLog) ? 'log-data' : 'program'
  let path = ''
  for (let a = 0; a < steps.length; a += 1) {
    path += steps[a]
  }

  return svg`
  <g class="${gId}">
    <path class="${className} ${id}" d="m${x} ${y} ${path}" />
  </g>
  `
}

export const firingLog = (maxDeg, duration, programSteps, firingLog) => {
  const xOffset = ((Math.floor(duration) * 50) + 50)
  const yOffset = ((Math.floor(maxDeg / 100) * 50) + 50)
  const x = (xOffset + 50)
  const y = (yOffset + 50)
  const tempGuides = []
  const timeGuides = []
  let firingLogPath = ''

  for (let a = 100; a < maxDeg; a += 100) {
    tempGuides.push(tempGuide(a, xOffset, yOffset))
  }
  for (let a = 1; a < duration; a += 1) {
    timeGuides.push(timeGuide(a, xOffset, yOffset))
  }

  if (Array.isArray(firingLog) && firingLog.length > 1) {
    firingLogPath = svg`
      <g class="firing-log">
        ${firingGraph(50, yOffset, firingLog, true)}
      </g>
    `
  }

  return svg`
    <svg version="1.1" viewBox="0 0 ${x} ${y}" xmlns="http://www.w3.org/2000/svg" class="firing-log">
      <g class="base">
        <rect width="${x}" height="${y}" class="frame image-frame" />
        <rect x="50" width="${xOffset}" height="${yOffset}" class="frame program-frame" />
      </g>

      <g class="degrees">
        <text id="unit-label--deg" transform="rotate(-90)" x="-${(y / 2)}" y="18" class="unit-text">Degrees</text>

        ${tempGuides}
      </g>

      <g class="hours">
        <text id="unit-label--hrs" x="${(x / 2)}" y="${(yOffset + 20)}" class="unit-text">Hours</text>

        ${timeGuides}
      </g>

      ${firingLogPath}

      <g class="program">
        ${stepGraph(50, yOffset, programSteps, false)}
      </g>
    </svg>
  `
}

export const firingGraph = (maxDeg, duration, steps) => {
  const xOffset = ((Math.floor(duration) * 50) + 50)
  const yOffset = ((Math.floor(maxDeg / 100) * 50) + 50)

  return svg`
    <svg version="1.1" viewBox="0 0 ${xOffset} ${yOffset}" xmlns="http://www.w3.org/2000/svg" class="firing-graph">
      ${stepGraph(0, yOffset, steps, true)}
    </svg>
  `
}
