export function parser({ action, content }: Parser) {
  if (action === 'POST-DB') {
    const newContent = content
      .replaceAll('<\/div><div>', '|')
      .replaceAll('<\/span><span>', '')
      .replaceAll('<span>', '')
      .replaceAll('<\/span>', '')
      .replaceAll('<div>', '')
      .replaceAll('<\/div>', '')
      .split('|')

    return newContent
  }

  if (action === 'GET-DB') {
    // for (let i = 0; i < content.length; i++) {
    //   const innerContent = content[i].replaceAll('&nbsp;', ' &nbsp;').split(' ')

    //   for (let j = 0; j < innerContent.length; j++) {
    //     innerContent[j] = `<span>${innerContent[j]}</span>`
    //   }

    //   content[i] = `<div><span>${innerContent.join(' ')}</span></div>`
    // }

    // return content.join(' ')

    return content.map((con) => {
      return `<div><span>${con.split(' ').map((c) => {
        return `<span>${c}</span>`
      }).join(' ')}</span></div>`
    }).join('')
  }
}

type Parser = {
  action: 'POST-DB'
  content: string
} | {
  action: 'GET-DB'
  content: string[]
}