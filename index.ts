import fetch from 'node-fetch';
import { join, resolve } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { parse, URLSearchParams } from 'url';

const dir = process.argv[3];

interface Token {
	access_token: string;
}

interface Track {
	album: {
		images: { url: string }[];
	};
	artists: { name: string }[];
	name: string;
}

void new (class CoverDownload {
	private file: string;

	public constructor(private readonly id: string, private readonly secret: string) {
		if (!id || !secret) {
			throw new Error('Missing credentials');
		}

		this.download();
	}

	private async download(): Promise<void> {
		const track: Track = await (
			await fetch(this.url, {
				headers: {
					Authorization: `Bearer ${await this.token()}`,
				},
			})
		).json();

		const filename = `${track.artists[0].name} | ${track.name}.jpg`;

		if (dir) {
			this.file = join(dir, filename);
		} else {
			this.file = resolve(await this.default(), filename);
		}

		writeFile(
			this.file,
			await (
				await fetch(track.album.images[0].url, {
					method: 'GET',
				})
			).buffer()
		);

		console.log(`Saved to ${this.file}`);
	}

	private async token(): Promise<Token> {
		const auth = Buffer.from(`${this.id}:${this.secret}`).toString('base64');

		const res = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${auth}`,
			},
			body: new URLSearchParams([['grant_type', 'client_credentials']]),
		});

		if (res.ok) {
			return (await res.json()).access_token;
		}

		throw new Error(`[${res.status}]: ${res.statusText}`);
	}

	private get url(): string {
		const parsed = parse(process.argv[2]);

		if (/https?/.test(parsed.protocol)) {
			const [type, id] = parsed.path.split('/');

			return `https://api.spotify.com/v1/${type}s/${id}`;
		}

		throw new Error('Failed to build url');
	}

	private async default(): Promise<string> {
		const dir = `${process.cwd()}/Covers`;
		await mkdir(dir).catch(() => {});

		return dir;
	}
})(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
