import { html } from '../../vendor/lit-html/lit-html.mjs'

export const kilnsView = (props, eHandler, routes) => {
  const { route, ...subRoutes } = routes

  console.group('kilnsView()')
  console.log('route:', route)
  console.log('subRoutes:', subRoutes)
  console.groupEnd()

  return html`<section id="kilns" class="kilns">
    <h2>Kilns</h2>
  </section>`
}
