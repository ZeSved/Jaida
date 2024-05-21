'use client'

import { Dispatch, RefObject, SetStateAction } from "react"
import { replacements } from "./replacements"

export function handleKeyboard(
  e: Event & KeyboardEvent,
  ref: RefObject<HTMLDivElement>,
  setCurrentRow: Dispatch<SetStateAction<number>>,
  currentRow: number) {
  if (!ref) return

  if (/^[a-zA-Z]$/.test(e.key) && !ref.current!.hasChildNodes()) {
    e.preventDefault()
    ref.current!.innerHTML += `<div id='row-${ref.current!.childNodes.length}'>${e.key}</div>`

    if (ref.current!.childNodes.length === 0) {
      newRange(ref, currentRow, setCurrentRow, 'initial')
    }

  }

  if (e.key === ' ') {
    for (let i = 0; i < replacements.length; i++) {
      const rep = replacements[i]

      if (!rep.active) continue
      const newString = ref.current!.innerHTML!.replace(
        new RegExp(rep.replaceWith, 'gi'),
        rep.options ? rep.options.find((t) => t.active === true)!.text : rep.option
      )
      ref.current!.innerHTML = newString
    }

    newRange(ref, currentRow, setCurrentRow,)
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    ref.current!.innerHTML += `<div id='row-${ref.current!.childNodes.length}'>${'\n'}</div>`
    newRange(ref, currentRow, setCurrentRow, 'enter')
  }

  if (
    e.key === 'Backspace' &&
    ref.current!.childNodes[1] === undefined &&
    ref.current!.childNodes[0].textContent?.length === 0
  ) {
    e.preventDefault()
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault()
    newRange(ref, currentRow, setCurrentRow, 'up')
  }
}

function newRange(ref: RefObject<HTMLDivElement>, currentRow: number, setCurrentRow: Dispatch<SetStateAction<number>>, arg?: Action) {
  if (window.getSelection()) {
    const range = document.createRange()
    const selection = window.getSelection()!

    const newRow = ref.current!.childNodes.length - 1
    const focusedDiv = arg === 'up' ? selection.focusNode!.parentNode!.parentNode! : selection.focusNode!

    console.log('start')
    console.log(selection.focusNode!.parentNode!.parentNode!)
    console.log(selection.focusNode!.parentNode!)
    console.log(selection.focusNode!)
    console.log('end')

    const elem = ref.current!.childNodes[arg === 'up' ? Array.from(focusedDiv.childNodes).indexOf(selection.focusNode! as ChildNode) - 1 : newRow] as Node
    // const elem = ref.current!.childNodes[arg === 'up' ? parseInt((selection.focusNode! as HTMLDivElement).id.slice(0, 4)) - 1 : newRow] as Node
    // : selection.focusNode!.childNodes[newRow]
    // selection.focusNode!.childNodes[
    // 	arg === 'initial' ? 0 : arg === 'enter' ? newRow + 1 : newRow
    // ]
    range.setStart(elem, arg === 'up' ? 0 : 1)
    range.collapse(true)

    console.log(currentRow)

    selection!.removeAllRanges()
    selection!.addRange(range)
    ref.current!.focus()

    if (arg === 'enter') {
      setCurrentRow(5)
    }
  }
}

export type Action = 'initial' | 'enter' | 'up' | 'down' | undefined