function submitPasswordForm(form) {
    return 0;
};

const PASSWORD_MIN_LEN = 4;
let passwordLength = 4;
let passwordSymbolDivHTML = $("#password-symbols-settings").clone().html();
let passwordNumbersSetting = { names : {"number-range-let" : 0, "number-range-num" : 0, "number-range-sym" : 0}, sum : 0};

function inputSum(name = "number-range-let") {
    let sum = 0;
    for (let i in passwordNumbersSetting.names) {
        sum += +passwordNumbersSetting.names[i];
    }
    passwordNumbersSetting.sum = sum;
    return sum;
}

function setInputsValues() {
    const $fields = $("#password-number-symbols-setttings");
    const sliderClassName = "slider-fill-";
    let rangeValue = 0;
    let $range = null;

    for (let name in passwordNumbersSetting.names) {
        rangeValue = passwordNumbersSetting.names[name];
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
    // error here \/
    
    //passwordNumbersSetting.sum += $thisVal - passwordNumbersSetting[_this.name];
    passwordNumbersSetting.names[_this.name] = +$thisVal;
    inputSum();
    //inputSum();
    
    if (passwordNumbersSetting.sum > passwordLength) {
        for (let name in passwordNumbersSetting.names) {
            if (_this.name !== name) {
                passwordNumbersSetting.names[name] -= Math.min((passwordNumbersSetting.sum - passwordLength), passwordNumbersSetting.names[name]);
                if (inputSum() === passwordLength) {break;}
            }
        }
    }
    console.table(passwordNumbersSetting.names);
    console.log("Summa:", passwordNumbersSetting.sum);
    
    setInputsValues();
    //
    /*
    $($this.siblings(`input[name=${_this.name}]`)).val($thisVal);
    if ($this.attr("type") === "range") {
        sliderElem = $this;
    } else {
        sliderElem = $($this.siblings(`input[name=${_this.name}]`));
    }
    
    sliderElem.attr("class", sliderElem.attr("class").replace(/slider-fill-\d+/, sliderClassName + (0 | (($thisVal) * 100 / (sliderElem.attr("max"))))));
    console.log(sliderElem.attr("class"));
    */
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
    
    //console.log("To remove: ", symbolsNumber - passwordLength);
    for (let _ = 0; _ < symbolsNumber - passwordLength; _++) {
        //console.log(passwordSymbolDivHTML);
        $("#password-symbols-settings > *:first-child").remove();
    }
    for (let _ = 0; _ < passwordLength - symbolsNumber; _++) {
        //console.log(passwordSymbolDivHTML);
        $("#password-symbols-settings").append(passwordSymbolDivHTML);
    }
}

$(document).ready(() => {
    $("button[type=submit]").click(function (e) {
        e.preventDefault();
        submitPasswordForm(this.form);
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