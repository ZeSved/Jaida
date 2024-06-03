import { RefObject } from "react";

export class Caret {
  static up() {

  }

  static down() {

  }

  static backspace(ref: RefObject<HTMLDivElement>) {
    if (!ref.current) return

    const firstRow = document.getElementById('r0')

    if (!firstRow) {
      ref.current.innerHTML += '<div><span><span><br /></span></span></div>'
      this.updateIds(ref.current)
      return
    }

    if (firstRow.innerHTML === '<br>') {
      firstRow.innerHTML = "<span><span id='r0_0'><br /></span></span>"

      this.moveCaret(firstRow, ref)
    }

  }

  static space() {

  }

  static enter(ref: RefObject<HTMLDivElement>, currentRow: number) {
    if (!ref.current) return

    ref.current.innerHTML += '<div><span><span><br /></span></span></div>'

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

  static moveCaret(elem: HTMLSpanElement, ref: RefObject<HTMLDivElement>) {
    const range = document.createRange()
    const selection = window.getSelection()!

    range.setStart(elem, 0)
    range.collapse(true)

    selection!.removeAllRanges()
    selection!.addRange(range)
    ref.current!.focus()
  }
}