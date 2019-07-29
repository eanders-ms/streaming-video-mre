import { log, WebHost } from '@microsoft/mixed-reality-extension-sdk';
import dotenv from 'dotenv';
import { resolve as resolvePath } from 'path';
import RtspServer from 'rtsp-streaming-server';
import { StreamingVideoApp } from './app';

// Read .env if file exists
dotenv.config();

process.on('uncaughtException', err => console.log('uncaughtException', err));
process.on('unhandledRejection', reason => console.log('unhandledRejection', reason));

log.enable('app');

// Start MRE server
const mreServer = new WebHost({
    // baseUrl: 'http://<ngrok-id>.ngrok.io',
    baseDir: resolvePath(__dirname, '../public')
});

// Start media server
const mediaServer = new RtspServer({
    serverPort: 5554,
    clientPort: 6554,
    rtpPortStart: 10000,
    rtpPortCount: 10000
});
mediaServer.start().catch();

// Handle new application sessions
mreServer.adapter.onConnection(context => new StreamingVideoApp(context, mediaServer));
