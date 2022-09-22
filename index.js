function generateRandomSymbol(args) {
    return 0;
}

function generatePassword({ passwordRangeSettings, defaultGenerate} = { passwordRangeSettings : undefined, defaultGenerate : true}) {
    const outputPassword = [];
    
    if (defaultGenerate) {
        for (let i = 0; i < passwordLength; i++) {
            return 0;
        }
    }
    
}

// ***

function submitForm(btn) {
    const form = btn.form;
    
    console.log(btn.name);
    console.log(btn.form);
    if (btn.name === "password-number-symbols-setttings") {
        generatePassword({ passwordRangeSettings : passwordRangeSettings, defaultGenerate : false});
    } else {
        generatePassword({ passwordRangeSettings : undefined, defaultGenerate : false});
    }
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