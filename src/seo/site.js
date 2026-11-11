export const SITE = {
  name: 'HappiTrack',
  url: 'https://www.happitrack.com',
  defaultTitle: 'HappiTrack | Track your mood, sleep and stress and find calm',
  defaultDescription:
    'HappiTrack is a private mood, sleep and stress tracker with an encrypted journal, guided breathing exercises and a kind AI companion. Start free for 3 days.',
  ogImage: '',
  ogImageAlt: 'HappiTrack – track your mood, sleep and stress',
  twitterHandle: '',
  language: 'en',
  locale: 'en_US',
  logo: 'https://www.happitrack.com/logo.png'
}

export function absoluteUrl(path = '/') {
  return path === '/' ? `${SITE.url}/` : `${SITE.url}${path}`
}
