(function () {
  var yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  var header = document.querySelector(".site-header");
  function syncHeaderState() {
    if (!header) {
      return;
    }
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", syncHeaderState, { passive: true });
  syncHeaderState();

  var revealNodes = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  revealNodes.forEach(function (node, index) {
    node.style.setProperty("--reveal-delay", String(index * 70) + "ms");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  } else {
    revealNodes.forEach(function (node) {
      node.classList.add("visible");
    });
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sectionIds = navLinks
    .map(function (link) {
      var hash = link.getAttribute("href");
      return hash && hash.startsWith("#") ? hash.slice(1) : null;
    })
    .filter(Boolean);

  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  function setActiveLink() {
    var current = "";
    var scrollPoint = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(function (section) {
      if (scrollPoint >= section.offsetTop) {
        current = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) {
        return;
      }
      var target = href.replace("#", "");
      if (target === current) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  var copyBtn = document.getElementById("copy-email-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = "evanngregorio@gmail.com";

      function setButtonText(text) {
        copyBtn.textContent = text;
        setTimeout(function () {
          copyBtn.textContent = "Copy Email";
        }, 1300);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () {
            setButtonText("Copied");
          },
          function () {
            setButtonText("Copy failed");
          }
        );
        return;
      }

      var temp = document.createElement("textarea");
      temp.value = email;
      temp.setAttribute("readonly", "true");
      temp.style.position = "absolute";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);
      temp.select();

      try {
        var success = document.execCommand("copy");
        if (success) {
          setButtonText("Copied");
        } else {
          setButtonText("Copy failed");
        }
      } catch (err) {
        setButtonText("Copy failed");
      }

      document.body.removeChild(temp);
    });
  }
})();