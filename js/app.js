const JSON_PATH = "./data/sounds.json";

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCTX = new AudioContext();

const app = {
  init() {
    this.sounds = [];

    this.currentTheme = "90s";

    this.cacheElements();
    this.registerListeners();

    this.fetchSampleData();
  },
  cacheElements() {
    this.$themenav = document.querySelector("#themenav");
    this.$soundboard = document.querySelector("#soundboard");
  },
  registerListeners() {
    this.$themenav.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector("#themenav .active").className = "";
      this.currentTheme = e.target.dataset.id;
      e.target.className = "active";

      this.$soundboard.innerHTML = "";
      this.createSoundboard();
    });

    this.$soundboard.addEventListener("click", async (e) => {
      e.preventDefault();
      if (e.target.className != "sample") return false;

      audioCTX.resume(); // must be placed in eventListener (inside user event)

      // get name of the sample from the data-id
      const sampleName = e.target.dataset.id;

      // start playing a sound
      this.playSound(sampleName);
    });
  },
  async fetchSampleData() {
    const response = await fetch(JSON_PATH);
    this.sounds = await response.json();

    this.createNav();
    this.createSoundboard();
  },
  createNav() {
    const themes = Object.keys(this.sounds);
    const links = themes
      .map((value) => {
        return `<a href="#" data-id="${value}" ${value === this.currentTheme ? 'class="active"' : ""}>${value.split("-").join(" ")}</a>`;
      })
      .join("");

    this.$themenav.innerHTML = links;
  },
  createSoundboard() {
    const sounds = this.sounds[this.currentTheme];
    const sampleBtns = sounds
      .map((sample) => {
        return `<button class="sample" data-id="${sample}">${sample.split("-").join(" ")}</button>`;
      })
      .join("");
    this.$soundboard.innerHTML = sampleBtns;
  },
  playSound(sampleName) {
    const audio = new Audio(`./audio/${sampleName}.mp3`);
    const sample = audioCTX.createMediaElementSource(audio);
    sample.connect(audioCTX.destination);
    audio.play();
  },
};

app.init();
