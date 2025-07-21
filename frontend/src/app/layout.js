export const metadata = {
  title: 'SwiftRide - Hybrid Trip Planner',
  description: 'Plan your optimal trip combining scooter and public transport',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">SwiftRide</h1>
              <p className="text-sm">Hybrid Trip Planner</p>
            </div>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
            SwiftRide © {new Date().getFullYear()} - Plan smarter trips
          </footer>
        </div>
      </body>
    </html>
  )
} 