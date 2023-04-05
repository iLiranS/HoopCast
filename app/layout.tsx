import Header from '@/src/components/Header/Header'
import './globals.css'

export const metadata = {
  title: 'HoopCast - Home',
  description: 'HoopCast , predict and watch results of NBA matches , Live scores!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
       
       <Header/>

        <main className='mt-12 min-h-[calc(100dvh-48px)] bg-primary dark:bg-primary_dark dark:text-white transition-colors'>
        {children}
        </main>
        <div id='cover'></div>
      </body>

    </html>
  )
}
