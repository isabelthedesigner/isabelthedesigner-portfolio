import SongPlayer from '@/components/ui/SongPlayer'
import NavLink from '@/components/ui/NavLink'

export default function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-[1440px] flex-col gap-48 p-24 md:px-24 md:py-24">
      <div className="flex w-full flex-col items-start gap-48 md:flex-row md:flex-wrap md:justify-between">
        <div className="flex flex-col items-start gap-24">
          <NavLink href="mailto:hi@isabelthedesigner.com">
            hi@isabelthedesigner.com
          </NavLink>
          <NavLink
            href="https://www.linkedin.com/in/isabelmramos"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin
          </NavLink>
          <NavLink
            href="https://bsky.app/profile/isabelthedesigner.bsky.social"
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
