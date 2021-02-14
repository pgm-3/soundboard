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
    });

    this.$soundboard.addEventListener("click", async (e) => {
      e.preventDefault();
      if (e.target.className != "sample") return false;
    });
  },
  async fetchSampleData() {},
  createNav() {},
  createSoundboard() {},
  playSound(audioBuffer) {},
};

app.init();
