// create an API endpoint that returns a PDF link
import { NextRequest, NextResponse } from "next/server";
import axios from "axios"
import {load} from "cheerio"

export async function POST(req: NextRequest) {
    const {url} = await req.json()

    if(!url) {
        return NextResponse.json({error: "Url is required"}, {status: 400})
    }

    try {
        const {data} = await axios.get(url)
        const $ = load(data)

        // search for the script tag that contains the flipbook url
        const scriptTag = $("script").toArray()
        let pdfLink: string | null = null 

        scriptTag.forEach((script) => {
            const content = $(script).html()
            if(content && content.includes("cdnc.heyzine.com/files/uploaded/")) {
                const match = content.match( 
                    /(https:\/\/cdnc\.heyzine\.com\/files\/uploaded\/[^\s'",]+)/,
                )
                if (match && match[1]) {
                    pdfLink = match[1]
                }
            }
        })

        if (pdfLink) {
            return NextResponse.json({pdfLink})
        } else {
            return NextResponse.json( 
                { error: "PDF link not found on this page."}, 
                { status: 404 },
            )
        }
    } catch(error) {
        return NextResponse.json( 
            {error: "Failed to fetch the page content."}, 
            { status: 500}
        )
    }
}