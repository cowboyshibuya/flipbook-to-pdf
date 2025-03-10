'use client'

import React, { useState } from "react"

export default function Home() {
  const [url, setUrl] = useState('')
  const [pdfLink, setPdfLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPdfLink('')
    setError('')

    try {
      const res = await fetch('/api/get-pdf-link', {
        method:"POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({url})
      })

      const data = await res.json()

      if(data.pdfLink) {
        setPdfLink(data.pdfLink)
      } else {
        setError(data.error || "PDF link not found.")
      }
    } catch(err) {
      setError("An error occured.")
    } finally {
      setLoading(false)
    }
  }


  return ( 
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Flipbook 2 PDF</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="url"
          placeholder="Enter Flipbook URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border rounded px-4 py-2 w-full mb-4 mt-4"
          required
        />
        <button
          type="submit"
          className="bg-white text-black px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Convert to PDF"}
        </button>
      </form>


      {pdfLink && ( 
        <div className="mt-4">
          <a 
            href={pdfLink}
            className="text-green-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  )
}