import { RefObject } from "react";

export class Caret {
  static up() {

  }

  static down() {

  }

  static backspace(ref: Ref) {
    if (!ref.current) return

    const firstRow = document.getElementById('r0')

    if (!firstRow) {
      this.newLine(ref)
      return
    }

    if (firstRow.innerHTML === '<br>') {
      const span = document.createElement('span')
      const span_span = document.createElement('span')
      const span_span_br = document.createElement('br')

      span_span.appendChild(span_span_br)
      span.appendChild(span_span)
      firstRow.appendChild(span)

      this.updateIds(ref.current)

      // firstRow.innerHTML = "<span><span id='r0_0'><br /></span></span>"

      this.moveCaret(firstRow, ref)
    }

  }

  static space(ref: Ref, currentRow: number) {
    const elm = document.getElementById(`r${currentRow}`)!.childNodes[0]

    const span = document.createElement('span')
    const text_placeholder = document.createTextNode('')

    span.appendChild(text_placeholder)
    elm.appendChild(span)

    this.moveCaret(span, ref)
    this.updateIds(ref.current!)
  }

  static enter(ref: Ref, currentRow: number) {
    if (!ref.current) return

    this.newLine(ref)

    this.updateIds(ref.current)

    this.moveCaret(document.getElementById(`r${currentRow + 1}_0`)!, ref)
    return currentRow + 1
  }

  static updateIds(divList: HTMLDivElement) {
    const divArray = divList.children

    for (let i = 0; i < divArray.length; i++) {
      divArray[i].id = `r${i}`

      const divContent = divArray[i].childNodes[0].childNodes

      for (let j = 0; j < divContent.length; j++) {
        (divContent[j] as HTMLSpanElement).id = `r${i}_${j}`
      }
    }
  }

  static moveCaret(elem: HTMLSpanElement, ref: Ref) {
    const range = document.createRange()
    const selection = window.getSelection()!

    range.setStart(elem, 0)
    range.collapse(true)

    selection!.removeAllRanges()
    selection!.addRange(range)
    ref.current!.focus()
  }

  static newLine(ref: Ref) {
    if (!ref.current) return

    const div = document.createElement('div')
    const div_span = document.createElement('span')
    const div_span_span = document.createElement('span')
    const div_span_span_br = document.createElement('br')

    div_span_span.appendChild(div_span_span_br)
    div_span.appendChild(div_span_span)
    div.appendChild(div_span)
    ref.current.appendChild(div)

    this.updateIds(ref.current)
  }
}

type Ref = RefObject<HTMLDivElement>