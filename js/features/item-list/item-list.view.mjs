import { html } from '../../vendor/lit-html/lit-html.mjs'
import { isNonEmptyStr } from "../../utilities/validation.mjs"

export const getItemList = (items, label, extraClass, wrapClass) => {
  const extra = isNonEmptyStr(extraClass)
    ? extraClass
    : ''
  const ok = (extra !== '')
  const extraP = (ok) ? ' ' + extra + '__label' : ''
  const extraUl = (ok) ? ' ' + extra + '__list' : ''
  const extraLi = (ok) ? ' ' + extra + '__item' : ''
  const wrap = (isNonEmptyStr(wrapClass)) ? ' ' + wrapClass : ''
  console.group('listPrograms()')

  console.log('getItemList:', getItemList)
  console.log('items:', items)
  console.log('label:', label)
  console.log('extraClass:', extraClass)
  console.log('wrapClass:', wrapClass)
  console.log('extraP:', extraP)
  console.log('extraUl:', extraUl)
  console.log('extraLi:', extraLi)
  console.groupEnd()

  return html`
    ${isNonEmptyStr(label) ? html`<p class="${extraP}">label</p>` : ''}
    <ul class="item-list${extraUl}${wrap}">
      ${items.map((item) => {
        return html`
          <li class="item-list__item${extraLi}">
            ${item}
          </li>`
      })}
    </ul>
  `
}
