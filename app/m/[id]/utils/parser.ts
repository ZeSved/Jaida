import { divId } from "./divId"

export function parser({ action, content }: Parser) {
  const divStartRegex = new RegExp(/<div id="row-\d+">/, 'g')
  const divEndRegex = new RegExp(/<\/div>/, 'g')

  if (action === 'POST-DB') {
    const newContent = content.split(divStartRegex).join('').split(divEndRegex)

    newContent.forEach(line => {
      if (divStartRegex.test(line) || divEndRegex.test(line) || line === '') {
        newContent.splice(newContent.indexOf(line), 1)
      }
    })

    return newContent
    // .replace(new RegExp(/(<span\s+style="font-weight:\s*bold;">|<\/span>)/, 'g'), '*')
    // .replace(new RegExp(/(<\/h1>|<\/h2>|<\/h3>|<\/h4>|<\/h5>|<\/h6>|)/), '')
  }

  if (action === 'GET-DB') {
    const newContent = content

    content.map((con, i) => {
      if (con === '\n') {
        con = `<div id='${divId()}-${i}'><span> </span></div>`
      } else {
        // const subContent = con.split(' ').map((subCon, j) => {})
        // for (let j = 0; j < subContent.length; j++) {
        //   subContent[j] = `<span>${content[j]}</span>`
        // }

        // content[i] = `<div id='${divId()}-${i}'><span>${subContent.join('')}</span></div>`
      }
    })

    for (let i = 0; i < content.length; i++) {
      if (content[i] === '\n') {
        content[i] = `<div id='${divId()}'><span> </span></div>`
      } else {
        const subContent = content[i].split(' ')
        for (let j = 0; j < subContent.length; j++) {
          subContent[j] = `<span>${content[j]}</span>`
        }

        content[i] = `<div id='${divId()}'><span>${subContent.join('')}</span></div>`
      }
    }

    return newContent.join('')
  }
}

type Parser = {
  action: 'POST-DB'
  content: string
} | {
  action: 'GET-DB'
  content: string[]
}