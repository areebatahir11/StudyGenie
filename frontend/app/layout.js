import '../src/styles/globals.css'

export const metadata = {
  title: 'StudyGenie',
  description: 'AI Powered Study Assistant',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen font-sans">
        {children}
      </body>
    </html>
  )
}