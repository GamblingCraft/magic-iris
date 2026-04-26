const WORKSHOP_PREFIX_PATTERN = /(?:стоимость:\s*)?1\s*час\s*\(1\s*мастер\)\s*[—-]\s*/giu

export const formatDisplayPrice = (value?: string) => {
  if (!value) {
    return ''
  }

  return value
    .replace(WORKSHOP_PREFIX_PATTERN, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export const extractPriceAmount = (value?: string) => {
  const normalized = formatDisplayPrice(value)

  if (!normalized) {
    return ''
  }

  const fromMatch = normalized.match(/от\s*([\d\s]+)(?=\s*(?:₽|руб))/iu)

  if (fromMatch?.[1]) {
    return fromMatch[1].replace(/\s+/g, '')
  }

  const currencyMatch = normalized.match(/([\d\s]+)(?=\s*(?:₽|руб))/iu)

  if (currencyMatch?.[1]) {
    return currencyMatch[1].replace(/\s+/g, '')
  }

  return ''
}
