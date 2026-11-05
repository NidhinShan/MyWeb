/**
 * music-player.js · Anti-Gravity Bento Music Player (Audio-Only, Full Song Playback)
 * 
 * Features:
 * - Plays FULL original songs using an off-screen, audio-only YouTube IFrame engine (No video displayed)
 * - Fallback to HTML5 audio preview & Web Audio synth for offline resilience
 * - Live animated soundwave equalizer synchronized with playback
 * - Smooth interactive scrub bar with full seek capabilities
 * - Expandable playlist drawer with all 8 songs:
 *   1. Attention — Charlie Puth (Active)
 *   2. Calm Down — Rema, Selena Gomez
 *   3. love nwantiti — CKay
 *   4. KU LO SA — Oxlade
 *   5. Perfect — Ed Sheeran
 *   6. Dancing With A Stranger — Sam Smith, Normani
 *   7. Soweto — Victony, Tempoe
 *   8. People — Libianca
 * - Slate Stone & Burnt Ochre light-mode design tokens
 */

(function () {
  'use strict';

  // 8-Track Playlist Dataset with Official IDs for Full Song Playback
  const PLAYLIST = [
    {
      id: 0,
      title: "Attention",
      artist: "Charlie Puth",
      query: "Charlie Puth Attention",
      ytId: "nfs8NYg7yQM",
      duration: "3:31",
      approxSec: 211,
      fallbackCover: "🎧"
    },
    {
      id: 1,
      title: "Calm Down",
      artist: "Rema, Selena Gomez",
      query: "Rema Selena Gomez Calm Down",
      ytId: "WcIcVapfqXw",
      duration: "3:59",
      approxSec: 239,
      fallbackCover: "✨"
    },
    {
      id: 2,
      title: "love nwantiti",
      artist: "CKay",
      query: "CKay love nwantiti",
      ytId: "D-YDEyuDxWU",
      duration: "2:25",
      approxSec: 145,
      fallbackCover: "💖"
    },
    {
      id: 3,
      title: "KU LO SA",
      artist: "Oxlade",
      query: "Oxlade KU LO SA",
      ytId: "1pDQjwaH3qk",
      duration: "2:27",
      approxSec: 147,
      fallbackCover: "🌴"
    },
    {
      id: 4,
      title: "Perfect",
      artist: "Ed Sheeran",
      query: "Ed Sheeran Perfect",
      ytId: "2Vv-BfVoq4g",
      duration: "4:23",
      approxSec: 263,
      fallbackCover: "🎸"
    },
    {
      id: 5,
      title: "Dancing With A Stranger",
      artist: "Sam Smith, Normani",
      query: "Sam Smith Normani Dancing With A Stranger",
      ytId: "av5JD1dfjLA",
      duration: "2:51",
      approxSec: 171,
      fallbackCover: "💃"
    },
    {
      id: 6,
      title: "Soweto",
      artist: "Victony, Tempoe",
      query: "Victony Tempoe Soweto",
      ytId: "DPBRGWUgQsA",
      duration: "2:28",
      approxSec: 148,
      fallbackCover: "🔥"
    },
    {
      id: 7,
      title: "People",
      artist: "Libianca",
      query: "Libianca People",
      ytId: "LYRP15ZbG9w",
      duration: "3:04",
      approxSec: 184,
      fallbackCover: "🌊"
    }
  ];

  // State
  let currentIdx = 0;
  let isPlaying = false;
  let isDrawerOpen = false;
  let isMuted = false;
  let artworkCache = {};

  // YouTube Audio-Only Engine State
  let ytPlayer = null;
  let ytReady = false;
  let ytPollInterval = null;
  let pendingPlay = false;

  // HTML5 Audio Fallback Engine
  const fallbackAudio = new Audio();
  fallbackAudio.crossOrigin = "anonymous";
  fallbackAudio.preload = "auto";

  // Web Audio Synth Fallback (Offline emergency)
  let audioCtx = null;
  let synthInterval = null;

  function initWebAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
  }

  function playSynth() {
    initWebAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    stopSynth();
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    let step = 0;
    synthInterval = setInterval(() => {
      if (!isPlaying) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
        step++;
      } catch (e) {}
    }, 400);
  }

  function stopSynth() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  // Format MM:SS
  function formatTime(sec) {
    if (isNaN(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Fetch High-Res Square Artwork
  async function fetchArtwork(track) {
    if (artworkCache[track.id]) return artworkCache[track.id];

    try {
      const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(track.query)}&entity=song&limit=1`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const json = await res.json();
        if (json.results && json.results.length > 0) {
          const item = json.results[0];
          const art = item.artworkUrl100 ? item.artworkUrl100.replace(/\d+x\d+(bb)?\./, "400x400bb.") : null;
          artworkCache[track.id] = { artworkUrl: art, previewUrl: item.previewUrl };
          return artworkCache[track.id];
        }
      }
    } catch (e) {
      console.warn("Artwork search note:", e);
    }
    const fallback = { artworkUrl: `https://img.youtube.com/vi/${track.ytId}/hqdefault.jpg`, previewUrl: null };
    artworkCache[track.id] = fallback;
    return fallback;
  }

  // Initialize Hidden Off-Screen Container for Audio-Only Playback (No Video Shown)
  function initHiddenYTContainer() {
    if (document.getElementById("yt-audio-container")) return;
    const container = document.createElement("div");
    container.id = "yt-audio-container";
    // Placed off-screen so no video is visible, but browser keeps audio processing alive
    container.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0.01;pointer-events:none;z-index:-1;";
    const playerDiv = document.createElement("div");
    playerDiv.id = "yt-audio-player";
    container.appendChild(playerDiv);
    document.body.appendChild(container);
  }

  // Load YouTube IFrame API Script
  function loadYouTubeIframeAPI() {
    initHiddenYTContainer();
    if (window.YT && window.YT.Player) {
      initYTPlayerInstance();
      return;
    }
    if (!document.getElementById("yt-iframe-api-script")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api-script";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
  }

  // Global YouTube Callback
  window.onYouTubeIframeAPIReady = function () {
    initYTPlayerInstance();
  };

  // Instantiate YouTube Audio-Only Player
  function initYTPlayerInstance() {
    if (ytPlayer || !window.YT || !window.YT.Player) return;
    try {
      ytPlayer = new window.YT.Player("yt-audio-player", {
        height: "1",
        width: "1",
        videoId: PLAYLIST[currentIdx].ytId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin || "http://localhost"
        },
        events: {
          onReady: onYTPlayerReady,
          onStateChange: onYTPlayerStateChange,
          onError: onYTPlayerError
        }
      });
    } catch (err) {
      console.warn("YouTube player init error:", err);
    }
  }

  function onYTPlayerReady() {
    ytReady = true;
    if (pendingPlay) {
      pendingPlay = false;
      playTrackAudio();
    }
  }

  function onYTPlayerStateChange(event) {
    if (!window.YT) return;
    if (event.data === window.YT.PlayerState.PLAYING) {
      setUIPlayState(true);
      startPollingProgress();
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setUIPlayState(false);
      stopPollingProgress();
    } else if (event.data === window.YT.PlayerState.ENDED) {
      // Full song has finished! Advance automatically to next track in queue
      const nextIdx = (currentIdx + 1) % PLAYLIST.length;
      loadAndPlayTrack(nextIdx, true);
    }
  }

  function onYTPlayerError(e) {
    console.warn("YouTube stream notice, switching to audio preview:", e);
    playFallbackAudio();
  }

  // Progress Polling for Full Song
  function startPollingProgress() {
    stopPollingProgress();
    ytPollInterval = setInterval(() => {
      if (!isPlaying) return;
      if (ytPlayer && ytReady && typeof ytPlayer.getCurrentTime === "function") {
        const cur = ytPlayer.getCurrentTime();
        const dur = ytPlayer.getDuration() || PLAYLIST[currentIdx].approxSec;
        updateProgressDisplay(cur, dur);
      } else if (fallbackAudio && fallbackAudio.duration) {
        updateProgressDisplay(fallbackAudio.currentTime, fallbackAudio.duration);
      }
    }, 250);
  }

  function stopPollingProgress() {
    if (ytPollInterval) {
      clearInterval(ytPollInterval);
      ytPollInterval = null;
    }
  }

  // DOM References
  let dom = {};

  function setUIPlayState(playing) {
    isPlaying = playing;
    if (dom.playIcon) dom.playIcon.style.display = playing ? "none" : "block";
    if (dom.pauseIcon) dom.pauseIcon.style.display = playing ? "block" : "none";
    if (dom.eqBars) {
      dom.eqBars.forEach(b => b.classList.toggle("animating", playing));
    }
    if (dom.coverWrap) {
      dom.coverWrap.classList.toggle("playing", playing);
    }
    if (!playing) stopSynth();
  }

  function updateProgressDisplay(cur, dur) {
    if (!dur || isNaN(dur)) return;
    const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
    if (dom.progressFill) dom.progressFill.style.width = `${pct}%`;
    if (dom.timeCur) dom.timeCur.textContent = formatTime(cur);
    if (dom.timeTotal) dom.timeTotal.textContent = formatTime(dur);
  }

  // Play Audio (Full Song via Audio-Only YouTube stream)
  function playTrackAudio() {
    if (ytPlayer && ytReady && typeof ytPlayer.playVideo === "function") {
      ytPlayer.playVideo();
      setUIPlayState(true);
    } else {
      pendingPlay = true;
      loadYouTubeIframeAPI();
      // Temporary fallback while YouTube initializes
      playFallbackAudio();
    }
  }

  function pauseTrackAudio() {
    if (ytPlayer && ytReady && typeof ytPlayer.pauseVideo === "function") {
      ytPlayer.pauseVideo();
    }
    fallbackAudio.pause();
    stopSynth();
    setUIPlayState(false);
  }

  function playFallbackAudio() {
    const track = PLAYLIST[currentIdx];
    fetchArtwork(track).then(data => {
      if (data && data.previewUrl) {
        fallbackAudio.src = data.previewUrl;
        fallbackAudio.play().then(() => setUIPlayState(true)).catch(() => playSynth());
      } else {
        playSynth();
        setUIPlayState(true);
      }
    });
  }

  // Load and play track by index
  async function loadAndPlayTrack(idx, autoPlay = true) {
    currentIdx = idx;
    const track = PLAYLIST[idx];

    if (dom.title) dom.title.textContent = track.title;
    if (dom.artist) dom.artist.textContent = track.artist;
    if (dom.timeTotal) dom.timeTotal.textContent = track.duration;
    if (dom.timeCur) dom.timeCur.textContent = "0:00";
    if (dom.progressFill) dom.progressFill.style.width = "0%";

    // Cover reset
    if (dom.coverImg && dom.coverEmoji) {
      dom.coverImg.style.display = "none";
      dom.coverEmoji.style.display = "block";
      dom.coverEmoji.textContent = track.fallbackCover;
    }

    renderQueue();

    // Fetch official square artwork
    const artData = await fetchArtwork(track);
    if (artData && artData.artworkUrl && dom.coverImg && dom.coverEmoji) {
      dom.coverImg.src = artData.artworkUrl;
      dom.coverImg.onload = () => {
        dom.coverImg.style.display = "block";
        dom.coverEmoji.style.display = "none";
      };
    }

    // Load full song into YouTube Audio-Only player
    if (ytPlayer && ytReady && typeof ytPlayer.loadVideoById === "function") {
      if (autoPlay) {
        ytPlayer.loadVideoById(track.ytId);
        setUIPlayState(true);
      } else {
        ytPlayer.cueVideoById(track.ytId);
      }
    } else if (autoPlay) {
      pendingPlay = true;
      loadYouTubeIframeAPI();
    }
  }

  // Render Queue Drawer Items
  function renderQueue() {
    if (!dom.queueList) return;
    dom.queueList.innerHTML = PLAYLIST.map((t, idx) => {
      const isActive = idx === currentIdx;
      return `
        <div class="hmc-queue-item ${isActive ? 'active' : ''}" data-idx="${idx}">
          <div class="hmc-queue-left">
            <span class="hmc-queue-num font-mono">${idx + 1}</span>
            <div class="hmc-queue-info">
              <span class="hmc-queue-title">${t.title}</span>
              <span class="hmc-queue-artist">${t.artist}</span>
            </div>
          </div>
          <div class="hmc-queue-right">
            ${isActive ? '<span class="hmc-queue-dot"></span>' : ''}
            <span class="hmc-queue-dur font-mono">${t.duration}</span>
          </div>
        </div>
      `;
    }).join("");

    dom.queueList.querySelectorAll(".hmc-queue-item").forEach(item => {
      item.addEventListener("click", () => {
        const idx = parseInt(item.dataset.idx, 10);
        loadAndPlayTrack(idx, true);
      });
    });
  }

  // Main DOM Initializer
  function initPlayer() {
    const card = document.getElementById("hero-music-card");
    if (!card) return;

    dom = {
      card: card,
      title: card.querySelector("#hmc-title"),
      artist: card.querySelector("#hmc-artist"),
      coverWrap: card.querySelector("#hmc-cover"),
      coverImg: card.querySelector("#hmc-cover-img"),
      coverEmoji: card.querySelector("#hmc-cover-emoji"),
      playBtn: card.querySelector("#hmc-play-btn"),
      playIcon: card.querySelector("#hmc-play-icon"),
      pauseIcon: card.querySelector("#hmc-pause-icon"),
      prevBtn: card.querySelector("#hmc-prev-btn"),
      nextBtn: card.querySelector("#hmc-next-btn"),
      muteBtn: card.querySelector("#hmc-mute-btn"),
      progressBar: card.querySelector("#hmc-progress-bar"),
      progressFill: card.querySelector("#hmc-progress-fill"),
      timeCur: card.querySelector("#hmc-time-cur"),
      timeTotal: card.querySelector("#hmc-time-total"),
      queueToggle: card.querySelector("#hmc-queue-toggle"),
      queueDrawer: card.querySelector("#hmc-queue-drawer"),
      queueList: card.querySelector("#hmc-queue-list"),
      eqBars: card.querySelectorAll(".hmc-eq-bar")
    };

    // Play/Pause Click
    if (dom.playBtn) {
      dom.playBtn.addEventListener("click", () => {
        if (isPlaying) {
          pauseTrackAudio();
        } else {
          playTrackAudio();
        }
      });
    }

    // Next Track
    if (dom.nextBtn) {
      dom.nextBtn.addEventListener("click", () => {
        const nextIdx = (currentIdx + 1) % PLAYLIST.length;
        loadAndPlayTrack(nextIdx, true);
      });
    }

    // Previous Track
    if (dom.prevBtn) {
      dom.prevBtn.addEventListener("click", () => {
        const prevIdx = (currentIdx - 1 + PLAYLIST.length) % PLAYLIST.length;
        loadAndPlayTrack(prevIdx, true);
      });
    }

    // Mute Toggle
    if (dom.muteBtn) {
      dom.muteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        if (ytPlayer && ytReady && typeof ytPlayer.mute === "function") {
          if (isMuted) ytPlayer.mute(); else ytPlayer.unMute();
        }
        fallbackAudio.muted = isMuted;
        dom.muteBtn.classList.toggle("muted", isMuted);
      });
    }

    // Scrub Seeking (Clicking anywhere on progress bar seeks the full song)
    if (dom.progressBar) {
      dom.progressBar.addEventListener("click", (e) => {
        const rect = dom.progressBar.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        if (ytPlayer && ytReady && typeof ytPlayer.getDuration === "function") {
          const dur = ytPlayer.getDuration() || PLAYLIST[currentIdx].approxSec;
          ytPlayer.seekTo(pos * dur, true);
        } else if (fallbackAudio.duration) {
          fallbackAudio.currentTime = pos * fallbackAudio.duration;
        }
        if (dom.progressFill) dom.progressFill.style.width = `${pos * 100}%`;
      });
    }

    // Expandable Playlist Queue Drawer
    if (dom.queueToggle && dom.queueDrawer) {
      dom.queueToggle.addEventListener("click", () => {
        isDrawerOpen = !isDrawerOpen;
        dom.queueDrawer.classList.toggle("open", isDrawerOpen);
        dom.queueToggle.classList.toggle("active", isDrawerOpen);
      });
    }

    // Fallback Audio Event Listeners
    fallbackAudio.addEventListener("timeupdate", () => {
      if (!fallbackAudio.duration) return;
      updateProgressDisplay(fallbackAudio.currentTime, fallbackAudio.duration);
    });

    fallbackAudio.addEventListener("ended", () => {
      const nextIdx = (currentIdx + 1) % PLAYLIST.length;
      loadAndPlayTrack(nextIdx, true);
    });

    // Preload YouTube API and initialize active track
    loadYouTubeIframeAPI();
    loadAndPlayTrack(0, false);
  }

  // Initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPlayer);
  } else {
    initPlayer();
  }

})();
