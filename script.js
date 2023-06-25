// checkboxes-constants
const upperCheck=document.querySelector("#upper")
const lowerCheck=document.querySelector("#lower")
const numbersCheck=document.querySelector("#numbers")
const symbolsCheck=document.querySelector("#symbols")
const checkBoxes=document.querySelectorAll("input[type=checkbox]")

// generate password
const generateBtn=document.querySelector(".btn")

// strength section
const indicator=document.querySelector("[data-indicator]")

//password-length
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

//copy password
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

//password display
const passwordDisplay = document.querySelector("[passwordDisplay]");

// initial data on the page
let password = "";
let passwordLength = 10;
let checkCount = 0;

//initial_function
handleSlide()
setIndicator("#ccc")

//set-password-length
function handleSlide(){
    lengthDisplay.innerText=passwordLength
    inputSlider.value=passwordLength
    // background of the slide
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

// set-strength-color
function setIndicator(color){
   indicator.style.background=color
   indicator.style.boxShadow=`0px 0px  12px 1px ${color}`
}

//random_base_function
function  getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min
}

//generating random letters for password
function generateUpper(){
    return String.fromCharCode(getRandomInteger(65,91))
}

function generateLower(){
    return String.fromCharCode(getRandomInteger(97,123))
}

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
function generateSymbol(){
    const res=getRandomInteger(0,symbols.length)
    return symbols.charAt(res)
}

function generateNumber(){
    return getRandomInteger(0,9)
}


// strength calculation
function calcStrength(){
    let hasUpper=false
    let hasLower=false
    let hasNumber=false
    let hasSymbol=false
    if(upperCheck.checked){hasUpper=true}
    if(lowerCheck.checked){hasLower=true}
    if(numbersCheck.checked){hasNumber=true}
    if(symbolsCheck.checked){hasSymbol=true}

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
}

// copy function
async function copy(){
    
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText="Copied"
    }
    catch(e){
         copyMsg.innerText="Failed"
    }

    copyBtn.classList.add("active")
    setInterval(()=>{
        copyBtn.classList.remove("active")
    },2000)
}


// add eventlistener to checkboxes so that we can count the no of active checkboxes
checkBoxes.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange)
})

function handleCheckboxChange(){
    checkCount=0
    checkBoxes.forEach((checkbox)=>{
        if(checkbox.checked){checkCount++}
    })
    if(passwordLength<checkCount){
        passwordLength=checkCount
        handleSlide()
    }
}



// how can we connect input slider with password length

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value
    handleSlide()
})


// condition for copied btn and make it functioning using addevent listener

copyBtn.addEventListener('click',()=>{
     if(passwordDisplay.value){copy()}
})

//how to shuffle password
function shufflePassword(array){
    for(let i=array.length-1;i>=0;i--){
        const j=Math.floor((Math.random())*(i+1))
        const temp=array[i]
        array[i]=array[j]
        array[j]=temp
    }
    let str=""
    array.forEach((c)=>{
        str+=c
    })
    return str
}



// working of generate password button
generateBtn.addEventListener('click',()=>{
    if(checkCount==0){return}
    if(passwordLength<checkCount){
      passwordLength=checkCount
      handleSlide()
    }

    // how to check which checkboxes are ticked and which are not
    let funcArr=[]
    if(upperCheck.checked){
        funcArr.push(generateUpper)
    }
    if(lowerCheck.checked){
        funcArr.push(generateLower)
    }
    if(numbersCheck.checked){
        funcArr.push(generateNumber)
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol)
    }
     
    password=""
    for(let i=0;i<funcArr.length;i++){
       password+=funcArr[i]()
    }

    for(let i=0;i<passwordLength-funcArr.length;i++){
        password+=funcArr[getRandomInteger(0,funcArr.length)]()
    }
    
    password=shufflePassword(Array.from(password))
    passwordDisplay.value=password

    calcStrength()
})

