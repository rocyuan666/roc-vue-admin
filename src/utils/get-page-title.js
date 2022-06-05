import defaultSettings from '@/config/settings'

const title = defaultSettings.title || 'Roc Vue Admin'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
