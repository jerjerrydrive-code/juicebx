const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.m4a': 'audio/mp4',
    '.mp3': 'audio/mpeg'
};

// High-speed persistent HTTPS agent
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50, keepAliveMsecs: 30000 });

// In-Memory Search Cache (TTL: 10 minutes)
const searchCache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

function getCached(key) {
    const item = searchCache.get(key.toLowerCase().trim());
    if (item && (Date.now() - item.ts < CACHE_TTL)) {
        return item.data;
    }
    return null;
}

function setCache(key, data) {
    if (searchCache.size > 200) {
        const oldest = searchCache.keys().next().value;
        searchCache.delete(oldest);
    }
    searchCache.set(key.toLowerCase().trim(), { ts: Date.now(), data });
}

// Direct YouTube search — scrapes ytInitialData from search results page
function searchYouTube(query, isAlbum = false) {
    const cached = getCached(query + (isAlbum ? '_album' : ''));
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve, reject) => {
        const spParam = isAlbum ? 'EgIQAw%3D%3D' : 'EgIQAQ%3D%3D'; // EgIQAw is playlist/album, EgIQAQ is video
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=${spParam}`;
        
        https.get(searchUrl, {
            agent: httpsAgent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const match = data.match(/var ytInitialData = ({.*?});<\/script>/s);
                    if (!match) {
                        reject(new Error('Could not find ytInitialData'));
                        return;
                    }
                    const json = JSON.parse(match[1]);
                    const sections = json?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
                    const items = sections[0]?.itemSectionRenderer?.contents || [];
                    const videos = items
                        .filter(item => item.videoRenderer)
                        .map(item => {
                            const vr = item.videoRenderer;
                            const videoId = vr.videoId;
                            const title = vr.title?.runs?.map(r => r.text).join('') || vr.title?.simpleText || '';
                            const author = vr.ownerText?.runs?.[0]?.text || vr.shortBylineText?.runs?.[0]?.text || 'Unknown Artist';
                            
                            // Extract explicit duration string
                            let duration = vr.lengthText?.simpleText;
                            if (!duration && Array.isArray(vr.thumbnailOverlays)) {
                                for (const overlay of vr.thumbnailOverlays) {
                                    const overlayText = overlay.thumbnailOverlayTimeStatusRenderer?.text?.simpleText;
                                    if (overlayText) { duration = overlayText; break; }
                                }
                            }

                            // If no duration text or video is a live stream / badge, reject
                            if (!duration) return null;

                            // If duration has hours (e.g. "1:20:30" or contains "SHORTS" or "LIVE"), reject
                            const durationParts = duration.trim().split(':');
                            if (durationParts.length !== 2) return null; // Reject 1:00:00 (hours) or weird formats

                            const minutes = parseInt(durationParts[0], 10);
                            const secs = parseInt(durationParts[1], 10);
                            if (isNaN(minutes) || isNaN(secs)) return null;

                            const totalSeconds = minutes * 60 + secs;

                            // Strictly require songs to be between 40 seconds and 480 seconds (8 minutes)
                            if (!isAlbum && (totalSeconds < 40 || totalSeconds > 480)) return null;

                            const thumb = vr.thumbnail?.thumbnails?.pop()?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

                            return {
                                id: videoId,
                                title: title,
                                artist: author,
                                duration: duration,
                                seconds: totalSeconds,
                                thumb: thumb.startsWith('//') ? 'https:' + thumb : thumb
                            };
                        })
                        .filter(Boolean)
                        .filter(track => {
                            if (isAlbum) return true;
                            
                            // Filter out long compilation/mix/livestream keywords
                            const lowerTitle = track.title.toLowerCase();
                            const badKeywords = [
                                '1 hour', '2 hour', '3 hour', '4 hour', '10 hour', '10 hours', 
                                '1 hr', '2 hr', 'non-stop', 'compilation', 'full album', 
                                'playlist', 'dj set', 'podcast', 'livestream', 'live stream', 
                                'continuous mix', 'megamix', 'best of mix', '100 songs'
                            ];
                            if (badKeywords.some(kw => lowerTitle.includes(kw))) return false;
                            
                            return true;
                        })
                        .slice(0, 25);

                    setCache(query + (isAlbum ? '_album' : ''), videos);
                    resolve(videos);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

const { JUICE_OFFICIAL_CATALOG, JUICE_VAULT_CATALOG } = require('./juice_catalogs');

// ═══ 80+ TRACK CATALOG AGGREGATOR FOR JUICE WRLD ═══
async function fetchJuiceCatalog(type) {
    const isOfficial = (type === 'official');
    const baseCatalog = isOfficial ? JUICE_OFFICIAL_CATALOG.map(t => ({ ...t })) : JUICE_VAULT_CATALOG.map(t => ({ ...t }));
    const cacheKey = isOfficial ? '__juice_official_80_catalog' : '__juice_vault_80_catalog';
    const cached = getCached(cacheKey);
    if (cached && cached.length >= 70) return cached;

    // Fast dynamic live augmentation
    try {
        const liveQuery = isOfficial 
            ? 'Juice WRLD official albums singles songs audio Goodbye Good Riddance Legends Never Die Death Race For Love' 
            : 'Juice WRLD unreleased leaks vault Rental Red Moonlight KTM Drip audio';
        const liveTracks = await searchYouTube(liveQuery);
        if (liveTracks && liveTracks.length > 0) {
            const seenIds = new Set(baseCatalog.map(t => t.id));
            for (const lt of liveTracks) {
                if (!seenIds.has(lt.id)) {
                    seenIds.add(lt.id);
                    baseCatalog.unshift(lt);
                }
            }
        }
    } catch(e) {
        console.warn('Live augmentation fallback used:', e.message);
    }

    setCache(cacheKey, baseCatalog);
    return baseCatalog;
}

const GENRE_MAP = {
    'Juice WRLD: Official Discography': 'Juice WRLD official albums singles songs audio Goodbye Good Riddance Legends Never Die Death Race For Love',
    'Juice WRLD: The Lost Vault': 'Juice WRLD unreleased leaks vault Rental Red Moonlight KTM Drip audio',
    'Juice WRLD: Official Radio': 'Juice WRLD official albums singles songs audio Goodbye Good Riddance Legends Never Die Death Race For Love',
    'Juice WRLD: Vault & Leaks Radio': 'Juice WRLD unreleased leaks vault Rental Red Moonlight KTM Drip audio',
    'Juice WRLD': 'Juice WRLD top hits songs audio',
    'Synthwave': 'Kavinsky The Midnight Gunship synthwave songs',
    'Ambient Chill': 'Tycho Brian Eno ambient chill songs',
    'Lo-Fi Hip Hop': 'ChilledCow lofi hip hop study songs',
    'Indie Rock': 'Arctic Monkeys Tame Impala indie rock songs',
    'Jazz Classics': 'Miles Davis John Coltrane jazz songs',
    'R&B Soul': 'Frank Ocean SZA Daniel Caesar rnb songs',
    'Electronic EDM': 'Daft Punk Avicii Disclosure electronic songs',
    'Pop Hits 2025': 'Dua Lipa Billie Eilish pop songs',
    'Popular': 'top popular music songs official audio'
};

const server = http.createServer(async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        // CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // ═══ API ROUTER ═══
        if (pathname === '/api/top') {
            try {
                const videos = await searchYouTube('popular songs music hits official audio');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(videos));
            } catch (err) {
                console.error('Top tracks error:', err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
            return;
        }

        // /api/search?q=...
        if (pathname === '/api/search') {
            const query = parsedUrl.query.q || '';
            if (!query.trim()) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify([]));
                return;
            }

            try {
                let videos = await searchYouTube(query);
                if (!videos || videos.length === 0) {
                    videos = await searchYouTube(`${query} songs official audio`);
                }
                if (!videos || videos.length === 0) {
                    videos = searchLocalFallback(query);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(videos || []));
            } catch (err) {
                console.error('Search error:', err.message);
                const localFallback = searchLocalFallback(query);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(localFallback));
            }
            return;
        }

// Local Fallback Catalog Search
let fallbackLibrary = [];
try {
    const catFile = path.join(__dirname, 'juice_catalogs.js');
    if (fs.existsSync(catFile)) {
        const content = fs.readFileSync(catFile, 'utf8');
        const match = content.match(/JUICE_CATALOGS\s*=\s*(\{[\s\S]*?\});/);
        if (match) {
            const obj = eval('(' + match[1] + ')');
            for (const k in obj) {
                if (Array.isArray(obj[k])) fallbackLibrary.push(...obj[k]);
            }
        }
    }
} catch(e) {}

function searchLocalFallback(query) {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/);
    return fallbackLibrary.filter(t => {
        const title = (t.title || '').toLowerCase();
        const artist = (t.artist || '').toLowerCase();
        return words.some(w => title.includes(w) || artist.includes(w));
    }).slice(0, 20);
}

// High-speed Lyrics Fetcher & Cache (LRCLIB Integration)
const lyricsCache = new Map();

function cleanQueryString(str) {
    if (!str) return '';
    return str
        .replace(/^[«“"'`]|['"”»`]$/g, '')
        .replace(/\(.*?\)/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/ft\.?.*$/i, '')
        .replace(/feat\.?.*$/i, '')
        .replace(/official (music )?video/gi, '')
        .replace(/official audio/gi, '')
        .replace(/lyric(s)? (video)?/gi, '')
        .replace(/audio/gi, '')
        .replace(/ - Topic$/i, '')
        .replace(/VEVO$/i, '')
        .replace(/["']/g, '')
        .trim();
}

function searchLyrics(rawTitle, rawArtist) {
    const title = cleanQueryString(rawTitle);
    const artist = cleanQueryString(rawArtist);
    const cacheKey = `${title}_${artist}`.toLowerCase();
    
    if (lyricsCache.has(cacheKey)) {
        return Promise.resolve(lyricsCache.get(cacheKey));
    }

    return new Promise(async (resolve) => {
        // 1. Try Juice WRLD Dedicated API (juicewrldapi.com) for Juice WRLD and Unreleased Grails
        const isJuice = (!artist || artist.toLowerCase().includes('juice') || title.toLowerCase().includes('juice'));
        if (isJuice && title) {
            try {
                const jwUrl = `https://juicewrldapi.com/juicewrld/songs/?search=${encodeURIComponent(title)}`;
                const jwRes = await new Promise((resSolve) => {
                    https.get(jwUrl, {
                        agent: httpsAgent,
                        headers: {
                            'User-Agent': 'JuiceBx-App/2.0 (AudioDeck)',
                            'Accept': 'application/json'
                        }
                    }, (res) => {
                        let data = '';
                        res.on('data', chunk => data += chunk);
                        res.on('end', () => {
                            try {
                                const j = JSON.parse(data);
                                if (j && j.results && j.results.length > 0) {
                                    // Find exact or best match
                                    const match = j.results.find(r => r.synced_lyrics || r.lyrics) || j.results[0];
                                    if (match && (match.synced_lyrics || match.lyrics)) {
                                        resSolve({
                                            syncedLyrics: match.synced_lyrics || null,
                                            plainLyrics: match.lyrics || null,
                                            trackName: match.name,
                                            artistName: 'Juice WRLD',
                                            era: match.era?.name || null
                                        });
                                        return;
                                    }
                                }
                            } catch(e) {}
                            resSolve(null);
                        });
                    }).on('error', () => resSolve(null));
                });

                if (jwRes && (jwRes.syncedLyrics || jwRes.plainLyrics)) {
                    lyricsCache.set(cacheKey, jwRes);
                    resolve(jwRes);
                    return;
                }
            } catch(e) {
                console.warn("[Lyrics] juicewrldapi.com fallback:", e.message);
            }
        }

        // 2. Standard Universal Fallback: LRCLIB (Global Music Library)
        const query = `${artist} ${title}`.trim();
        const lrclibUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`;

        https.get(lrclibUrl, {
            agent: httpsAgent,
            headers: {
                'User-Agent': 'JuiceBx-App/2.0 (AudioDeck)',
                'Accept': 'application/json'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const list = JSON.parse(data);
                    if (Array.isArray(list) && list.length > 0) {
                        const best = list.find(item => item.syncedLyrics) || list[0];
                        const result = {
                            syncedLyrics: best.syncedLyrics || null,
                            plainLyrics: best.plainLyrics || null,
                            trackName: best.trackName,
                            artistName: best.artistName,
                            duration: best.duration
                        };
                        lyricsCache.set(cacheKey, result);
                        resolve(result);
                        return;
                    }
                } catch (e) {}
                resolve(null);
            });
        }).on('error', () => resolve(null));
    });
}

        // /api/lyrics?track=...&artist=... — Synced Lyrics Endpoint
        if (pathname === '/api/lyrics') {
            const track = parsedUrl.query.track || parsedUrl.query.q || '';
            const artist = parsedUrl.query.artist || '';
            
            try {
                const lyrics = await searchLyrics(track, artist);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(lyrics || { syncedLyrics: null, plainLyrics: null }));
            } catch (err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ syncedLyrics: null, plainLyrics: null }));
            }
            return;
        }

        // /api/juicewrld/radio — Instant 999 FM Direct Playable Radio Stream
        if (pathname === '/api/juicewrld/radio') {
            try {
                const jwData = await new Promise((resolve) => {
                    https.get('https://juicewrldapi.com/juicewrld/radio/random/', {
                        agent: httpsAgent,
                        headers: { 'User-Agent': 'JuiceBx-App/2.0' }
                    }, res => {
                        let d = '';
                        res.on('data', c => d += c);
                        res.on('end', () => {
                            try { resolve(JSON.parse(d)); } catch(e) { resolve(null); }
                        });
                    }).on('error', () => resolve(null));
                });

                if (jwData && jwData.song) {
                    const s = jwData.song;
                    const streamUrl = s.path ? `https://juicewrldapi.com/juicewrld/files/download/?path=${encodeURIComponent(s.path)}` : null;
                    const track = {
                        id: `jw_${s.id || s.public_id || Math.random().toString(36).slice(2, 8)}`,
                        title: s.name || jwData.title,
                        artist: 'Juice WRLD',
                        era: s.era?.name || s.era?.description || '999 Vault',
                        category: s.category || 'unreleased',
                        audioUrl: streamUrl,
                        syncedLyrics: s.synced_lyrics || null,
                        plainLyrics: s.lyrics || null,
                        duration: s.length || '3:30',
                        thumb: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
                        isDirectAudio: true
                    };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(track));
                    return;
                }
            } catch(err) {
                console.warn('JW Radio error:', err.message);
            }
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Could not fetch radio track' }));
            return;
        }

        // /api/juicewrld/search?q=... — Search all 2,700+ Juice WRLD songs with eras, producers & lyrics
        if (pathname === '/api/juicewrld/search') {
            const q = parsedUrl.query.q || '';
            const searchAll = parsedUrl.query.searchall || '';
            const lyricsQ = parsedUrl.query.lyrics || '';
            
            try {
                let targetUrl = 'https://juicewrldapi.com/juicewrld/songs/?page=1';
                if (q) targetUrl += `&search=${encodeURIComponent(q)}`;
                if (searchAll) targetUrl += `&searchall=${encodeURIComponent(searchAll)}`;
                if (lyricsQ) targetUrl += `&lyrics=${encodeURIComponent(lyricsQ)}`;

                const jwData = await new Promise((resolve) => {
                    https.get(targetUrl, {
                        agent: httpsAgent,
                        headers: { 'User-Agent': 'JuiceBx-App/2.0' }
                    }, res => {
                        let d = '';
                        res.on('data', c => d += c);
                        res.on('end', () => {
                            try { resolve(JSON.parse(d)); } catch(e) { resolve(null); }
                        });
                    }).on('error', () => resolve(null));
                });

                const rawResults = jwData?.results || [];
                const formatted = rawResults.map(s => {
                    const streamUrl = s.path ? `https://juicewrldapi.com/juicewrld/files/download/?path=${encodeURIComponent(s.path)}` : null;
                    return {
                        id: `jw_${s.id || s.public_id}`,
                        title: s.name,
                        artist: 'Juice WRLD',
                        era: s.era?.name || '',
                        category: s.category || '',
                        producers: s.producers || '',
                        duration: s.length || '3:30',
                        audioUrl: streamUrl,
                        syncedLyrics: s.synced_lyrics || null,
                        plainLyrics: s.lyrics || null,
                        thumb: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
                        isDirectAudio: true
                    };
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ count: jwData?.count || formatted.length, results: formatted }));
                return;
            } catch(err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
                return;
            }
        }

        // /api/artist?name=... — Artist popular songs and details
        if (pathname === '/api/artist') {
            const name = parsedUrl.query.name || '';
            if (!name.trim()) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ tracks: [], name }));
                return;
            }

            try {
                let tracks = [];
                if (name.toLowerCase().includes('juice')) {
                    tracks = await fetchJuiceCatalog('official');
                } else {
                    tracks = await searchYouTube(`${name} top songs audio`);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ name, tracks: tracks || [] }));
            } catch (err) {
                console.error('Artist search error:', err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
            return;
        }

        // /api/playlist?id=... — Dedicated Curated Playlists (80+ Songs)
        if (pathname === '/api/playlist') {
            const playlistId = parsedUrl.query.id || 'juice_official';
            const isVault = (playlistId === 'juice_vault' || playlistId === 'juice_unreleased' || playlistId.includes('vault'));
            const title = isVault ? 'Juice WRLD: The Lost Vault' : 'Juice WRLD: Official Discography';
            const subtitle = isVault ? 'Unreleased Grails, Studio Leaks & Rare Sessions' : 'All Studio Albums, Official Singles & Hits';
            
            try {
                let tracks = await fetchJuiceCatalog(isVault ? 'vault' : 'official');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ id: playlistId, title, subtitle, count: tracks.length, tracks }));
            } catch (err) {
                console.error('Playlist error:', err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
            return;
        }

        // /api/genre_radio?genre=... — Top Genre Radio with Dynamic Shuffle (80+ Songs for Juice WRLD)
        if (pathname === '/api/genre_radio') {
            const genre = parsedUrl.query.genre || 'Popular';
            try {
                let tracks = [];
                if (genre.includes('Official') || genre.includes('Discography')) {
                    tracks = await fetchJuiceCatalog('official');
                } else if (genre.includes('Vault') || genre.includes('Leaks') || genre.includes('Lost')) {
                    tracks = await fetchJuiceCatalog('vault');
                } else {
                    const targetQuery = GENRE_MAP[genre] || `${genre} popular songs official audio`;
                    tracks = await searchYouTube(targetQuery);
                    if (!tracks || tracks.length < 5) {
                        const fallbackTracks = await searchYouTube(`${genre} songs official audio`);
                        tracks = [...(tracks || []), ...(fallbackTracks || [])];
                    }
                }
                
                // Clone track objects
                tracks = tracks.map(t => ({ ...t }));

                // Distinct Fisher-Yates Random Shuffle
                for (let i = tracks.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ genre, count: tracks.length, tracks }));
            } catch (err) {
                console.error('Genre radio error:', err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
            return;
        }

        // Static file serving
        let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
        
        // Security check
        const normalized = path.normalize(filePath);
        if (!normalized.startsWith(__dirname)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });

    } catch (e) {
        console.error('Request handling error:', e);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`JuiceBx LAN server running on port ${PORT}`);
    // Pre-warm Juice WRLD 80+ track catalogs in background
    setTimeout(() => {
        fetchJuiceCatalog('official').then(tracks => {
            console.log(`[PRE-WARM] Loaded ${tracks.length} Juice WRLD Official tracks into memory.`);
        }).catch(e => console.warn('Pre-warm official failed:', e.message));
        
        fetchJuiceCatalog('vault').then(tracks => {
            console.log(`[PRE-WARM] Loaded ${tracks.length} Juice WRLD Vault grails into memory.`);
        }).catch(e => console.warn('Pre-warm vault failed:', e.message));
    }, 500);
});
