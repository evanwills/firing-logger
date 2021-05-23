import { selectField, textInputField, numberInputField } from '../../shared-views/input-field.view.mjs'
import { html } from '../../vendor/lit-html/lit-html.mjs'
import { getMainContent } from '../main-content/main-content.view.mjs'
import { programActions } from './programs.state.actions.mjs'
import { getItemList } from '../item-list/item-list.view.mjs'
import {
  // invalidString,
  invalidBool
} from '../../utilities/validation.mjs'
import { getHourMinSec } from '../../utilities/sanitisation.mjs'

const kilnsToOptions = (id) => (kiln) => {
  return {
    value: kiln.id,
    label: kiln.name,
    selected: (kiln.id === id)
  }
}

const getFiringTypes = (kiln, programType) => {
  const types = [{
    value: 'bisque',
    label: 'Bisque'
  }, {
    value: 'glaze',
    label: 'Glaze'
  }, {
    value: 'single',
    label: 'Single firing (Bisque & glaze in one)'
  }, {
    value: 'luster',
    label: 'Luster'
  }, {
    value: 'onglaze',
    label: 'Onglaze'
  }]

  // console.group('editProgram()')
  // console.log('kiln:', kiln)
  // console.log('programType:', programType)
  // console.log('types:', types)
  // console.groupEnd()

  return types.filter(fType => !invalidBool(fType.value, kiln, true)).map(fType => {
    return {
      ...fType,
      selected: (fType.value === programType)
    }
  })
}

export const editProgram = (program, kilns, user, eHandler) => {
  const name = (program.name === '') ? 'New (unamed) program' : program.name

  console.group('editProgram()')
  console.log('program:', program)
  console.log('kilns:', kilns)

  const fields = [
    textInputField({
      id: 'name-' + programActions.TMP_UPDATE_FIELD,
      required: true,
      label: 'Program name',
      change: eHandler,
      value: program.name
    }),
    textInputField({
      id: 'description-' + programActions.TMP_UPDATE_FIELD,
      required: true,
      label: 'Description',
      change: eHandler,
      value: program.description
    }, true)
  ]

  const kilns_ = (program.mode === programActions.ADD)
    ? kilns.filter(kiln => !kiln.retired)
    : kilns.filter(kiln => kiln.id === program.kilnID)

  fields.push(selectField({
    id: 'kilnID-' + programActions.TMP_UPDATE_FIELD,
    required: true,
    label: 'Kiln',
    eventHandler: eHandler,
    options: [
      {
        value: '',
        label: ' -- Select a kiln --',
        selected: false
      },
      ...kilns_.map(kilnsToOptions(program.kilnID))
    ]
  }))
  console.log('program.kilnID:', program.kilnID)

  if (program.kilnID !== '') {
    fields.push(selectField({
      id: 'type-' + programActions.TMP_UPDATE_FIELD,
      required: true,
      label: 'Firing type',
      eventHandler: eHandler,
      options: [
        {
          value: '',
          label: ' -- Select a firing type --',
          selected: false
        },
        ...getFiringTypes(kilns_[0], program.type)
      ]
    }))
    fields.push(
      textInputField({
        id: 'maxTemp',
        readonly: true,
        label: 'Maximum temperature',
        value: program.maxTemp
      })
    )
    fields.push(
      textInputField({
        id: 'duration',
        readonly: true,
        label: 'Firing duration',
        value: getHourMinSec(program.duration)
      })
    )
  }

  console.groupEnd()

  return getMainContent(
    html`<h2>${name}</h2>`,
    getItemList(fields, '', 'input-fields', 'content--bleed')
  )
}
