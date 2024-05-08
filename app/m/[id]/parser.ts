export function parser(action: 'HTML-MD' | 'MD-HTML', content: string) {
  const newContent = content

  if (action === 'HTML-MD') {
    newContent.replace(new RegExp(/(<span\s+style="font-weight:\s*bold;">|<\/span>)/, 'g'), '*')
  }
}