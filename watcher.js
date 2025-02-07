import fs from 'node:fs';
import readline from 'node:readline';
import { EventEmitter } from 'node:events';

const eventEmitter = new EventEmitter();
const path='./Modules'

console.log(`Watching for file changes in: ${path}`);
console.log("Press 'q' to stop the watcher and exit.");

const file='./folderLogs.txt'

let previousFiles = new Set(fs.readdirSync(path));

const watcher = fs.watch(path, (eventName, fileName)=>{
    if(!fileName) return;

    let time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
    let fullPath = path + '/' + fileName;
    let logData = '';
    let currentFiles = new Set(fs.readdirSync(path));

    if (eventName === 'change') {
        logData = `${fileName} was modified on ${time}\n`;
    } 
    else if (eventName === 'rename') {
        if(currentFiles.size<previousFiles.size){
            logData=`${fileName} was deleted on ${time}\n`
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

    previousFiles=currentFiles

    if (logData) {
        fs.appendFile(file, logData, (err) => {
            if (err) console.error('Error writing to log:', err);
            else console.log("Logs Saved");
        });
    }
});


process.stdin.setRawMode(true);
process.stdin.on('data', (key) => {
    const input = key.toString().trim().toLowerCase();

    if (input === 'q') {
        eventEmitter.emit('stopWatcher');
    }
});


eventEmitter.on('stopWatcher', () => {
    console.log("\nStopping the watcher...");
    
    watcher.close();
    process.exit(0);
});
