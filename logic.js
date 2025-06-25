let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

const boxes = [];
let score = 0;

for (let i = 1; i <= 16; i++) {
  boxes.push(document.getElementById(`box${i}`));
}

generate();
generate();
updateStyles();

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move("left");
  else if (e.key === "ArrowRight") move("right");
  else if (e.key === "ArrowUp") move("up");
  else if (e.key === "ArrowDown") move("down");
});

//new box
function generate() {
  const empty = boxes.filter(box => box.innerText === "");
  if (empty.length === 0) return;
  const rand = Math.floor(Math.random() * empty.length);
  empty[rand].innerText = Math.random() < 0.9 ? "2" : "4";
}

function updateStyles() {
  boxes.forEach(box => {
    const val = box.innerText;
    box.style.backgroundColor = {
      "": "white",
      "2": "#a5f0f7",
      "4": "#aae9f3",
      "8": "#aee1ee",
      "16": "#b7d1e5",
      "32": "#c0c1dc",
      "64": "#c9b1d2",
      "128": "#d2a1c9",
      "256": "#db91c0",
      "512": "#e481b7",
      "1024": "#e979b2",
      "2048": "#ed71ad"
    }[val] || "#3c3a32";

  });
}

function move(direction) {
  let moved = false;

  const getIndex = (row, col) => row * 4 + col; //number the boxes 0 to 15

  for (let i = 0; i < 4; i++) {
    let line = [];

    for (let j = 0; j < 4; j++) {
      let index;
      if (direction === "left" || direction === "right") {
        index = getIndex(i, j);
      } else {
        index = getIndex(j, i);
      }
      line.push(boxes[index]);
    }

    if (direction === "right" || direction === "down") line.reverse();

    let nums = line.map(box => parseInt(box.innerText) || 0);
    let filtered = nums.filter(n => n !== 0);

    for (let k = 0; k < filtered.length - 1; k++) {
      if (filtered[k] === filtered[k + 1]) {
        filtered[k] *= 2;
        filtered[k + 1] = 0;
      }
    }

    let combined = filtered.filter(n => n !== 0);
    while (combined.length < 4) combined.push(0);

    if (direction === "right" || direction === "down") combined.reverse();

    for (let j = 0; j < 4; j++) {
      let index = (direction === "left" || direction === "right") ? getIndex(i, j) : getIndex(j, i);
      let newValue = combined[j] === 0 ? "" : combined[j].toString();
      if (boxes[index].innerText !== newValue) {
        moved = true;
      }
      boxes[index].innerText = newValue;
    }
  }

  if (moved) {
    generate();
    updateStyles();
    checkGameOver();
  }
}

function checkGameOver() {
  if (boxes.some(b => b.innerText === "2048")) {
    msg.innerText = "Congratulations! You won.";
    msgContainer.classList.remove("hide");
    return;
  }

  if (boxes.every(b => b.innerText !== "")) {
    for (let i = 0; i < 16; i++) {
      const current = boxes[i].innerText;
      const right = (i % 4 !== 3) && boxes[i + 1].innerText === current;
      const down = (i < 12) && boxes[i + 4].innerText === current;
      if (right || down) return; // A move is still possible
    }
    msg.innerText = "Game Over!";
    msgContainer.classList.remove("hide");
  }
}
