import { Context, log } from "@microsoft/mixed-reality-extension-sdk";
import Ffmpeg from 'fluent-ffmpeg';
import RtspServer from 'rtsp-streaming-server';
import Stream from 'stream';
import UUID from 'uuid/v4';

class OutputStream extends Stream.Writable {
    _write(chunk: Uint8Array, encoding: any, cb: any) {
        log.debug("app", `writing some bytes`);
        cb();
    }
}

export class StreamingVideoApp {
    private videoStream: Ffmpeg.FfmpegCommand;
    private outputStream: OutputStream;

    constructor(private context: Context, private mediaServer: RtspServer) {
        this.context.onStarted(() => this.onStarted());
    }

    private onStarted() {
        this.outputStream = new OutputStream();
        this.videoStream = Ffmpeg()
            .input('video=USB Camera')
            .inputFormat('dshow')
            .outputOptions('-c:v', 'copy', '-f', 'rtsp', `rtsp://127.0.0.1:5554/webcam`);
        this.videoStream.run();
    }
}
