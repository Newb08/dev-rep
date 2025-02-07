import fs from 'node:fs';
import { EventEmitter } from 'node:events';

const eventEmitter = new EventEmitter();
const path = './Modules';
const file = './folderLogs.txt';

console.log(`Watching for file changes in: ${path}`);
console.log("Press 'q' to stop the watcher and exit.");


let previousFiles;
try {
    previousFiles = new Set(fs.readdirSync(path));
} catch (err) {
    console.error(`Error reading directory '${path}':`, err);
    process.exit(1);
}


const watcher = fs.watch(path, (eventName, fileName) => {
    try {
        if (!fileName) return;

        let time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
        let logData = '';
        let currentFiles;
        
        try {
            currentFiles = new Set(fs.readdirSync(path));
        } catch (err) {
            console.error(`Error reading directory during event: ${err}`);
            return;
        }

        if (eventName === 'change') {
            logData = `${fileName} was modified on ${time}\n`;
        } 
        else if (eventName === 'rename') {
            if (currentFiles.size < previousFiles.size) {
                logData = `${fileName} was deleted on ${time}\n`;
            } 
            else if (!previousFiles.has(fileName) && currentFiles.has(fileName)) {
                logData = `${fileName} was created on ${time}\n`;
            } 
            else if (previousFiles.has(fileName) && !currentFiles.has(fileName)) {
                logData = `${fileName} was renamed to `;
            } 
            else {
                logData = `${fileName} on ${time}\n`;
            }
        }

        previousFiles = currentFiles;

        if (logData) {
            fs.appendFile(file, logData, (err) => {
                if (err) console.error('Error writing to log:', err);
                else console.log("Logs Saved");
            });
        }
    } catch (err) {
        console.error('Error processing file event:', err);
    }
});


process.stdin.setRawMode(true);
process.stdin.on('data', (key) => {
    try {
        if (key.toString().trim().toLowerCase() === 'q') eventEmitter.emit('stopWatcher');
    } catch (err) {
        console.error('Error processing key press:', err);
    }
});

eventEmitter.on('stopWatcher', () => {
    try {
        console.log("\nStopping the watcher...");
        watcher.close();
        process.exit(0);
    } catch (err) {
        console.error('Error stopping watcher:', err);
        process.exit(1);
    }
});
