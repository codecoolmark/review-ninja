var test = 5;
const x = 4
let y = 3;

async function loadData() {
    const response = await fetch('/')
    return await response.json()
}

function initUi() {
    loadData.then(data => console.log(data));
}

function testB() {
    return 5;
    console.log("Hello");
}

initUi()
