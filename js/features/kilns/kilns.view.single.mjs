import { html } from '../../vendor/lit-html/lit-html.mjs'
import {
  // getHourMinSec,
  // getHHMMSS,
  ucFirst,
  auDateStr,
  boolYesNo,
  getDeg,
  getVol,
  // getRate,
  // roundMinutes,
  getLen
} from '../../utilities/sanitisation.mjs'
import {
  // isNonEmptyStr,
  invalidBool
} from '../../utilities/validation.mjs'
import { getNavBar } from '../nav-bar/nav-bar.view.mjs'
// import { programActions } from '../firing-programs/programs.state.actions.mjs'
import { viewActions } from '../mainApp/view.state.mjs'
import { getMainContent } from '../main-content/main-content.view.mjs'
import { kilnActions } from './kilns.state.actions.mjs'

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
  console.group('singleKiln()')
  const actionLinks = [{
    label: 'View programs',
    path: '/programs/byKilnID',
    id: kiln.id,
    action: kilnActions.UPDATE
  }, {
    label: (kiln.isWorking) ? 'Being repaired' : 'Repairs complete',
    path: '/kilns/not-working',
    id: kiln.id,
    action: kilnActions.TOGGLE_WORKING,
    isBtn: true
  }, {
    label: 'Edit',
    path: '/kilns/edit',
    id: kiln.id,
    action: kilnActions.UPDATE
  }, {
    label: 'Copy',
    path: '/kilns/copy',
    id: kiln.id,
    action: kilnActions.CLONE
  }, {
    label: 'Retire',
    path: '/kilns/delete',
    id: kiln.id,
    action: kilnActions.DELETE
  }]
  console.log('kilnActions:', kilnActions)
  console.log('kilnActions.TOGGLE_WORKING:', kilnActions.TOGGLE_WORKING)
  console.log('eHandler:', eHandler)

  console.groupEnd()
  return getMainContent(
    html`<h2>${kiln.name}</h2>`,
    html`
      <h3>Details</h3>

      <dl class="key-value content--bleed">
        <dt class="key-value__key">Brand</dt>
          <dd class="key-value__val">${kiln.brand}</dd>

        <dt class="key-value__key">Model</dt>
          <dd class="key-value__val">${kiln.model}</dd>

        <dt class="key-value__key">Fuel</dt>
          <dd class="key-value__val">${kiln.fuel}</dd>

        <dt class="key-value__key">Type</dt>
          <dd class="key-value__val">${kiln.type}</dd>

        <dt class="key-value__key">Max temp</dt>
          <dd class="key-value__val">${getDeg(kiln.maxTemp)}</dd>

        <dt class="key-value__key">Allowed firings</dt>
          <dd class="key-value__val"><ul class="basic-list">${listFiringTypes(kiln)}</ul></dd>

        <dt class="key-value__key">Packing dimensions</dt>
          <dd class="key-value__val">
            <dl class="basic-k-v">
              <dt class="basic-k-v__key">Width</dt>
                <dd class="basic-k-v__val">${getLen(kiln.width)}</dd>
              <dt class="basic-k-v__key">Depth</dt>
                <dd class="basic-k-v__val">${getLen(kiln.depth)}</dd>
              <dt class="basic-k-v__key">Height</dt>
                <dd class="basic-k-v__val">${getLen(kiln.height)}</dd>
              <dt class="basic-k-v__key">Total volume</dt>
                <dd class="basic-k-v__val">${getVol(kiln.width, kiln.depth, kiln.height)}&sup3;</dd>
            </dl>
          </dd>

        <dt class="key-value__key">Working</dt>
          <dd class="key-value__val">${boolYesNo(kiln.isWorking)}</dd>

        <dt class="key-value__key">In use</dt>
          <dd class="key-value__val">${boolYesNo(kiln.isInUse)}</dd>

        <dt class="key-value__key">Is hot</dt>
          <dd class="key-value__val">${boolYesNo(kiln.isHot)}</dd>

        <dt class="key-value__key">Firing count</dt>
          <dd class="key-value__val">${kiln.useCount}</dd>

        <dt class="key-value__key">Possible programs</dt>
          <dd class="key-value__val">${kiln.maxProgramID}</dd>

        <dt class="key-value__key">Installed</dt>
          <dd class="key-value__val">${auDateStr(kiln.installDate, true)}</dd>
      </dl>`,
    html`${getNavBar(actionLinks, eHandler)}`,
    'kiln'
  )
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
