import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const urlObj = new URL(request.url);
    const url = urlObj.searchParams.get('url');
    if (!url) {
        return NextResponse.json({ error: 'Missing url' }, { status: 400 });
    }

    try {
        const { default: axios } = await import('axios');
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
                'Referer': 'https://www.linkedin.com/'
            },
            timeout: 60000,
        });

        const contentType = (response.headers && (response.headers['content-type'] as string)) || 'image/png';
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const dataUrl = `data:${contentType};base64,${base64}`;
        return NextResponse.json({ dataUrl, contentType });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}


