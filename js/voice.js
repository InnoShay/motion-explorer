/* ============================================
   MOTION EXPLORER — Voice (Web Speech API)
   ============================================ */

const Voice = {
  _synth: window.speechSynthesis || null,
  _utterance: null,
  _playing: false,

  // ── Explanations per screen ──
  explanations: {
    motion: "Let's understand motion! When you walk from your room to the kitchen, your position changes. That's motion! In science, we say an object is in motion when its position changes with respect to a reference point over time. If the position doesn't change, the object is at rest. But here's the interesting part — motion depends on your reference point! A person sitting in a moving bus is at rest compared to the bus, but in motion compared to someone standing on the road.",

    distance: "Now let's learn about distance and displacement! Imagine Aryan walks from home to the park and then to school. The total path he walks — every step, every turn — that's the distance. But displacement? That's just the straight line from where he started to where he ended up. Distance is always positive and can be very long. But displacement can be zero! If Aryan walks to school and comes back home, his displacement is zero because he's back where he started, even though the distance he walked is quite large!",

    speed: "Speed and velocity might sound the same, but they're different! Speed tells you how fast something is moving — it's the total distance divided by time. If a car covers 100 kilometers in 2 hours, its speed is 50 kilometers per hour. Simple! But velocity includes direction too. A car going north at 50 kilometers per hour has a different velocity from one going south at 50 kilometers per hour, even though their speeds are the same! Think of it like Google Maps — it doesn't just tell you how fast to go, it tells you which direction to turn!",

    acceleration: "Acceleration is about change! When a car starts from rest and speeds up, it's accelerating. When it slows down at a red light, it's also accelerating — but in the opposite direction! We call that deceleration or negative acceleration. The formula is simple: acceleration equals change in velocity divided by time taken. If a car goes from 0 to 60 kilometers per hour in 10 seconds, that's acceleration! And here's a fun fact — when you're in a fast car that's cruising at constant speed, the acceleration is actually zero, because the speed isn't changing!",

    graphs: "Graphs tell the story of motion in pictures! In a distance-time graph, the x-axis shows time and the y-axis shows distance. A straight horizontal line means the object is not moving — it's at rest. A straight line going up means the object is moving at constant speed. The steeper the line, the faster the object! And if the line curves upward, the object is speeding up — it's accelerating! By looking at the slope of the graph, you can find the speed. A steeper slope means higher speed. Graphs make it so easy to compare the motion of different objects!"
  },

  // ── Speak ──
  speak(screenId) {
    if (!this._synth) {
      alert('Sorry, your browser does not support text-to-speech. Please try Chrome or Safari.');
      return;
    }

    // If already playing same thing, stop
    if (this._playing) {
      this.stop();
      return;
    }

    const text = this.explanations[screenId];
    if (!text) return;

    this._utterance = new SpeechSynthesisUtterance(text);
    this._utterance.rate = 0.9;
    this._utterance.pitch = 1.0;
    this._utterance.volume = 1.0;
    
    // Try to find a good voice
    const voices = this._synth.getVoices();
    const preferred = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Google') || 
      v.name.includes('Microsoft') ||
      (v.lang.startsWith('en') && v.name.includes('Female'))
    ) || voices.find(v => v.lang.startsWith('en'));
    
    if (preferred) {
      this._utterance.voice = preferred;
    }

    this._utterance.onstart = () => {
      this._playing = true;
      this._updateButtons(screenId, true);
    };

    this._utterance.onend = () => {
      this._playing = false;
      this._updateButtons(screenId, false);
    };

    this._utterance.onerror = () => {
      this._playing = false;
      this._updateButtons(screenId, false);
    };

    this._synth.speak(this._utterance);
  },

  // ── Stop ──
  stop() {
    if (this._synth) {
      this._synth.cancel();
    }
    this._playing = false;
    document.querySelectorAll('.voice-btn').forEach(btn => {
      btn.classList.remove('playing');
      btn.innerHTML = '🔊 Listen to Explanation';
    });
  },

  // ── Update button state ──
  _updateButtons(screenId, playing) {
    const btns = document.querySelectorAll(`.voice-btn[data-screen="${screenId}"]`);
    btns.forEach(btn => {
      if (playing) {
        btn.classList.add('playing');
        btn.innerHTML = '⏹ Stop Listening';
      } else {
        btn.classList.remove('playing');
        btn.innerHTML = '🔊 Listen to Explanation';
      }
    });
  },

  // ── Check support ──
  isSupported() {
    return 'speechSynthesis' in window;
  },

  // ── Load voices (needs to be called early) ──
  loadVoices() {
    if (this._synth) {
      this._synth.getVoices(); // Trigger loading
      this._synth.onvoiceschanged = () => {
        this._synth.getVoices();
      };
    }
  }
};

// Load voices on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => Voice.loadVoices());
}
