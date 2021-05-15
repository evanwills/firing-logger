import { html } from '../../lit-html/lit-html.mjs'

expert const programListItem = (id, name, type, maxTemp, duration, SVG, isUsed) = {
  return html`
    <a href="#${id}", id="${id}-programs-view" class="program-item">
       <h2 class="program-item__name">
         ${name}
       </h2>
       <p class="program-item__type">
         ${type}
       </p>
       <p class="program-item__max">
         ${maxTemp}
       </p>
       <p class="program-item__time">
         ${duration}
       </p>
       <!-- SVG -->
     </a>
  `
}