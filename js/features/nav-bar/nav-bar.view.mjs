import { html } from '../../vendor/lit-html/lit-html.mjs'
import { isBoolTrue, isNonEmptyStr, invalidBool } from '../../utilities/validation.mjs'

export const getNavItem = (label, href, id, actionType, eHandler, active, extraClass) => {
  const _active = isBoolTrue(active) ? ' nav-bar__link--active' : ''
  const extra = isNonEmptyStr(extraClass) ? ' ' + extraClass + '__' : ''
  const extraLi = (extra !== '') ? extra + 'item' : ''
  const extraA = (extra !== '') ? extra + 'link' : ''

  return html`<li class="nav-bar__item${extraLi}"><a href="${href}${isNonEmptyStr(id) ? '/' + id : ''}" id="${id}-${actionType}" class="nav-bar__link${_active}${_active}${extraA}" @click=${eHandler}>${label}</a></li>`
}

export const getNavBar = (linkList, eHandler, extraClass) => {
  const extra = isNonEmptyStr(extraClass) ? extraClass : ''
  const extraNav = (extra !== '') ? ' ' + extra : ''
  const extraUl = (extra !== '') ? ' ' + extra + '__' + 'list' : ''

  return html`
    <nav class="nav-bar${extraNav}">
      <ul class="nav-bar__list${extraUl}">
        ${linkList.map(link => getNavItem(
          link.label,
          link.href,
          link.id,
          link.action,
          eHandler,
          !invalidBool('active', link, true),
          extra
        ))}
      </ul>
    </nav>
  `
}
