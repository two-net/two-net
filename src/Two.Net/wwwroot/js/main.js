(function(){
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function(s,c){ return (c||document).querySelector(s); };
  var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };

  /* ── Theme toggle (in-memory only) ── */
  var themeBtn = $("#themeBtn"), moon = $("#iconMoon"), sun = $("#iconSun");
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
  themeBtn.addEventListener("click", function(){
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
  function setTheme(t){
    document.documentElement.setAttribute("data-theme", t);
    var dark = t === "dark";
    moon.style.display = dark ? "none" : "";
    sun.style.display  = dark ? "" : "none";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }

  /* ── Scroll progress + back-to-top ── */
  var progress = $("#progress"), toTop = $("#toTop");
  window.addEventListener("scroll", function(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    toTop.classList.toggle("show", h.scrollTop > 600);
  }, {passive:true});
  toTop.addEventListener("click", function(){ window.scrollTo({top:0, behavior: reduced ? "auto" : "smooth"}); });

  /* ── Active nav link ── */
  var navMap = {};
  $$("#navlinks a").forEach(function(a){ navMap[a.getAttribute("href").slice(1)] = a; });
  var secObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting && navMap[e.target.id]) {
        $$("#navlinks a").forEach(function(a){ a.classList.remove("active"); });
        navMap[e.target.id].classList.add("active");
      }
    });
  }, {rootMargin: "-35% 0px -55% 0px"});
  ["about","skills","experience","portfolio","more"].forEach(function(id){
    var el = document.getElementById(id); if (el) secObs.observe(el);
  });

  /* ── Scroll reveal ── */
  var revObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add("in"); revObs.unobserve(e.target); }
    });
  }, {threshold: 0.08});
  $$(".reveal").forEach(function(el, i){
    if (reduced){ el.classList.add("in"); return; }
    el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
    revObs.observe(el);
  });

  /* ── Typewriter headline ── */
  var roles = [
    "Senior Software Developer",
    "Full-stack Developer",
    ".NET · Angular · Java · React",
    "13+ years of enterprise systems"
  ];
  var typed = $("#typed");
  if (!reduced) {
    var ri = 0, ci = roles[0].length, deleting = true, first = true;
    (function tick(){
      var word = roles[ri];
      if (first) { first = false; setTimeout(tick, 2200); return; }
      if (deleting) {
        ci--; typed.textContent = word.slice(0, ci);
        if (ci === 0){ deleting = false; ri = (ri + 1) % roles.length; }
        setTimeout(tick, 32);
      } else {
        word = roles[ri]; ci++;
        typed.textContent = word.slice(0, ci);
        if (ci === word.length){ deleting = true; setTimeout(tick, 2400); return; }
        setTimeout(tick, 58);
      }
    })();
  }

  /* ── Count-up stats ── */
  var statsDone = false;
  var statObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting || statsDone) return;
      statsDone = true;
      $$("#stats .n").forEach(function(el){
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        if (reduced){ el.textContent = target + suffix; return; }
        var t0 = null;
        function step(ts){
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1200, 1);
          p = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
          el.textContent = Math.round(target * p) + (p === 1 ? suffix : "");
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    });
  }, {threshold: 0.4});
  statObs.observe($("#stats"));

  /* ── Live role durations (LinkedIn-style "2 yrs 6 mos") ── */
  $$("[data-start]").forEach(function(span){
    var s = span.getAttribute("data-start").split("-").map(Number);
    var eAttr = span.getAttribute("data-end");
    var now = new Date();
    var e = (eAttr === "present") ? [now.getFullYear(), now.getMonth() + 1] : eAttr.split("-").map(Number);
    var months = (e[0] - s[0]) * 12 + (e[1] - s[1]) + 1; /* inclusive, like LinkedIn */
    var y = Math.floor(months / 12), m = months % 12, parts = [];
    if (y) parts.push(y + (y === 1 ? " yr" : " yrs"));
    if (m) parts.push(m + (m === 1 ? " mo" : " mos"));
    var durEl = span.parentElement.querySelector(".dur");
    if (durEl) durEl.textContent = parts.join(" ") || "1 mo";
  });

  /* ── About: see more / see less ── */
  var clamp = $("#aboutClamp"), aboutToggle = $("#aboutToggle");
  aboutToggle.addEventListener("click", function(){
    var open = clamp.classList.toggle("open");
    aboutToggle.textContent = open ? "see less" : "…see more";
    aboutToggle.setAttribute("aria-expanded", String(open));
  });

  /* ── Skills: tabs + search ── */
  var skillsWrap = $("#skillsWrap");
  var tabs = $$("#skillTabs .tab");
  var groups = $$(".skill-group", skillsWrap);
  var allSkills = $$(".skill", skillsWrap);
  var search = $("#skillSearch");
  var countEl = $("#searchCount");
  allSkills.forEach(function(ch){ ch.setAttribute("data-txt", ch.textContent.toLowerCase()); });

  tabs.forEach(function(tab){
    tab.addEventListener("click", function(){
      search.value = ""; exitSearch();
      tabs.forEach(function(t){ t.classList.remove("active"); });
      tab.classList.add("active");
      groups.forEach(function(g){
        var on = g.getAttribute("data-cat") === tab.getAttribute("data-cat");
        g.classList.toggle("on", on);
        if (on) restagger(g);
      });
    });
  });

  search.addEventListener("input", function(){
    var q = search.value.trim().toLowerCase();
    if (!q){ exitSearch(); return; }
    skillsWrap.classList.add("searching");
    var total = 0;
    groups.forEach(function(g){
      var visible = 0;
      $$(".skill", g).forEach(function(ch){
        var raw = ch.getAttribute("data-txt");
        var hit = raw.indexOf(q) !== -1;
        ch.classList.toggle("hide", !hit);
        if (hit){
          visible++;
          var text = ch.textContent;
          var at = raw.indexOf(q);
          ch.innerHTML = escapeHtml(text.slice(0, at)) + "<mark>" +
                         escapeHtml(text.slice(at, at + q.length)) + "</mark>" +
                         escapeHtml(text.slice(at + q.length));
        }
      });
      g.classList.toggle("empty", visible === 0);
      total += visible;
    });
    countEl.textContent = total ? total + (total === 1 ? " skill matches" : " skills match") + " \u201C" + search.value.trim() + "\u201D"
                                : "No skills match \u201C" + search.value.trim() + "\u201D";
  });

  function exitSearch(){
    skillsWrap.classList.remove("searching");
    countEl.textContent = "";
    allSkills.forEach(function(ch){
      ch.classList.remove("hide");
      ch.textContent = ch.textContent; /* strip <mark> */
    });
    groups.forEach(function(g){ g.classList.remove("empty"); });
  }
  function restagger(group){
    if (reduced) return;
    $$(".skill", group).forEach(function(ch, i){
      ch.style.animation = "none"; void ch.offsetWidth; /* restart */
      ch.style.animation = "";
      ch.style.animationDelay = Math.min(i * 22, 400) + "ms";
    });
  }
  function escapeHtml(s){
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
  restagger(groups[0]);

  /* ── Experience: accordions + expand all ── */
  var projs = $$(".proj");
  projs.forEach(function(p){
    var head = $(".proj-head", p);
    head.addEventListener("click", function(){
      var open = p.classList.toggle("open");
      head.setAttribute("aria-expanded", String(open));
      syncExpandAll();
    });
  });
  var expandAll = $("#expandAll"), expandAllLabel = $("span", expandAll);
  expandAll.addEventListener("click", function(){
    var openAll = expandAll.getAttribute("aria-pressed") !== "true";
    projs.forEach(function(p){
      p.classList.toggle("open", openAll);
      $(".proj-head", p).setAttribute("aria-expanded", String(openAll));
    });
    setExpandAll(openAll);
  });
  function syncExpandAll(){
    setExpandAll(projs.every(function(p){ return p.classList.contains("open"); }));
  }
  function setExpandAll(state){
    expandAll.setAttribute("aria-pressed", String(state));
    expandAllLabel.textContent = state ? "Collapse all" : "Expand all";
  }

  /* ── Portfolio filters ── */
  var pfBtns = $$("#pfFilters .tab");
  var pfCards = $$("#pfGrid .pf");
  var pfCount = $("#pfCount");
  pfBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
      pfBtns.forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      var shown = 0;
      pfCards.forEach(function(card){
        var show = f === "all" || (" " + card.getAttribute("data-tags") + " ").indexOf(" " + f + " ") !== -1;
        card.classList.toggle("hide", !show);
        if (show) shown++;
      });
      pfCount.textContent = "Showing " + shown + " of " + pfCards.length + " systems";
    });
  });

  /* ── Language bars animate in ── */
  var barObs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      $$(".lang-bar span", e.target).forEach(function(b){
        b.style.width = b.getAttribute("data-w") + "%";
      });
      barObs.unobserve(e.target);
    });
  }, {threshold: 0.3});
  barObs.observe($("#more"));
})();
