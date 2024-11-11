import * as deepar from "deepar";
import Carousel from "./carousel.js";

// Log the version. Just in case.
console.log("Deepar version: " + deepar.version);

// Top-level await is not supported.
// So we wrap the whole code in an async function that is called immediatly.
(async function () {
  // Resize the canvas according to screen size and pixel ratio.
  const canvas = document.getElementById("deepar-canvas");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);

  // trigger loading progress bar animation
  const loadingProgressBar = document.getElementById("loading-progress-bar");
  loadingProgressBar.style.width = "100%";

  // All the effects are in the public/effects folder.
  // Here we define the order of effect files.
  const effectList = [
    // "effects/sunglass_filter.deepar",
    // "effects/MakeupLook.deepar",
    // "effects/shoe_tryon.deepar",
    "effects/shoe_3d.deepar"
  ];

  let deepAR = null;

  // Initialize DeepAR with an effect file.
  try {
    deepAR = await deepar.initialize({
      licenseKey: "d636f5f81777539ab7c65b5a1df6a918ef1e7fc4e3dc0fd21a6d44cb02b19eb66b2133b7b1b0cf42",
      canvas,
      effect: effectList[0],
      // Removing the rootPath option will make DeepAR load the resources from the JSdelivr CDN,
      // which is fine for development but is not recommended for production since it's not optimized for performance and can be unstable.
      // More info here: https://docs.deepar.ai/deepar-sdk/deep-ar-sdk-for-web/download-optimizations#custom-deployment-of-deepar-web-resources
      rootPath: "./deepar-resources",
      additionalOptions:{
        cameraConfig:{
            facingMode:"user",
            //disableDefaultCamera: true
        },
      }
    });
  } catch (error) {
    console.error(error);
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("permission-denied-screen").style.display = "block";
    return;
  }

  var resizeCanvas = function () {
    const canvas = document.getElementById("deepar-canvas");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
  };

  window.addEventListener("resize", resizeCanvas);

  // Hide the loading screen.
  document.getElementById("loading-screen").style.display = "none";
  document.getElementById("ar-screen").style.display = "block";

  window.effect = effectList[0];

  async function turnVideo(facingTo) {
    // const constraints = {
    //   video: { facingMode:facingTo },
    // };

    var video = document.getElementById('ar-screen');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    
    const cameraOption = {
      mediaStreamConstraints: { facingMode:facingTo }
  }

   await deepAR.startCamera(cameraOption);
  }


  const glassesCarousel = new Carousel("carousel");
  glassesCarousel.onChange = async (value) => {
    const loadingSpinner = document.getElementById("loading-spinner");

    if (window.effect !== effectList[value]) {
      loadingSpinner.style.display = "block";
      
      if(value == 2)
      {
        window.open("https://joysticklab.com/ar-shoe","_self");
      }
      // if(value == 2)
      // {
      //   turnVideo("environment");
      // }

      // else
      // {
      //   turnVideo("user");
      // }

      await deepAR.switchEffect(effectList[value]);
      window.effect = effectList[value];
    }
    loadingSpinner.style.display = "none";
  };
})();
