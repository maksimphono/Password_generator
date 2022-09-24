
function randInt(a, b) {
    return 0 | (Math.random() * (b -a) + a);
}

const asciiChar = code => String.fromCharCode(code);

function randomLetter() {
    return [asciiChar(randInt(65, 90)), asciiChar(randInt(97, 122))][Math.round(Math.random())];
}
function randomNumber() {
    return randInt(0, 9);
}
function randomSym() {
    return [asciiChar(randInt(33, 46)), asciiChar(randInt(58, 63))][Math.round(Math.random())];
}

function generateRandomChar(args = [1, 1, 1]) {
    let result = [];
    let randIndx = 0;
    //let func = [];

    do {
        randIndx = randInt(0, 3);
        console.log("random Int:", randIndx);
    } while (!args[randIndx] && !args.every(v => !v));
    
    switch (randIndx) {
        case 0: return randomLetter();
        case 1: return randomNumber();
        case 2: return randomSym();
    }
}

function generatePassword(passwordLength, { passwordRangeSettings, defaultGenerate} = { passwordRangeSettings : undefined, defaultGenerate : true}) {
    const outputPassword = [];
    let generatedSymbols = [];
    let generatedSym = null;
    let indx = 0;
    let params = [0, 0, 0];

    if (defaultGenerate) {
        for (let i = 0; i < passwordLength; i++) {
            outputPassword.push(generateRandomChar());
        }
    } else if (!!passwordRangeSettings) {
        console.log("Generaete MIx fun");
        outputPassword.length = passwordLength;
        for (let name in passwordRangeSettings.names) {
            generatedSymbols.length = 0;
            for (let i = 0; i < passwordRangeSettings.names[name]; i++) {
                //gemerateRandom = {"number-range-let" : randomLetter, randomNumber, randomSym}[];
                switch (name) {
                    case "number-range-let": generatedSym = randomLetter(); break;
                    case "number-range-num": generatedSym = randomNumber(); break;
                    case "number-range-sym": generatedSym = randomSym(); break;
                }
                indx = randInt(0, passwordLength);
                while (outputPassword[indx]) {
                    indx = (indx + 1) % passwordLength;
                }
                outputPassword[indx] = generatedSym;
            }
        }
    } else {
        let names = ["Letter", "Number", "Symbol"];
                
        for (let char of $("#password-symbols-settings").children()) {
            params = [1, 1, 1];
            for (let i = 0; i < 3; i++) {
                if (!$(char).find(`input[name='${names[i]}']`).prop("checked")) {
                    params[i] = 0;
                }
            }
            
            outputPassword.push(generateRandomChar(params));
        }
    }
    return outputPassword;
}

export {generatePassword};
