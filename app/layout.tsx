import type React from "react"
export const metadata = {
  title: "Волонтер - Антикоррупционное движение РК",
  description: "Мобильное приложение для волонтеров антикоррупционного движения Республики Казахстан",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}


import './globals.css'