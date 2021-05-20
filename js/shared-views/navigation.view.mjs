import { html } from '../vendor/lit-html/lit-html.mjs'
import { isBoolTrue, isNonEmptyStr } from '../utilities/validation.mjs'

/**
 * Get a navigation link button
 *
 * @param {string}   label      Link text user sees
 * @param {string}   href       Primary part of the link URL
 * @param {string}   id         ID of the item generating the link
 * @param {string}   actionType Action type the link is generating
 * @param {function} eHandler   Event handler function
 *
 * @returns {html}
 */
export const getLink = (label, href, id, actionType, eHandler, active, extraClass) => {
  const _active = isBoolTrue(active) ? ' action-nav__link--active' : ''
  const _extra = isNonEmptyStr(extraClass) ? ' ' + extraClass : ''

  return html`<a href="${href}${isNonEmptyStr(id) ? '/' + id : ''}" id="${id}-${actionType}" class="action-nav__link${_active}${_extra}" @click=${eHandler}>${label}</a>`
}
