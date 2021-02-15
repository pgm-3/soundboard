const JSON_PATH = "./data/sounds.json";

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCTX = new AudioContext();

let audio;

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

      // link deactiveren
      document.querySelector("#themenav .active").className = "";
      // huidige link actief maken
      e.target.className = "active";

      this.currentTheme = e.target.dataset.id;

      // soundboard opnieuw genereren
      this.createSoundboard();
    });

    this.$soundboard.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.className != "sample") return false;

      audioCTX.resume(); // inside event listener autoplay policy

      const sampleName = e.target.dataset.id; // sample name from data-id

      this.playSound(sampleName); // play me
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
        return `<a href="#" data-id="${value}" ${
          value === this.currentTheme ? 'class="active"' : ""
        }>
        ${value.split("-").join(" ")}
      </a>`;
      })
      .join("");

    this.$themenav.innerHTML = links;
  },
  createSoundboard() {
    const sounds = this.sounds[this.currentTheme];
    console.log(sounds);
    const sampleBtns = sounds
      .map((sample) => {
        let niceSample = sample; // store in temp var
        niceSample = niceSample.split(`${this.currentTheme}-`);
        niceSample = niceSample[1];
        niceSample = niceSample.split("-").join(" ");

        return `<button class="sample" data-id="${sample}">${niceSample}</button>`;
      })
      .join("");

    this.$soundboard.innerHTML = sampleBtns;
  },
  playSound(sample) {
    if (audio) audio.pause();
    audio = new Audio(`./audio/${sample}.mp3`);
    const mediaElement = audioCTX.createMediaElementSource(audio);
    mediaElement.connect(audioCTX.destination);
    audio.play();
  },
};

app.init();
