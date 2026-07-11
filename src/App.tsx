import { cn } from "clsx-for-tailwind";
import { useRef, useState, type PropsWithChildren } from "react";
import { XzReadableStream } from "xz-decompress";

function App() {
    const [fileText, setFileText] = useState<string>("");
    const [ytLinkListPrefix, setYtLinkListPrefix] = useState("");
    let playlistData: {
        title: string;
        songs: Song[];
        createdDate: string;
    } = { title: "", songs: [], createdDate: "Unknown" };
    let songs: Song[] = [];
    let formattedCreationDate = "Unknown";
    try {
        playlistData = JSON.parse(fileText);
        songs = playlistData["songs"] ?? [];
        formattedCreationDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(Date.parse(playlistData.createdDate)) ?? "Unknown";
    } catch (e) {
        console.error(e);
    }
    const youtubeLinks = Array(Math.ceil(songs.length / 50))
        .fill(0)
        .map(
            (_, i) =>
                `https://youtube.com/watch_videos?video_ids=${songs
                    .slice(i * 50, (i + 1) * 50)
                    .map((song) => song.id)
                    .join(",")}`,
        );

    return (
        <div className="flex flex-col items-center w-full min-h-dvh font-body text-amber-950 bg-amber-100 px-4">
            <div className="pt-16 pb-8 flex flex-col gap-4 md:w-9/12 lg:w-6/12">
                <h1 className="text-4xl font-semibold text-center">
                    Demus Converter
                </h1>
                <p className="indent-4">
                    This is a converter for the iOS app{" "}
                    <Link href="https://apps.apple.com/us/app/demus-easy-music-streaming/id6474685600">
                        Demus
                    </Link>
                    , a song streaming platform. The playlist file format Demus
                    uses (.playlist file extension) is an xz-compressed JSON
                    file, and this website allows you to view the contents of
                    one and convert it to a YouTube playlist link. This tool is
                    free,{" "}
                    <Link href="https://github.com/hydrogenmacro/demus-converter">
                        open source
                    </Link>
                    , and works completely in your browser.
                </p>
            </div>
            <div className="flex flex-col py-4 gap-4 items-stretch w-full md:w-9/12 lg:w-6/12">
                <h2 className="text-2xl">Upload your .playlist file here:</h2>
                <input
                    type="file"
                    accept=".playlist"
                    onChange={async (ev) => {
                        if (!ev.target.files) {
                            alert("Error: no file provided")
                            return;
                        }
                        const file = ev.target.files[0];
                        
                        const xzStream = new XzReadableStream(file.stream());
                        let stream = xzStream.pipeThrough(
                            // @ts-ignore
                            new TextDecoderStream("utf-8"),
                        );
                        let reader = stream.getReader();
                        let text = "";
                        while (true) {
                            let { value, done } = await reader.read();
                            if (done) break;
                            text += value;
                        }
                        setFileText(text);
                    }}
                    className="file:p-2 file:bg-amber-200 file:rounded-lg file:border-amber-400 file:border-2"
                ></input>
                <h2 className="text-2xl">Playlist data:</h2>
                <textarea
                    className="bg-amber-200 border-amber-400 border-2 p-2"
                    rows={10}
                    value={fileText}
                    // @ts-ignore
                    onInput={(ev) => setFileText(ev.target!.value)}
                ></textarea>
                <h2 className="text-3xl py-4">Preview your playlist:</h2>
                <h3 className="text-2xl py-4">{playlistData.title}</h3>
                <div className="h-80 flex flex-col items-stretch overflow-x-hidden overflow-y-scroll">
                    {songs.map((song, i) => (
                        <SongEntry song={song} key={i} row={i}></SongEntry>
                    ))}
                </div>
                <div className="flex">
                    Created on {formattedCreationDate} - {songs.length} items - {" "}
                    {formatDuration(
                        songs.reduce((acc, song) => acc + song.duration, 0),
                    )}
                </div>
                <h2 className="pt-4 text-3xl">
                    Your generated playlists are here:
                </h2>
                <p className="pb-4">Note: Youtube does not support adding anonymous playlists; see the <Link newPage={false} href="#additonal-resources">additional resources</Link> below for options to save.</p>
                <div className="flex flex-col">
                    {youtubeLinks.map((youtubeLink, i) => (
                        <Link href={youtubeLink}>
                            YouTube {youtubeLinks.length === 1 ? "" : i}
                        </Link>
                    ))}
                </div>
                <h2 className="py-4 text-3xl">
                    Youtube links:
                </h2>
                <div className="flex gap-2">
                    <label>Prefix: </label>
                    <select className="bg-amber-200 border-amber-400 border-2" onChange={(ev) => setYtLinkListPrefix(ev.target.value)}>
                        <option value={""}>None</option>
                        <option value={"https://youtu.be"} selected>https://youtu.be</option>
                        <option value={"https://youtube.com/watch?v="}>https://youtube.com/watch?v=</option>
                    </select>
                </div>
                
                <textarea
                    className="bg-amber-200 border-amber-300 border-2 p-2"
                    rows={10}
                    value={songs.map((song) => ytLinkListPrefix + song.id).join("\n")}
                    readOnly
                ></textarea>
                <h2 id="additonal-resources" className="py-4 text-3xl">
                    Additional Resources
                </h2>
                <p>
                    <Link href="https://github.com/yt-dlp/yt-dlp">yt-dlp</Link> - Useful for programatically downloading videos. Look into the --batch-file flag for bulk downloading.<br/>
                    <Link href="https://chromewebstore.google.com/detail/multiselect-for-youtube/gpgbiinpmelaihndlegbgfkmnpofgfei?hl=en">Multiselect Extension</Link> - A Chrome extension I found that supports adding videos from text files: just save the list of youtube links without any prefix to a text file and upload it to the extension.<br/>
                    <Link href="https://github.com/HydrogenMacro/demus-converter/blob/scripts/autodownload.js">autodownload script</Link> - A custom script to paste into devtools for bulk adding to a Youtube playlist on desktop. This is not recommended for use; I made this before I discovered the extension above, which works much better.<br/>
                    <br/>If none of these options work, then you may have to manually add the videos to your playlist.                 
                </p>
            </div>
        </div>
    );
}
interface Song {
    artistName: string;
    artwork: string;
    id: string;
    title: string;
    duration: number;
}
function SongEntry({ song, row }: { song: Song; row: number }) {
    const artworkImgEl = useRef<HTMLImageElement>(null!);
    const [artworkIsLetterboxed, setArtworkIsLetterboxed] = useState(
        song.artwork.includes("i.ytimg.com"),
    );
    return (
        <div
            className={cn(
                "h-16 max-w-full flex items-stretch justify-between",
                row % 2 === 1 && "bg-amber-200",
            )}
        >
            <div className="flex flex-4 p-2 gap-2 min-w-0">
                <div className="h-full flex-none aspect-square overflow-hidden rounded-sm">
                    <img
                        ref={artworkImgEl}
                        src={song.artwork}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className={cn(
                            "h-full aspect-square object-cover",
                            artworkIsLetterboxed && "scale-145",
                        )}
                        onLoad={() => {
                            setArtworkIsLetterboxed(
                                song.artwork.includes("i.ytimg.com") &&
                                    artworkImgEl.current.naturalHeight < 720,
                            );
                        }}
                        onError={() => {
                            setTimeout(() => {
                                //artworkImgEl.current.src = song.artwork + "?t=" + Date.now();
                            }, 5000);
                        }}
                    />
                </div>
                <div className="shrink flex-col min-w-0">
                    <div className="overflow-hidden whitespace-nowrap text-ellipsis max-w-full text-lg leading-5.5">
                        {song.title}
                    </div>
                    <div className="overflow-hidden whitespace-nowrap text-ellipsis max-w-full text-sm text-amber-800/80">
                        {song.artistName}
                    </div>
                </div>
            </div>

            <div className="flex-1 min-w-0 flex justify-end items-center p-4">
                {formatDuration(song.duration)}
            </div>
        </div>
    );
}
function Link({ href, children, newPage = true }: PropsWithChildren<{ href: string, newPage?: boolean }>) {
    return (
        <a
            href={href}
            target={newPage ? "_blank" : ""}
            className="underline text-amber-600 hover:text-amber-500"
        >
            {children}
        </a>
    );
}
function formatDuration(secs: number): string {
    let minsAndSecs = `${Math.floor((secs / 60) % 60)
        .toString()
        .padStart(2, "0")}:${Math.floor(secs % 60)
        .toString()
        .padStart(2, "0")}`;
    return secs > 60 * 60
        ? `${Math.floor(secs / (60 * 60))}:${minsAndSecs}`
        : minsAndSecs;
}
export default App;
