console.log("Hello");
let form = document.querySelector('.form1') as HTMLFormElement;
let namE = document.querySelector('.name') as HTMLInputElement;
let startDate = document.querySelector('.startDate') as HTMLInputElement;
let endDate = document.querySelector('.endDate') as HTMLInputElement;


form.addEventListener('submit', (event)=>{
    event.preventDefault();    
//seelcting the radio button :-(
const checkedRadioButton = document.querySelector<HTMLInputElement>('input[name="option"]:checked');
const selectedRadioValue = checkedRadioButton?.value;
console.log('Selected Radio Button Value:', selectedRadioValue);



let formData: {} = {
    name: namE.value,
    startDate: startDate.value,
    endDate: endDate.value,
    habit: selectedRadioValue
}

let jsonData = JSON.stringify(formData);


console.log(jsonData);





})

