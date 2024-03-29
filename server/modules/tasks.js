const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database('public/sqlite/time.db');
const opener = require('opener');
const colors = require('colors');

const bash = require('./bash');
const timing = require('./timing');

let directoryPath;
let info;

class Tasks {
    run = () => {
        readDir();
        setInterval(readDir, 2000);
        bash.welcomeMessage(this.getPort());
        inizio();
        setInterval(inizio, 2000);
    }

    updateConfig = (newPath) => {
        console.log(newPath)
        let config = {
            path: newPath
        }
        let data = JSON.stringify(config);
        fs.writeFileSync("config.json", data);
    }

    deleteDB = () => {
        db.run(`DELETE FROM Piloti`, (err) => {
            if (err) throw err;
        });
    }

    getAll = () => {
        let directory = JSON.parse(fs.readFileSync('config.json'));
        return directory;
    }

    getPort = () => {
        let directory = JSON.parse(fs.readFileSync('config.json'));
        return directory.port;
    }

    getInfoValue = () => {
        if (info === undefined) {
            return ["Server", "Track"];
        }
        return [info.serverName, info.trackName];
    }

    readOpen = () => {
        let directory = JSON.parse(fs.readFileSync('config.json'));
        let value = directory.openBrowserOnStart;
        value == true ? opener(`http://localhost:${this.getPort()}`) : bash.settingsMessage();
    }

    readCredentials = () => {
        let directory = JSON.parse(fs.readFileSync('config.json'));
        return directory;
    }

    writeCredentials = (user, pass) => {
        let directory = JSON.parse(fs.readFileSync('config.json'));
        directory.user = user;
        directory.pass = pass;
        fs.writeFileSync('config.json', JSON.stringify(directory));
    }

    updatePath = (path) => {
        let directory = JSON.parse(fs.readFileSync('config.json'));
        directory.path = path;
        fs.writeFileSync('config.json', JSON.stringify(directory));
    }

    checkLogin = (user) => {
        let directory = JSON.parse(fs.readFileSync('config.json'));
        if(directory.user === user) {
            return true;
        } else {
            return false;
        }
    }
}

readDir = () => {
    let directory = JSON.parse(fs.readFileSync('config.json'));
    directoryPath = directory.path + "\\";
    directoryPath.toString();
}

inizio = () => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.log(colors.red('Unable to scan directory: ' + err));
        }
        if (files.length == 0) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------");
            return console.log(colors.red("Server not turned on or results feature not activated.Files not founded"));
        }
        files.forEach((file) => {
            if(file.indexOf(".json")>-1) {
                info = applicazione(file);
            }
        });
    });
}

applicazione = (fileName) => {
    let file = fs.readFileSync(directoryPath + "\\" + fileName)
    obj = (file.toString())
    obj = obj.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
    obj = obj.replace(/[\u0000-\u0019]+/g, "");
    obj = JSON.parse(obj);

    let i = 0;
    while (obj.sessionResult.leaderBoardLines[i] != undefined) {
        let pilota = obj.sessionResult.leaderBoardLines[i];
        let nome = pilota.currentDriver["firstName"];
        let cognome = pilota.currentDriver["lastName"];
        let idmacchina = pilota.car["carId"];
        let idmodello = pilota.car["carModel"];
        let secondi = timing.cercaTempoMigliore(idmacchina);
        let tempo = timing.calcolaMinuti(secondi);
        let settori = timing.cercaSettoriMigliori(idmacchina, secondi);
        if (tempo !== "0.000") {
            let settore1 = timing.calcolaSecondiSettori(settori[0]);
            let settore2 = timing.calcolaSecondiSettori(settori[1]);
            let settore3 = timing.calcolaSecondiSettori(settori[2]);
            let track = obj.trackName;
            let stringa = nome + ";" + cognome + ";" + tempo + ";" + track
            db.run(`INSERT INTO Piloti(nome,cognome,tempo,team,checkDuplicato,settore1,settore2,settore3) VALUES(?,?,?,?,?,?,?,?)`, [nome, cognome, tempo, idmodello, stringa, settore1, settore2, settore3], (err) => { });
        }
        i++;
    }
    return obj;
}

module.exports = new Tasks();












