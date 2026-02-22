import SongPlayer from '@/components/ui/SongPlayer'
import NavLink from '@/components/ui/NavLink'

export default function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-6 py-12 md:px-120 md:py-12">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:flex-wrap">
        <div className="flex items-start flex-col gap-6">
          <NavLink href="mailto:hi@isabelthedesigner.com">
            hi@isabelthedesigner.com
          </NavLink>
          <NavLink
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin
          </NavLink>
          <NavLink
            href="https://bsky.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            bluesky
          </NavLink>
        </div>
        <SongPlayer />
      </div>
      <p className="text-title-default text-content-default">
        &copy; 2026 isabelthedesigner. All rights reserved.
      </p>
    </footer>
  )
}
