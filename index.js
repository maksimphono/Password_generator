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

function generatePassword({ passwordRangeSettings, defaultGenerate} = { passwordRangeSettings : undefined, defaultGenerate : true}) {
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
        //console.log($($("#password-symbols-settings")).find(`input[name="Number"]`));
                
        for (let char of $("#password-symbols-settings").children()) {
            params = [1, 1, 1];
            for (let i = 0; i < 3; i++) {
                if (!$(char).find(`input[name='${names[i]}']`).prop("checked")) {
                    params[i] = 0;
                }
            }
            //console.log(params);
            
            outputPassword.push(generateRandomChar(params));
        }
    }
    return outputPassword;
}

// ***

function submitForm(btn) {
    const form = btn.form;
    let outputPassword = "";

    console.log(btn.name);
    console.log(btn.form);
    
    // complete \/
    
    if (0){//btn.name === "password-number-symbols-setttings") {
        console.log("generate mix");
        outputPassword = generatePassword({ passwordRangeSettings : passwordRangeSettings, defaultGenerate : false});
    } else {
        outputPassword = generatePassword({ passwordRangeSettings : undefined, defaultGenerate : false});
        console.log(outputPassword);
    }
    $("#password-output").text(outputPassword.join(''));
    return 0;
};

const PASSWORD_MIN_LEN = 4;
let passwordLength = 4;
let passwordSymbolDivHTML = $("#password-symbols-settings").clone().html();
let passwordRangeSettings = { names : {"number-range-let" : 0, "number-range-num" : 0, "number-range-sym" : 0}, sum : 0};
const passwordSymbolsSetting = [];
let lastActiveField = undefined;

function inputSum(name = "number-range-let") {
    let sum = 0;
    for (let i in passwordRangeSettings.names) {
        sum += +passwordRangeSettings.names[i];
    }
    passwordRangeSettings.sum = sum;
    return sum;
}

function setInputsValues() {
    const $fields = $("#password-number-symbols-setttings");
    const sliderClassName = "slider-fill-";
    let rangeValue = 0;
    let $range = null;

    for (let name in passwordRangeSettings.names) {
        rangeValue = passwordRangeSettings.names[name];
        $fields.find(`input[name=${name}]`).val(rangeValue);
        $range = $($fields.find(`input[name=${name}][type=range]`));
        $range[0] && $range.attr("class", $range.attr("class").replace(/slider-fill-\d+/, sliderClassName + (0 | ((rangeValue) * 100 / (passwordLength)))));
    }
}

function sliderMove(_this) {
    const $this = $(_this);
    let $thisVal = $this.val();
    const sliderClassName = "slider-fill-";
    let sliderElem = null;
    
    //lastActiveField = "#password-number-symbols-setttings";
    passwordRangeSettings.names[_this.name] = +$thisVal;
    inputSum();
    
    if (passwordRangeSettings.sum > passwordLength) {
        for (let name in passwordRangeSettings.names) {
            if (_this.name !== name) {
                passwordRangeSettings.names[name] -= Math.min((passwordRangeSettings.sum - passwordLength), passwordRangeSettings.names[name]);
                if (inputSum() === passwordLength) {break;}
            }
        }
    }
    console.table(passwordRangeSettings.names);
    console.log("Summa:", passwordRangeSettings.sum);
    
    setInputsValues();
};

function changePasswordLength(_this) {
    passwordLength = $(_this).val();

    console.log("Password length: ", passwordLength);
    $("#password-number-symbols-setttings").find("input").each((i, item) => { 
        $(item).attr("max", passwordLength);
        $(item).val(0);
        sliderMove(item);
    });
    $("#password-number-symbols-setttings *:first-child").find("input").each((i, item) => {
        $(item).val(passwordLength);
        sliderMove(item);
    });
    clonePasswordSymbolsHTMLElements(passwordLength);
};

function clonePasswordSymbolsHTMLElements(passwordLength = PASSWORD_MIN_LEN) {
    const symbolsNumber = $("#password-symbols-settings").children().length;
    
    for (let _ = 0; _ < symbolsNumber - passwordLength; _++) {
        $("#password-symbols-settings > *:first-child").remove();
        //passwordSymbolsSetting.length = symbolsNumber;
    }
    for (let _ = 0; _ < passwordLength - symbolsNumber; _++) {
        $("#password-symbols-settings").append(passwordSymbolDivHTML);
    }
}

$(document).ready(() => {
    $("button[type=submit]").click(function (e) {
        e.preventDefault();
        submitForm(this);
    });
    $("button[title='Settings']").click(function (e) {
        e.preventDefault();
        $("#additional-form").toggle();
    });
    $("#additional-form").toggle();
    $("button[title='Settings']").tooltip();
    $("#password-length-field").tooltip();
    /*
    position: {
        my: "center top",
        at: "center bottom+5",
      }
      */

    clonePasswordSymbolsHTMLElements();
});