const winningScore = 21;

const scores = {
  a: 0,
  b: 0,
};

const scoreEls = {
  a: document.querySelector("#score-a"),
  b: document.querySelector("#score-b"),
};

const teamEls = {
  a: document.querySelector(".team-a"),
  b: document.querySelector(".team-b"),
};

const teamNameEls = {
  a: document.querySelector("#team-a-name"),
  b: document.querySelector("#team-b-name"),
};

const teamNames = {
  a: teamNameEls.a.value,
  b: teamNameEls.b.value,
};

const statusEl = document.querySelector("#status");
const resetButton = document.querySelector("#reset");
const scoreButtons = document.querySelectorAll(".score-hit");
const colorButtons = document.querySelectorAll(".color-swatch");

function clampScore(score) {
  return Math.min(winningScore, Math.max(0, score));
}

function winner() {
  if (scores.a === winningScore) return "a";
  if (scores.b === winningScore) return "b";
  return null;
}

function render() {
  scoreEls.a.textContent = scores.a;
  scoreEls.b.textContent = scores.b;

  const winningTeam = winner();
  teamEls.a.classList.toggle("is-winner", winningTeam === "a");
  teamEls.b.classList.toggle("is-winner", winningTeam === "b");

  scoreButtons.forEach((button) => {
    const name = teamNames[button.dataset.team];
    const verb = button.dataset.action === "up" ? "Add one point to" : "Subtract one point from";
    button.setAttribute("aria-label", `${verb} ${name}`);
  });

  if (winningTeam) {
    statusEl.textContent = `${teamNames[winningTeam]} wins`;
    return;
  }

  statusEl.textContent = "";
}

function changeScore(team, action) {
  const winningTeam = winner();
  if (winningTeam && action === "up") return;

  const amount = action === "up" ? 1 : -1;
  scores[team] = clampScore(scores[team] + amount);
  render();
}

scoreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    changeScore(button.dataset.team, button.dataset.action);
  });
});

resetButton.addEventListener("click", () => {
  scores.a = 0;
  scores.b = 0;
  render();
});

Object.entries(teamNameEls).forEach(([team, input]) => {
  input.addEventListener("input", () => {
    teamNames[team] = input.value.trim() || `Team ${team.toUpperCase()}`;
    render();
  });
});

colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { team, color } = button.dataset;
    teamEls[team].dataset.color = color;

    document.querySelectorAll(`.color-swatch[data-team="${team}"]`).forEach((swatch) => {
      swatch.classList.toggle("is-selected", swatch === button);
    });
  });
});

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The app still works normally if service workers are unavailable.
    });
  });
}
