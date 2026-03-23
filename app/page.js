'use client'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Charger la landing depuis le fichier statique
    fetch('/alma-co-landing.html')
      .then(r => r.text())
      .then(html => {
        document.open()
        document.write(html)
        document.close()
      })
  }, [])

  return null
}
