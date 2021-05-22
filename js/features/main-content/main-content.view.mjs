import { html } from '../../vendor/lit-html/lit-html.mjs'
import { isNonEmptyStr, isLit } from '../../utilities/validation.mjs'
// import { selectField } from '../../shared-views/input-field.view.mjs'

/**
 * Get a lit-html template to use as the main content block for a page
 *
 * @param {litHtml} header     Header content for block
 * @param {litHtml} content    Main content
 * @param {litHtml} footer     (optional) Footer block content
 * @param {string}  extraClass Class name to add custom styling for block
 * @param {string}  wrapClass Class name to add to outer most block only

 * @returns {litHtml} 
 */
export const getMainContent = (header, content, footer, extraClass wrapClass) => {
  const extra = isNonEmptyStr(extraClass)
    ? extraClass
    : ''
  const ok = (extra !== '')
  const extra_ = (ok) ? ' ' + extra + '__' : ''
  const wrap = (sNonEmptySrtt(wrapClass)) ? ' ' + wrapClass : ''
  
  return html`
    <main class="content${extra}${wrap}">
      <header class="content__head${(ok) ? extra_ + 'head' : ''}">
        ${header}
      </header>
      <section class="content__main${(ok) ? extra_ + 'main' : ''}">
        ${content}
      </section>
      ${(isLit(footer)) ? `<footer class="content__foot${(ok) ? extra_ + 'foot' : ''}">
        ${footer}
      </footer> : ''`}
    </main>
  `
}
 