import React from "react"

export function parser({ action, content }: Parser) {
  if (action === 'POST-DB') {
    const newContent: string[] = []

    Array.from(content).forEach(con => {
      let text = ''

      con.childNodes[0].childNodes.forEach(c => {
        text += ` ${c.textContent}`
      })

      newContent.push(text.trim())
    })

    return newContent
  }

  if (action === 'GET-DB') {
    // for (let i = 0; i < content.length; i++) {
    //   const innerContent = content[i].replaceAll('&nbsp;', 'g'), ' &nbsp;').split(' ')

    //   for (let j = 0; j < innerContent.length; j++) {
    //     innerContent[j] = `<span>${innerContent[j]}</span>`
    //   }

    //   content[i] = `<div><span>${innerContent.join(' ')}</span></div>`
    // }

    // return content.join(' ')

    if (content.length === 1 && content[0].length === 0) {
      // const div = document.createElement('div')
      // const div_span = document.createElement('span')
      // const div_span_span = document.createElement('span')
      // const div_span_span_br = document.createElement('br')

      // div.id = 'r0'
      // div_span_span.id = 'r0_0'

      // div_span_span.appendChild(div_span_span_br)
      // div_span.appendChild(div_span_span)
      // div.appendChild(div_span)

      return `<div id='r0'><span><span id='r0_0'><br /></span></span></div>`
    } else {
      return content.map((con, i) => {
        return `<div id='r${i}'><span>${con.split(' ').map((c, j) => {
          return `<span id='r${i}_${j}'>${c}</span>`
        }).join(' ')}</span></div>`
      }).join('')
    }

  }
}

type Parser = {
  action: 'POST-DB'
  content: HTMLCollection
} | {
  action: 'GET-DB'
  content: string[]
}