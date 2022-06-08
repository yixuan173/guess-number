const mainContainer = document.querySelector(".main-container");
const container = document.querySelector(".container");
const guessContainer = document.querySelector(".guess-container");
const scoreContainer = document.querySelector(".score-container");
const headerOne = document.querySelector(".header-one");
const headerTwo = document.querySelector(".header-two");
const newScore = document.querySelector(".new-score");
const currectNumber = document.querySelector(".currect-number");
const guessInput = document.querySelector(".guess-input");

const btnStart = document.querySelector(".btn-start");
const btnCheck = document.querySelector(".check");
const btnAgain = document.querySelector(".again");

const handleBtnHover = function (e) {
  const btn = e.target.closest(".btn-start");
  if (!btn) return;

  btn.classList.toggle("start");
  btn.classList.toggle("icon");
};

container.addEventListener("mouseover", handleBtnHover);
container.addEventListener("mouseout", handleBtnHover);

btnStart.addEventListener("click", function (e) {
  headerTwo.classList.add("hidden");
  btnStart.classList.add("hidden");
  guessContainer.classList.remove("guess-container-hidden");
  setTimeout(() => (guessContainer.style.opacity = "100%"), 100);

  headerOne.style.animation = "none";
});

// 設置初始題目
let a, b, number, round, guess;
let score = 100;
let heighScore = 0;

const displayMessage = function (msg) {
  document.querySelector(".header-one").textContent = msg;
};

const initNumber = function () {
  const numberArrays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  round = 0;
  number = "";

  for (let i = 0; i < 4; i++) {
    const index = Math.trunc(Math.random() * numberArrays.length);
    number += numberArrays[index];
    numberArrays.splice(index, 1);
  }
};

initNumber();

// 處理遊戲獲勝或結束
const handleGameEl = function (color1, color2) {
  currectNumber.textContent = number;
  guessInput.classList.add("hidden");
  newScore.classList.remove("hidden");
  currectNumber.classList.remove("hidden");
  btnCheck.classList.add("hidden");
  btnAgain.classList.remove("hidden");
  guessInput.value = "";
  mainContainer.style.background = `linear-gradient(180deg, ${color1}, ${color2})`;
};

// 新增遊戲輸入紀錄
const handleHistory = function () {
  round++;

  const html = `
  <li class="history-list-items">
    <span class="round-item">${round}</span>
    <span class="guess-item">${guess.join("")}</span>
    <span class="result-item">${a}A${b}B</span>
  </li>
  `;

  document
    .querySelector(".history-list")
    .insertAdjacentHTML("afterbegin", html);
};

// 處理整個遊戲流程
const handleInputValue = function () {
  const numbers = number.split("");
  let isNull = false;
  guess = guessInput.value.split("");
  a = 0;
  b = 0;

  // 接收輸入值，並判斷是否有空值，以及幾A幾B
  if (guess.length !== 4) {
    isNull = true;
  } else {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < numbers.length; y++) {
        if (+guess[x] === +numbers[y] && x === y) {
          a++;
        }
        if (+guess[x] === +numbers[y] && x !== y) {
          b++;
        }
      }
    }
  }

  // 判斷輸入值是否有重複
  let result = new Set();
  guess.forEach((item) => {
    !result.has(item) ? result.add(item) : false;
  });

  // 遊戲獲勝
  if (a === 4) {
    displayMessage("Currect Number!!!");
    newScore.textContent = "You Win";
    handleGameEl("#69db7c", "#c3f1cb");

    if (heighScore < score) {
      newScore.textContent = "New Score";
      document.querySelector(".label-score").style.color = "#777";
      document.querySelector(".highscore").textContent = score;
      heighScore = score;
    }

    // 有空值
  } else if (isNull) {
    alert("請輸入四位數字");

    //有重複值
  } else if ([...result].length < 4) {
    alert("請勿輸入重複數字");

    // 猜錯且還可以繼續猜
  } else if (score > 10) {
    displayMessage(`${a}A${b}B`);
    score -= 10;
    document.querySelector(".score").textContent = score;
    guessInput.value = "";
    guessInput.focus();

    guessInput.classList.add("input-shock");

    handleHistory();
    setTimeout(() => guessInput.classList.remove("input-shock"), 500);

    // 結束遊戲
  } else {
    document.querySelector(".score").textContent = 0;
    displayMessage("Guess Number");
    newScore.textContent = "You lost game";
    newScore.style.color = "#fa5252";
    currectNumber.style.color = "#fa5252";
    btnAgain.style.backgroundColor = "#fa5252";
    handleGameEl("#fa5252", "#fdbaba");
  }
};

// 送出輸入數字
btnCheck.addEventListener("click", handleInputValue);

document.addEventListener("keydown", function (e) {
  if (
    guessContainer.classList.contains("guess-container-hidden") ||
    guessInput.classList.contains("hidden")
  )
    return;

  if (e.code === "Enter") handleInputValue();
});

// 重新開始遊戲
btnAgain.addEventListener("click", function () {
  score = 100;

  displayMessage("Guess Number");
  document.querySelector(".score").textContent = score;
  newScore.style.color = "#fcc419";
  currectNumber.style.color = "#51cf66";
  btnAgain.style.backgroundColor = "#51cf66";
  guessInput.classList.remove("hidden");
  currectNumber.classList.add("hidden");
  newScore.classList.add("hidden");
  btnCheck.classList.remove("hidden");
  btnAgain.classList.add("hidden");
  document.querySelector(".label-score").style.color = "#333";
  mainContainer.style.background = "linear-gradient(135deg, #74c0fc, #e3f2fe)";
  document.querySelector(".history-list").innerHTML = "";

  initNumber();
});
