// @unocss-include

export interface SocialLink {
  /** Key used to pick a subset for a given surface. */
  key: string
  /** Visible text. Not always the platform name (email shows the address). */
  label: string
  url: string
  icon: string
}

// Single source for every off-site personal link. Before this existed as the
// real source, the same URLs were retyped in four components and drifted; add
// or change a link here and every surface follows.
export const socials = [
  { key: 'discord', label: 'Discord', url: 'https://discordapp.com/users/150232517264408577', icon: 'i-carbon-logo-discord' },
  { key: 'telegram', label: 'Telegram', url: 'https://t.me/RazorSiM', icon: 'i-mdi-telegram' },
  { key: 'twitter', label: 'Twitter / X', url: 'https://twitter.com/Razor_SiM', icon: 'i-carbon-logo-twitter' },
  { key: 'email', label: 'me@raz.wtf', url: 'mailto:me@raz.wtf', icon: 'i-mdi-email' },
  { key: 'github', label: 'GitHub', url: 'https://github.com/RazorSiM', icon: 'i-carbon-logo-github' },
] as const satisfies readonly SocialLink[]

export type SocialKey = typeof socials[number]['key']

/**
 * The links for one surface, in the order given. Unknown keys throw at call
 * time rather than silently rendering nothing.
 */
export function pickSocials(...keys: SocialKey[]): SocialLink[] {
  return keys.map((k) => {
    const found = socials.find(s => s.key === k)
    if (!found)
      throw new Error(`Unknown social key: ${k}`)
    return found
  })
}

/** The four-chip row used on the homepage, the about page and post bylines. */
export const CHIP_SOCIALS = pickSocials('discord', 'telegram', 'twitter', 'email')

/** The about page adds GitHub to the same row. */
export const ABOUT_SOCIALS = pickSocials('discord', 'telegram', 'twitter', 'email', 'github')

/** The contact address, for "say hello" CTAs that aren't part of a chip row. */
export const EMAIL_URL = pickSocials('email')[0]!.url

/** mailto: links must not get target=_blank / rel=noopener. */
export function isExternal(url: string) {
  return url.startsWith('http')
}
