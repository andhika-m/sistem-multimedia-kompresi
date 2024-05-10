const inputImage = document.getElementById("image-file");
const imagePreview = document.getElementById("image-preview");
const size = document.getElementById("imageSize");

inputImage.addEventListener("change", () => {
  const file = inputImage.files[0];
  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", (e) => {
      imagePreview.src = e.target.result;
    });

    reader.readAsDataURL(file);

    const fileSize = (file.size / 1024).toFixed(2); // Convert to KB
    size.textContent = `${fileSize} KB`;
  } else {
    imagePreview.src = "#";
    size.textContent = "";
  }
});

const inputAudio = document.getElementById("audio-file");
const audioPreview = document.getElementById("audio-preview");
const audioSize = document.getElementById("audioSize");

let audioPreviewFile;
inputAudio.addEventListener("change", () => {
  const file = inputAudio.files[0];
  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", (e) => {
      // console.log("audio ==>> ", e.target.result);
      const audioElement = document.createElement("audio");
      audioElement.src = e.target.result;
      audioElement.controls = true;
      audioPreview.innerHTML = "";
      audioPreview.innerHTML = `<audio controls class="d-flex mx-auto" style="margin-top: 7em;">
                                  <source src="" type="audio/wav" id="audio-preview-file"></source>
                                  Your browser does not support the audio element.
                                </audio>`;
      audioPreviewFile = document.getElementById("audio-preview-file");
      audioPreviewFile.src = e.target.result;
    });

    reader.readAsDataURL(file);

    const fileSize = (file.size / 1024).toFixed(2); // Convert to KB
    audioSize.textContent = `${fileSize} KB`;
  } else {
    audioPreviewFile.src = "#";
    audioSize.textContent = "";
  }
});
