let boolean = document.hidden;
let link = document.querySelector("link[rel~='icon']");

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") {
    document.title = "We miss you!";
    link.href = "../dist/img/logo-missyou.svg";
  } else {
    document.title = "Find your Serie Seoulmate";
    link.href = "../dist/img/logo.svg";
  }
});

