import { html } from '../../vendor/lit-html/lit-html.mjs'
import {
  // getHourMinSec,
  // getHHMMSS,
  ucFirst,
  // auDateStr,
  // boolYesNo,
  getDeg,
  // getRate,
  // roundMinutes,
  getLen
} from '../../utilities/sanitisation.mjs'
import {
  // isNonEmptyStr,
  invalidBool
} from '../../utilities/validation.mjs'
import { viewActions } from '../mainApp/view.state.mjs'
// import { listFiringTypes } from './kiln-data-valiation.mjs'



export const listFiringTypes = (kiln) => {
  const allTypes = [
    'bisque',
    'glaze',
    'luster',
    'onglaze',
    'raku',
    'pit',
    'sagga',
    'salt'
  ]

  return allTypes.filter(ftype => !invalidBool(ftype, kiln, true)).map(ftype => html`<li>${ucFirst(ftype)}</li>`)
}

export const singleKiln = (kiln, user, eHandler) => {

}

export const editKiln = (kiln, user, eHandler) => {

}

export const kilnListItem = (kiln, eHandler) => {
  return html`
    <a href="/kilns/${kiln.id}" id="${kiln.id}-${viewActions.SET}-kiln" class="kiln-item item-list__link" @click=${eHandler} title="View full details of &ldquo;${kiln.name}&rdquo; firing kiln">
      <h2 class="item-link__name">
        ${kiln.name}
      </h2>
      <p class="item-link__sub-name">
        <span class="sr-only">
          Type:
        </span>
        ${kiln.brand} - ${kiln.model}
      </p>
      <p class="item-link__type">
        <span class="sr-only">
          Fuel:
        </span>
        ${ucFirst(kiln.fuel)}
      </p>
      <p class="item-link__max">
        <span class="sr-only">
          Maximum temperature:
        </span>
        ${getDeg(kiln.maxTemp)}
      </p>
      <p class="kiln-item__size">
        <span class="sr-only">
          Packing area:
        </span>
        ${getLen(kiln.width)} (w) &times;
        ${getLen(kiln.depth)} (d) &times;
        ${getLen(kiln.height)} (h)
      </p>
      <!-- SVG -->
    </a>`
  // <div class="kiln-item__firing">
  //   <span class="sr-only">
  //     Firing types:
  //   </span>
  //   <ul class="list-inline">${listFiringTypes(kiln)}</ul>
  // </div>
}
