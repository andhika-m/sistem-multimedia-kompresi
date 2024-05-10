const express = require("express");
const multer = require("multer");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const upload = multer({
  dest: "/tmp",
});

app.set("view engine", "ejs");
app.use(express.static( __dirname +"/views/"));

let imageSize;
app.get("/", (req, res) => {
  res.render("index", {
    imageSize,
  });
});

app.post("/convert", upload.single("audio"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No audio file uploaded");
  }

  const filePath = "/../../../../.." + req.file.path;
  const outputFileName = "converted_" + req.file.originalname;
 console.log("audio compression");
  ffmpeg(filePath)
    .toFormat("mp3")
    .output(outputFileName)
    .on("end", () => {
      console.log("Conversion complete");
      res.download(outputFileName, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
        }
       console.log(req.file)
       console.log("audio => ", filePath)
        // Clean up the temporary files
        deleteTemporaryFiles([filePath, outputFileName]);
      });
    })
    .on("error", (err) => {
      console.error("Error converting file:", err);
      res.status(500).send("Error converting file");
    })
    .run();
});

app.post("/compress", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image file uploaded");
  }

  const filePath = "/../../../../.." + req.file.path;
  const outputFileName = "compressed_" + req.file.originalname;
  const quality = 80;
console.log("image compression");
  try {
    await sharp(filePath)
      .jpeg({
        quality,
      })
      .toFile(outputFileName);
console.log("imagecompression complete");
    res.download(outputFileName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
      }
      
        console.log(req.file)
console.log("Image =>", filePath)
      // Clean up the temporary files
      deleteTemporaryFiles([filePath, outputFileName]);
    });
  } catch (err) {
    console.error("Error compressing image:", err);
    return res.status(500).send("Error compressing image");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function deleteTemporaryFiles(files) {
  files.forEach((file) => {
    fs.unlink(file, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
  });
}
