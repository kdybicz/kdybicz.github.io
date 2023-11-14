/* Javascript to show and hide cookie banner using localstorage */
/* Shows the Cookie banner */
function showCookieBanner(){
  let cookieBanner = document.getElementById("cookie-banner");
  cookieBanner.style.display = "block";
 }

 /* Hides the Cookie banner and saves the value to localstorage */
 function hideCookieBanner(){
  localStorage.setItem("isCookieBannerHidden", "yes");
  let cookieBanner = document.getElementById("cookie-banner");
  cookieBanner.style.display = "none";
 }

 /* Checks the localstorage and shows Cookie banner based on it. */
 function initializeCookieBanner(){
  let isCookieBannerHidden = localStorage.getItem("isCookieBannerHidden");
  if(isCookieBannerHidden === null)
  {
   localStorage.setItem("isCookieBannerHidden", "no");
   showCookieBanner();
  }
  if(isCookieBannerHidden === "no"){
   showCookieBanner();
  }
 }

 window.onload = initializeCookieBanner();
