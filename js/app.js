"use strict";

/*
 * love-reasons — one reason a day, plus a shareable card.
 * Everything is client-side; nothing is uploaded anywhere.
 */

(function () {
  function dailyIndex(length, date) {
    const key =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate();
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return length ? hash % length : 0;
  }

  function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let line = "";

    words.forEach((word) => {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });

    if (line) lines.push(line);
    return lines;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const REASONS = Array.isArray(window.MENA_REASONS)
      ? window.MENA_REASONS.slice()
      : [];

    const els = {
      text: document.getElementById("reason-text"),
      button: document.getElementById("reason-button"),
      date: document.getElementById("reason-date"),
      list: document.getElementById("reason-list"),
      canvas: document.getElementById("reason-card"),
      download: document.getElementById("download-card")
    };

    if (!REASONS.length) {
      if (els.text) els.text.textContent = "Add some reasons to get started.";
      return;
    }

    let current = REASONS[dailyIndex(REASONS.length, new Date())];

    function drawCard(reason) {
      const canvas = els.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const W = canvas.width;
      const H = canvas.height;

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#120f2e");
      bg.addColorStop(0.55, "#241546");
      bg.addColorStop(1, "#3d1235");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(W / 2, H * 0.32, 40, W / 2, H * 0.32, W * 0.7);
      glow.addColorStop(0, "rgba(255, 159, 207, 0.28)");
      glow.addColorStop(1, "rgba(255, 159, 207, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Deterministic sprinkle of stars.
      let seed = 1234567;
      const rand = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };
      for (let i = 0; i < 90; i += 1) {
        const x = rand() * W;
        const y = rand() * H;
        const r = rand() * 1.8 + 0.4;
        ctx.globalAlpha = 0.25 + rand() * 0.5;
        ctx.fillStyle = "#ffe9fb";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      ctx.textAlign = "center";

      ctx.fillStyle = "#ff9fcf";
      ctx.font = '600 34px "Segoe UI", Arial, sans-serif';
      ctx.fillText("A REASON I LOVE YOU", W / 2, 168);

      ctx.fillStyle = "rgba(255, 159, 207, 0.9)";
      ctx.font = '400 64px Georgia, "Times New Roman", serif';
      ctx.fillText("\u2665", W / 2, 300);

      ctx.fillStyle = "#f7f2ff";
      ctx.font = '600 62px Georgia, "Times New Roman", serif';
      const lines = wrapText(ctx, reason, W - 220);
      const lineHeight = 82;
      const startY = H / 2 - ((lines.length - 1) * lineHeight) / 2 + 20;
      lines.forEach((line, i) => {
        ctx.fillText(line, W / 2, startY + i * lineHeight);
      });

      ctx.fillStyle = "#ffd9ee";
      ctx.font = '600 40px "Segoe UI", Arial, sans-serif';
      ctx.fillText("For Mena \u2665", W / 2, H - 150);

      ctx.fillStyle = "rgba(247, 242, 255, 0.55)";
      ctx.font = '400 28px "Segoe UI", Arial, sans-serif';
      ctx.fillText(
        new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        }),
        W / 2,
        H - 96
      );
    }

    function render() {
      if (els.text) els.text.textContent = current;
      if (els.text) {
        els.text.classList.remove("pop");
        void els.text.offsetWidth;
        els.text.classList.add("pop");
      }
      drawCard(current);
    }

    if (els.date) {
      const today = new Date();
      els.date.textContent = today
        .toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric"
        })
        .toUpperCase();
    }

    if (els.button) {
      els.button.addEventListener("click", () => {
        let next = current;
        if (REASONS.length > 1) {
          while (next === current) {
            next = REASONS[Math.floor(Math.random() * REASONS.length)];
          }
        }
        current = next;
        render();
      });
    }

    if (els.download) {
      els.download.addEventListener("click", () => {
        const canvas = els.canvas;
        if (!canvas || !canvas.toBlob) return;
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "a-reason-for-mena.png";
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
          if (typeof window.fxToast === "function") {
            window.fxToast("Card saved \u2014 keep it somewhere safe \u2665");
          }
        }, "image/png");
      });
    }

    if (els.list) {
      REASONS.forEach((reason) => {
        const li = document.createElement("li");
        li.textContent = reason;
        els.list.appendChild(li);
      });
    }

    render();

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  });
})();
