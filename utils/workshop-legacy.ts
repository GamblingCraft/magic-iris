const PROCESS_SIZE_TOKEN_RE = /\bA\d(?:,\s*A\d)*\b/gu
const PROCESS_BREAK_RE = /\s+(?=(?:[A-ZА-ЯЁ][a-zа-яё]|[A-ZА-ЯЁ]\s+[a-zа-яё]{2,}))/gu
const LEGACY_DO_PARTICIPANTS_RE =
  /\s+(?=(?:\u0414\u043e|\u0434\u043e)\s+\d+\s+\u0443\u0447\u0430\u0441\u0442)/gu
const LEGACY_PRICE_DEPENDS_RE =
  /\s+(?=\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c\s+\u0437\u0430\u0432\u0438\u0441\u0438\u0442)/gu
const LEGACY_CAN_BE_BRANDED_RE =
  /\s+(?=\u0412\u043e\u0437\u043c\u043e\u0436\u043d\u043e\s+\u0438\u0437\u0433\u043e\u0442\u043e\u0432\u043b\u0435\u043d\u0438\u0435)/gu

const normalizeLineSpaces = (value: string) =>
  value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')

const protectProcessSizeTokens = (value: string) => {
  const tokens: string[] = []
  const text = value.replace(PROCESS_SIZE_TOKEN_RE, (match) => {
    const token = `__PROCESS_SIZE_TOKEN_${tokens.length}__`
    tokens.push(match)
    return token
  })

  return {
    text,
    restore(input: string) {
      return tokens.reduce(
        (result, tokenValue, index) =>
          result.replaceAll(`__PROCESS_SIZE_TOKEN_${index}__`, tokenValue),
        input
      )
    }
  }
}

export const normalizeWorkshopProcessText = (value?: string) => {
  const source = normalizeLineSpaces(value || '')

  if (!source) {
    return ''
  }

  const protectedText = protectProcessSizeTokens(source)
  const withBreaks = protectedText.text
    .split('\n')
    .map((line) => line.replace(PROCESS_BREAK_RE, '\n'))
    .join('\n')
    .replace(/\n{2,}/g, '\n')
    .trim()

  return protectedText.restore(withBreaks)
}

export const splitWorkshopProcessItems = (value?: string) =>
  normalizeWorkshopProcessText(value)
    .split('\n')
    .map((line) => line.replace(/^[•\-–—*]\s*/u, '').trim())
    .filter(Boolean)

export const normalizeWorkshopLegacyMultilineText = (value?: string) =>
  normalizeLineSpaces(value || '')
    .replace(LEGACY_DO_PARTICIPANTS_RE, '\n')
    .replace(LEGACY_PRICE_DEPENDS_RE, '\n')
    .replace(LEGACY_CAN_BE_BRANDED_RE, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim()
