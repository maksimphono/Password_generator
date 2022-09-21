function submitPasswordForm(form) {
    return 0;
};

function changeLabelTextOnVal(_this) { 
    const $this = $(_this);
    const $thisVal = $this.val();
    const sliderClassName = "slider-fill-";
    let sliderElem = null;
    
    $($this.siblings(`input[name=${_this.name}]`)).val($thisVal);
    if ($this.attr("type") === "range") {
        sliderElem = $this;
    } else {
        sliderElem = $($this.siblings(`input[name=${_this.name}]`));
    }
    sliderElem.attr("class", sliderElem.attr("class").replace(/slider-fill-\d+/, sliderClassName + (0 | (($thisVal) * 100 / (sliderElem.attr("max"))))));
    console.log(sliderElem.attr("class"));
};

function changePasswordLength(_this) {
    let passwordLength = $(_this).val();

    console.log(passwordLength);
    $("#password-number-symbols-setttings").find("input").each((i, item) => { 
        $(item).attr("max", passwordLength);
        $(item).val(4);
        changeLabelTextOnVal(item);
    });
    $("#password-number-symbols-setttings *:first-child").find("input").each((i, item) => {
        $(item).val(passwordLength);
        changeLabelTextOnVal(item);
    });
    clonePasswordSymbolsHTMLElements(passwordLength);
};

let passwordSymbolDivHTML = $("#password-symbols-settings").clone().html();
const PASSWORD_MIN_LEN = 4;

function clonePasswordSymbolsHTMLElements(passwordLength = PASSWORD_MIN_LEN) {
    const symbolsNumber = $("#password-symbols-settings").children().length;

    console.log("To remove: ", symbolsNumber - passwordLength);
    for (let _ = 0; _ < symbolsNumber - passwordLength; _++) {
        console.log(passwordSymbolDivHTML);
        $("#password-symbols-settings > *:first-child").remove();
    }
    for (let _ = 0; _ < passwordLength - symbolsNumber; _++) {
        console.log(passwordSymbolDivHTML);
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

    clonePasswordSymbolsHTMLElements();
});