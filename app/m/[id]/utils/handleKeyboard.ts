'use client'

import { Dispatch, RefObject, SetStateAction } from "react"
import { replacements } from "./replacements"

export function handleKeyboard(
  e: Event & KeyboardEvent,
  ref: RefObject<HTMLDivElement>,
  currentRow: number,
  setCurrentRow: Dispatch<SetStateAction<number>>) {
  if (!ref) return

  if (/^[a-zA-Z]$/.test(e.key) && !ref.current!.hasChildNodes()) {
    e.preventDefault()
    ref.current!.innerHTML += `<div id='row-${ref.current!.childNodes.length}'>${e.key}</div>`

    if (ref.current!.childNodes.length === 0) {
      newRange(ref, 'initial')
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

    console.log(currentRow)
    newRange(ref)
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    ref.current!.innerHTML += `<div id='row-${ref.current!.childNodes.length}'>${'\n'}</div>`
    setCurrentRow((c) => c + 1)
    newRange(ref, 'enter')
  }

  if (
    e.key === 'Backspace' &&
    ref.current!.childNodes[1] === undefined &&
    ref.current!.childNodes[0].textContent?.length === 0
  ) {
    e.preventDefault()
  }

  if (e.key === 'ArrowUp') {
    newRange(ref, 'up')
  }
}

function newRange(ref: RefObject<HTMLDivElement>, arg?: Action, updatedRow?: number) {
  if (window.getSelection()) {
    const range = document.createRange()
    const selection = window.getSelection()!

    const newRow = ref.current!.childNodes.length - 1

    const elem = updatedRow
      ? selection.focusNode!.parentNode!.parentNode!.childNodes[newRow]
      : selection.focusNode!.childNodes[newRow]
    // selection.focusNode!.childNodes[
    // 	arg === 'initial' ? 0 : arg === 'enter' ? newRow + 1 : newRow
    // ]
    range.setStart(elem, updatedRow ? 0 : 1)
    range.collapse(true)

    selection!.removeAllRanges()
    selection!.addRange(range)
    ref.current!.focus()
  }
}

export type Action = 'initial' | 'enter' | 'up' | 'down' | undefined