export default function LoggedOutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center gap-4 p-24">
      {children}
    </main>
  )
}
