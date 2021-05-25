import { html } from '../../vendor/lit-html/lit-html.mjs'
import { isBoolTrue, isNonEmptyStr, invalidBool } from '../../utilities/validation.mjs'
import { idSafe } from '../../utilities/sanitisation.mjs'

export const getNavItem = (label, href, id, actionType, eHandler, active, extraClass) => {
  const _active = isBoolTrue(active) ? ' nav-bar__link--active' : ''
  const extra = isNonEmptyStr(extraClass) ? ' ' + extraClass + '__' : ''
  const extraLi = (extra !== '') ? extra + 'item' : ''
  const extraA = (extra !== '') ? extra + 'link' : ''
  const _id = isNonEmptyStr(id) ? id : ''
  const _actionType = isNonEmptyStr(actionType) ? actionType : ''
  const __id = (_id === '' && _actionType === '') ? idSafe(href) : _id + '-' + _actionType

  // console.group('getNavItem()')
  // console.log('extraLi:', extraLi)
  // console.log('href:', href)
  // console.log('id:', id)
  // console.log('actionType:', actionType)
  // console.log('_active:', _active)
  // console.log('extraA:', extraA)
  // console.log('eHandler:', eHandler)
  // console.log('label:', label)
  // console.groupEnd()

  return html`<li class="nav-bar__item${extraLi}"><a href="${href}${(_id !== '') ? '/' + _id : ''}" id="${__id}" class="nav-bar__link${_active}${extraA}" @click=${eHandler}>${label}</a></li>`
}

export const getNavBar = (linkList, eHandler, extraClass, wrapClass) => {
  const extra = isNonEmptyStr(extraClass) ? extraClass : ''
  const extraNav = (extra !== '') ? ' ' + extra : ''
  const extraUl = (extra !== '') ? ' ' + extra + '__' + 'list' : ''
  const wrap = isNonEmptyStr(wrapClass) ? ' ' + wrapClass : ''

  return html`
    <nav class="nav-bar${wrap}${extraNav}">
      <ul class="nav-bar__list${extraUl}">
        ${linkList.map(link => getNavItem(
          link.label,
          link.path,
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
