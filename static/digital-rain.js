(() => {
  'use strict';

  const TARGET_FPS = 60;
  const FRAME_FACTOR_CLAMP = { min: 0.25, max: 2 };

  const CONFIG = {
    lifecycle: {
      idleTimeoutMs:
        ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
          ? 10_000
          : 120_000,
    },
    layout: {
      streamDensity: 0.75,
      targetStreamCount: 80,
      maxStreamsActivatedPerFrame: 3,
    },
    typography: {
      fontProfile: [
        { minScale: 0.99, maxScale: 1.0, weight: 70 },
        { minScale: 1.0, maxScale: 1.25, weight: 20 },
        { minScale: 1.25, maxScale: 1.5, weight: 5 },
        { minScale: 1.5, maxScale: 1.75, weight: 5 },
      ],
      minBaseFontSizePx: 14,
      minGlyphFontSizePx: 8,
    },
    streams: {
      profile: [
        { baseSpeed: 0.25, trailLengthRatio: 0.25, jitter: 0.2, weight: 10 },
        { baseSpeed: 0.2, trailLengthRatio: 0.5, jitter: 0.2, weight: 40 },
        { baseSpeed: 0.15, trailLengthRatio: 0.7, jitter: 0.2, weight: 30 },
        { baseSpeed: 0.1, trailLengthRatio: 0.95, jitter: 0.2, weight: 20 },
      ],
      baseFallSpeed: 0.12,
      baseTrailLengthRatio: 0.6,
    },
    glyphs: {
      trailBrightnessRange: { min: 0.02, max: 1.0 },
      headSwapFrameRange: { min: 20, max: 60 },
      trailSwapFrameRange: { min: 50, max: 100 },
    },
    sparkles: {
      spatialDensity: 0.01,
      perFrameProbability: 0.01,
      maxPerStream: 2,
      fadeRateRange: { min: 0.02, max: 0.05 },
    },
    motion: {
      speedOscillationAmplitude: 0.15,
      speedOscillationFrequency: 0.15,
      maxRowsPerFrame: 8,
    },
    rendering: {
      glyphGlowColor: '#00d492',
      glyphGlowBlur: 10,
      glowBrightnessThreshold: 0.5,
      minVisibleBrightness: 0.02,
    },
  };

  const MATRIX_CHARS = (() => {
    const latin =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const halfWidthKana =
      'ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    return latin + halfWidthKana;
  })();

  const GREY_FILL_STYLES = Array.from(
    { length: 256 },
    (_, v) => `rgb(${v},${v},${v})`,
  );
  const SHADOW_OFF = 'rgba(0,0,0,0)';
  const randomChar = () =>
    MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));

  class MatrixIdleScreensaver {
    #config = CONFIG;
    #idleTimerId = null;
    #activityHandler = null;

    #overlay = null;
    #canvas = null;
    #ctx = null;
    #animationFrameId = null;
    #running = false;
    #lastDarkTheme = null;

    #fontSize = 18;
    #logicalWidth = 0;
    #logicalHeight = 0;
    #streamCount = 0;
    #streams = [];
    #inactiveStreamIndices = [];
    #trailLength = 20;
    #sparkles = new Map();
    #sparkleCountPerStream = new Map();
    #sparkleTotalCount = 0;
    #maxFontScale = 1;
    #reducedMotionCleanup = null;

    constructor() {
      const fontProfile = this.#config.typography.fontProfile;
      this.#maxFontScale =
        fontProfile.length > 0
          ? Math.max(...fontProfile.flatMap((e) => [e.minScale, e.maxScale]))
          : 1;
      this.#activityHandler = () => this.#handleUserActivity();
      this.#setupActivityListeners();
      this.#resetIdleTimer();
    }

    #setupActivityListeners() {
      const handler = this.#activityHandler;
      const passiveOpts = { passive: true };
      window.addEventListener('mousemove', handler, passiveOpts);
      window.addEventListener('mousedown', handler);
      window.addEventListener('scroll', handler, passiveOpts);
      window.addEventListener('keydown', handler);
      window.addEventListener('touchstart', handler, passiveOpts);
    }

    #removeActivityListeners() {
      const handler = this.#activityHandler;
      if (!handler) return;
      const passiveOpts = { passive: true };
      window.removeEventListener('mousemove', handler, passiveOpts);
      window.removeEventListener('mousedown', handler);
      window.removeEventListener('scroll', handler, passiveOpts);
      window.removeEventListener('keydown', handler);
      window.removeEventListener('touchstart', handler, passiveOpts);
    }

    #prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    #handleUserActivity() {
      if (this.#overlay) {
        this.#hideOverlay();
      }
      this.#resetIdleTimer();
    }

    #resetIdleTimer() {
      if (this.#idleTimerId !== null) {
        clearTimeout(this.#idleTimerId);
      }
      this.#idleTimerId = setTimeout(() => {
        if (this.#prefersReducedMotion()) {
          this.#resetIdleTimer();
          return;
        }
        this.#showOverlay();
      }, this.#config.lifecycle.idleTimeoutMs);
    }

    #createOverlayElements() {
      if (this.#overlay) return;

      const overlay = document.createElement('div');
      overlay.setAttribute('data-matrix-idle', 'overlay');
      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        backgroundColor: '#000',
        zIndex: '2147483647',
        margin: '0',
        padding: '0',
        overflow: 'hidden',
        pointerEvents: 'auto',
      });

      const canvas = document.createElement('canvas');
      canvas.setAttribute('data-matrix-idle', 'canvas');
      Object.assign(canvas.style, {
        display: 'block',
        width: '100%',
        height: '100%',
      });

      overlay.appendChild(canvas);
      this.#overlay = overlay;
      this.#canvas = canvas;
      this.#ctx = canvas.getContext('2d');

      overlay.addEventListener('mousedown', () => this.#handleUserActivity());
      overlay.addEventListener('touchstart', () => this.#handleUserActivity(), {
        passive: true,
      });
    }

    #showOverlay() {
      if (this.#overlay) return;
      if (this.#prefersReducedMotion()) return;

      this.#createOverlayElements();
      document.body.appendChild(this.#overlay);
      this.#resizeCanvas();
      window.addEventListener('resize', this.#resizeCanvas, {
        passive: true,
      });

      this.#startAnimation();

      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onReduce = () => {
        if (mql.matches) this.#hideOverlay();
      };
      mql.addEventListener('change', onReduce);
      this.#reducedMotionCleanup = () => {
        mql.removeEventListener('change', onReduce);
        this.#reducedMotionCleanup = null;
      };
    }

    #hideOverlay() {
      this.#stopAnimation();
      if (this.#reducedMotionCleanup) {
        this.#reducedMotionCleanup();
      }

      if (this.#overlay && this.#overlay.parentNode) {
        this.#overlay.parentNode.removeChild(this.#overlay);
      }
      this.#overlay = null;
      this.#canvas = null;
      this.#ctx = null;
      this.#streams = [];
      this.#streamCount = 0;
      this.#inactiveStreamIndices = [];
      this.#sparkles.clear();
      this.#sparkleCountPerStream.clear();
      this.#sparkleTotalCount = 0;

      window.removeEventListener('resize', this.#resizeCanvas);
    }

    #resizeCanvas = () => {
      if (!this.#canvas || !this.#ctx) return;

      const { innerWidth: cssWidth, innerHeight: cssHeight } = window;
      const dpr = window.devicePixelRatio || 1;

      this.#canvas.width = Math.floor(cssWidth * dpr);
      this.#canvas.height = Math.floor(cssHeight * dpr);
      this.#canvas.style.width = `${cssWidth}px`;
      this.#canvas.style.height = `${cssHeight}px`;

      this.#ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.#ctx.scale(dpr, dpr);

      this.#logicalWidth = cssWidth;
      this.#logicalHeight = cssHeight;
      this.#fontSize = Math.max(
        this.#config.typography.minBaseFontSizePx,
        Math.floor(cssWidth / this.#config.layout.targetStreamCount),
      );
      this.#initStreamSlots();
    };

    #initStreamSlots() {
      if (!this.#canvas) return;
      this.#streamCount = Math.floor(this.#logicalWidth / this.#fontSize);
      this.#streams = Array.from({ length: this.#streamCount }, () => null);
      this.#inactiveStreamIndices = Array.from(
        { length: this.#streamCount },
        (_, i) => i,
      );
    }

    #activateStreamsTowardsDensity() {
      if (!this.#canvas) return;
      const targetActive = Math.round(
        this.#streamCount * this.#config.layout.streamDensity,
      );
      const inactive = this.#inactiveStreamIndices;
      if (
        inactive.length === 0 ||
        this.#streamCount - inactive.length >= targetActive
      )
        return;

      const toActivate = Math.min(
        this.#config.layout.maxStreamsActivatedPerFrame,
        targetActive - (this.#streamCount - inactive.length),
      );
      for (let n = 0; n < toActivate && inactive.length > 0; n++) {
        const idx = Math.floor(Math.random() * inactive.length);
        const streamIndex = inactive[idx];
        inactive.splice(idx, 1);
        this.#streams[streamIndex] = this.#createStream();
      }
    }

    #decSparkleCountForStream(streamIndex) {
      const n = this.#sparkleCountPerStream.get(streamIndex) ?? 0;
      if (n <= 1) this.#sparkleCountPerStream.delete(streamIndex);
      else this.#sparkleCountPerStream.set(streamIndex, n - 1);
    }

    #removeSparkle(streamIndex, rowMap, rowIndex) {
      rowMap.delete(rowIndex);
      this.#decSparkleCountForStream(streamIndex);
      this.#sparkleTotalCount -= 1;
      if (rowMap.size === 0) this.#sparkles.delete(streamIndex);
    }

    #drawChar(char, x, y) {
      if (!this.#ctx) return;
      this.#ctx.fillText(char, x, y);
    }

    #pickChangeEvery(isHead) {
      const range = isHead
        ? this.#config.glyphs.headSwapFrameRange
        : this.#config.glyphs.trailSwapFrameRange;
      const span = Math.max(1, range.max - range.min);
      return range.min + Math.floor(Math.random() * span);
    }

    #trailGlyphBrightness(k, trailLength) {
      if (k === 0) return 1;
      const u = (trailLength - k) / trailLength;
      const { min: minA, max: maxA } = this.#config.glyphs.trailBrightnessRange;
      return minA + (maxA - minA) * u * u;
    }

    #setShadow(enable) {
      if (!this.#ctx) return;
      if (
        enable &&
        this.#config.rendering.glyphGlowColor &&
        this.#config.rendering.glyphGlowBlur > 0
      ) {
        this.#ctx.shadowColor = this.#config.rendering.glyphGlowColor;
        this.#ctx.shadowBlur = this.#config.rendering.glyphGlowBlur;
        this.#ctx.shadowOffsetX = 0;
        this.#ctx.shadowOffsetY = 0;
      } else {
        this.#ctx.shadowBlur = 0;
        this.#ctx.shadowColor = SHADOW_OFF;
        this.#ctx.shadowOffsetX = 0;
        this.#ctx.shadowOffsetY = 0;
      }
    }

    #pickStreamProfile() {
      const profile = this.#config.streams.profile;
      const total = profile.reduce((s, e) => s + e.weight, 0);
      if (!total)
        return {
          baseSpeed: this.#config.streams.baseFallSpeed,
          trailLengthRatio: this.#config.streams.baseTrailLengthRatio,
          jitter: 0,
        };
      let r = Math.random() * total,
        acc = 0;
      for (const row of profile) {
        acc += row.weight;
        if (r <= acc) return row;
      }
      return profile[profile.length - 1];
    }

    #pickFontScaleFromProfile() {
      const fontProfile = this.#config.typography.fontProfile;
      const total = fontProfile.reduce((s, e) => s + e.weight, 0);
      if (!total) return 1;
      const randInRange = (lo, hi) => lo + Math.random() * (hi - lo);
      let r = Math.random() * total,
        acc = 0;
      for (const e of fontProfile) {
        acc += e.weight;
        if (r <= acc) return randInRange(e.minScale, e.maxScale);
      }
      const last = fontProfile[fontProfile.length - 1];
      return randInRange(last.minScale, last.maxScale);
    }

    #createStream() {
      const { baseSpeed, trailLengthRatio, jitter } = this.#pickStreamProfile();
      let trailLength = this.#trailLength;
      if (this.#canvas) {
        const visibleRows = Math.max(
          1,
          Math.ceil(this.#logicalHeight / this.#fontSize),
        );
        trailLength = Math.max(
          1,
          Math.round(Math.min(1, Math.max(0, trailLengthRatio)) * visibleRows),
        );
      }
      const jitterAmount = Math.max(0, Number.isFinite(jitter) ? jitter : 0);
      const speed = Math.max(
        0,
        baseSpeed * (1 + (Math.random() * 2 - 1) * jitterAmount),
      );
      const fontScale = this.#pickFontScaleFromProfile();
      const fontSize = Math.max(
        this.#config.typography.minGlyphFontSizePx,
        this.#fontSize * fontScale,
      );
      return {
        row: -Math.floor(Math.random() * trailLength),
        progress: 0,
        speed,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleStrength: 0.5 + Math.random() * 0.5,
        fontSize,
        trailLength,
        trail: Array.from({ length: trailLength }, (_, k) => ({
          char: randomChar(),
          life: 0,
          changeEvery: this.#pickChangeEvery(k === 0),
        })),
      };
    }

    #getIsDarkTheme() {
      return document.documentElement.classList.contains('dark');
    }

    #themeColors(isDark) {
      return isDark
        ? { bg: '#000000', fg: '#FFFFFF' }
        : { bg: '#FFFFFF', fg: '#000000' };
    }

    #applyThemeStyles() {
      if (!this.#overlay) return;
      const isDark = this.#getIsDarkTheme();
      this.#overlay.style.backgroundColor = isDark ? '#000' : '#FFF';
    }

    #drawStreams(width, height, isDark, fg, elapsedSeconds, frameFactor) {
      const minRowHeightPx = this.#fontSize * this.#maxFontScale;
      const visibleRows = Math.ceil(height / minRowHeightPx);
      const maxSparkles = Math.max(
        1,
        Math.round(
          this.#config.sparkles.spatialDensity * visibleRows * this.#streamCount,
        ),
      );

      for (let i = 0; i < this.#streamCount; i += 1) {
        const stream = this.#streams[i];
        if (!stream) continue;

        const fontSize = stream.fontSize ?? this.#fontSize;
        const x = i * this.#fontSize;
        const trailLength = stream.trailLength ?? this.#trailLength;

        const fontBold = `bold ${fontSize}px monospace`;
        const fontNormal = `${fontSize}px monospace`;
        let lastFillStyle = '';
        let lastFont = '';
        let lastShadowOn = -1;

        this.#ctx.font = fontBold;

        for (let k = 0; k < trailLength; k += 1) {
          const row = stream.row - k;
          const y = row * fontSize;

          if (y < 0 || y > height) continue;

          const trailGlyph = stream.trail[k];
          const rowIndex = Math.round(y / fontSize);
          let isSparkleHere = this.#sparkles.get(i)?.has(rowIndex) ?? false;

          if (
            !isSparkleHere &&
            this.#sparkleTotalCount < maxSparkles &&
            (this.#sparkleCountPerStream.get(i) ?? 0) <
              this.#config.sparkles.maxPerStream &&
            Math.random() < this.#config.sparkles.perFrameProbability
          ) {
            let streamSparkles = this.#sparkles.get(i);
            if (!streamSparkles)
              this.#sparkles.set(i, (streamSparkles = new Map()));
            streamSparkles.set(rowIndex, {
              char: trailGlyph.char,
              alpha: 1,
              decay:
                this.#config.sparkles.fadeRateRange.min +
                Math.random() *
                  (this.#config.sparkles.fadeRateRange.max -
                    this.#config.sparkles.fadeRateRange.min),
            });
            this.#sparkleCountPerStream.set(
              i,
              (this.#sparkleCountPerStream.get(i) ?? 0) + 1,
            );
            this.#sparkleTotalCount += 1;
            isSparkleHere = true;
          }

          if (isSparkleHere) continue;

          trailGlyph.life += 1;
          if (trailGlyph.life >= trailGlyph.changeEvery) {
            trailGlyph.char = randomChar();
            trailGlyph.life = 0;
            trailGlyph.changeEvery = this.#pickChangeEvery(k === 0);
          }

          const brightness = this.#trailGlyphBrightness(k, trailLength);
          if (brightness < this.#config.rendering.minVisibleBrightness)
            continue;

          const shadowOn =
            this.#config.rendering.glyphGlowBlur > 0 &&
            brightness >= this.#config.rendering.glowBrightnessThreshold
              ? 1
              : 0;
          if (shadowOn !== lastShadowOn) {
            this.#setShadow(shadowOn === 1);
            lastShadowOn = shadowOn;
          }

          if (k === 0) {
            this.#ctx.globalAlpha = 1.0;
            if (fg !== lastFillStyle) {
              this.#ctx.fillStyle = fg;
              lastFillStyle = fg;
            }
          } else {
            if (fontNormal !== lastFont) {
              this.#ctx.font = fontNormal;
              lastFont = fontNormal;
            }
            this.#ctx.globalAlpha = 1.0;
            const v = Math.min(
              255,
              Math.max(
                0,
                Math.round(255 * (isDark ? brightness : 1 - brightness)),
              ),
            );
            const fillStyle = GREY_FILL_STYLES[v];
            if (fillStyle !== lastFillStyle) {
              this.#ctx.fillStyle = fillStyle;
              lastFillStyle = fillStyle;
            }
          }

          this.#drawChar(trailGlyph.char, width - x - fontSize, y);
        }

        this.#ctx.globalAlpha = 1.0;

        const baseSpeed = stream.speed ?? this.#config.streams.baseFallSpeed;
        const wobbleStrength = stream.wobbleStrength ?? 1;
        const wobblePhase = stream.wobblePhase ?? 0;
        const wobble =
          1 +
          this.#config.motion.speedOscillationAmplitude *
            wobbleStrength *
            Math.sin(
              this.#config.motion.speedOscillationFrequency * elapsedSeconds +
                wobblePhase,
            );
        const effectiveSpeed = Math.max(0, baseSpeed * wobble);

        stream.progress += effectiveSpeed * frameFactor;
        const maxSteps = this.#config.motion.maxRowsPerFrame;
        let steps = 0;
        while (stream.progress >= 1 && steps < maxSteps) {
          stream.row += 1;
          stream.progress -= 1;
          steps += 1;
        }

        if (stream.row * fontSize > height + trailLength * fontSize) {
          this.#streams[i] = this.#createStream();
        }
      }
    }

    #drawSparkles(width, height, fg) {
      for (const [streamIndex, rowMap] of this.#sparkles) {
        const stream = this.#streams[streamIndex];
        const fontSize = stream?.fontSize ?? this.#fontSize;
        const x = streamIndex * this.#fontSize;

        for (const [rowIndex, sparkle] of rowMap.entries()) {
          const y = rowIndex * fontSize;

          if (x < 0 || x > width || y < 0 || y > height) {
            this.#removeSparkle(streamIndex, rowMap, rowIndex);
            continue;
          }

          sparkle.char = randomChar();
          sparkle.alpha -= sparkle.decay;
          if (sparkle.alpha <= 0) {
            this.#removeSparkle(streamIndex, rowMap, rowIndex);
            continue;
          }

          this.#ctx.globalAlpha = Math.max(0, sparkle.alpha);
          this.#ctx.font = `${fontSize}px monospace`;
          this.#ctx.fillStyle = fg;
          this.#drawChar(sparkle.char, width - x - fontSize, y);
        }
      }
    }

    #startAnimation() {
      if (this.#running || !this.#ctx || !this.#canvas) return;

      this.#running = true;
      let lastTime = null;
      let elapsedSeconds = 0;

      const drawFrame = (timestamp) => {
        if (!this.#running || !this.#ctx || !this.#canvas) return;

        if (lastTime === null) {
          lastTime = timestamp;
        }
        const deltaMs = timestamp - lastTime;
        lastTime = timestamp;
        const idealFrameMs = 1000 / TARGET_FPS;
        const frameFactor =
          Number.isFinite(deltaMs) && deltaMs > 0
            ? Math.max(
                FRAME_FACTOR_CLAMP.min,
                Math.min(
                  FRAME_FACTOR_CLAMP.max,
                  deltaMs / idealFrameMs,
                ),
              )
            : 1;

        if (deltaMs > 0 && Number.isFinite(deltaMs))
          elapsedSeconds += deltaMs / 1000;

        const width = this.#logicalWidth;
        const height = this.#logicalHeight;

        const isDark = this.#getIsDarkTheme();
        if (this.#lastDarkTheme !== isDark) {
          this.#lastDarkTheme = isDark;
          this.#applyThemeStyles();
        }

        const { bg, fg } = this.#themeColors(isDark);
        this.#ctx.fillStyle = bg;
        this.#ctx.fillRect(0, 0, width, height);

        this.#ctx.textBaseline = 'top';

        this.#ctx.save();
        this.#ctx.translate(width, 0);
        this.#ctx.scale(-1, 1);

        this.#activateStreamsTowardsDensity();

        this.#drawStreams(width, height, isDark, fg, elapsedSeconds, frameFactor);
        this.#drawSparkles(width, height, fg);

        this.#ctx.globalAlpha = 1.0;
        this.#setShadow(false);
        this.#ctx.restore();

        this.#animationFrameId = requestAnimationFrame(drawFrame);
      };

      this.#animationFrameId = requestAnimationFrame(drawFrame);
    }

    #stopAnimation() {
      this.#running = false;
      if (this.#animationFrameId !== null) {
        cancelAnimationFrame(this.#animationFrameId);
        this.#animationFrameId = null;
      }
    }

    show() {
      this.#showOverlay();
    }

    hide() {
      if (this.#overlay) this.#hideOverlay();
    }

    destroy() {
      if (this.#idleTimerId !== null) {
        clearTimeout(this.#idleTimerId);
        this.#idleTimerId = null;
      }
      if (this.#overlay) this.#hideOverlay();
      this.#removeActivityListeners();
      if (window.__matrixIdleScreensaverInstance === this) {
        window.__matrixIdleScreensaverInstance = null;
      }
    }
  }

  const init = () => {
    window.__matrixIdleScreensaverInstance?.destroy();
    window.__matrixIdleScreensaverInstance = new MatrixIdleScreensaver();
    return window.__matrixIdleScreensaverInstance;
  };

  window.MatrixIdle = {
    init() {
      return init();
    },
    show() {
      window.__matrixIdleScreensaverInstance?.show();
    },
    hide() {
      window.__matrixIdleScreensaverInstance?.hide();
    },
    destroy() {
      window.__matrixIdleScreensaverInstance?.destroy();
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(), { once: true });
  } else {
    init();
  }
})();
