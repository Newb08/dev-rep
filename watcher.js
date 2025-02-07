import fs from 'node:fs'
// import myMod from './myModule.js'

const path='./Modules'
const startTime=Date.now();
console.log(`Watching for file changes in: ${path}`);
const file='./folderLogs'
// let timeout

fs.watch(path, (eventName, fileName)=>{
    // if (fileName) {
    //     setTimeout(() => {
            // console.log(`Event: ${eventName}, File: ${fileName}, Time: ${Date.now() - startTime}`);
    //     }, 100); }
        if(eventName === 'change'){
            let time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })
            let data = `${fileName} was modified on ${time}\n`
            fs.appendFile(file, data, (err)=>{
                if(err)
                    console.error(err)
                console.log("Logs Saved");
            })
        }
        else if((eventName === 'rename')){
            let time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })
            let data = `${fileName} was created on ${time}\n`
            if(fs.existsSync(fileName)){
                fs.appendFile(file, data, (err)=>{
                    if(err)
                        console.error(err)
                    console.log("Logs Saved");
                })
            }
            else{
                data = `${fileName} was deleted on ${time}\n`
                fs.appendFile(file, data, (err)=>{
                    if(err)
                        console.error(err)
                    console.log("Logs Saved");
                })
            }
        }
    }
);
