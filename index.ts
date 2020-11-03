import fetch from 'node-fetch'
import { join, resolve } from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { parse, URLSearchParams } from 'url'

const dir = process.argv[3]

interface Token {
    access_token: string
}

interface Track {
    album: {
        images: { url: string }[]
    },
    artists: { name: string }[]
    name: string
}

class CoverDownload {
    private readonly id: string
    private readonly secret: string
    private data = new URLSearchParams()
    private file: string

    public constructor(id: string, secret: string) {
        this.data.append('grant_type', 'client_credentials')

        if (!id || !secret) {
            throw new Error('Missing credentials')
        }

        this.id = id
        this.secret = secret
        this.download()
    }

    private async download(): Promise<void> {
        const res: Track = await (await fetch(this.url, {
            headers: {
                'Authorization': `Bearer ${(await this.token()).access_token}`
            }
        })).json()

        const name = `${res.artists[0].name} | ${res.name}.jpg`

        if (dir) {
            this.file = join(dir, name)
        } else {
            this.file = resolve(await this.default(), name)
        }

        const data = await (await fetch(res.album.images[0].url, {
            method: 'GET'
        })).buffer()

        writeFile(this.file, data)
        console.log(`Saved to ${this.file}`)
    }

    private async token(): Promise<Token> {
        const auth = Buffer.from(`${this.id}:${this.secret}`).toString('base64')

        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`
            },
            body: this.data
        })

        if (res.ok) {
            return await res.json()
        }

        throw new Error(`[${res.status}]: ${res.statusText}`)
    }

    private get url(): string {
        const parsed = parse(process.argv[2])

        if (/https?/.test(parsed.protocol)) {
            const type = parsed.path.split('/')[1]
            const songID = parsed.path.split('/')[2]

            return `https://api.spotify.com/v1/${type}s/${songID}`
        }

        throw new Error('Failed to build url')
    }

    private async default(): Promise<string> {
        const dir = `${process.cwd()}/Covers` 
        await mkdir(dir).catch(() => {})

        return dir
    }
}

new CoverDownload(process.env.CLIENT_ID, process.env.CLIENT_SECRET)