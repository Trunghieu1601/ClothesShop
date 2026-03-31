const { Client } = require("@gradio/client");
const axios = require("axios");
const { cloudinary } = require("../config/cloudinary");
const stream = require("stream");

// 1. Global variable to hold the Gradio client connection
let gradioApp;

// Helper function to create a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lazily connects to the Gradio space and returns the singleton client instance.
 * If the connection fails, it will be retried on the next request.
 * @returns {Promise<object>} The Gradio client instance.
 */
const getGradioApp = async () => {
  if (!gradioApp) {
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        gradioApp = await Client.connect("levihsu/OOTDiffusion", {
          hf_token: process.env.HF_TOKEN,
        });
        console.log("Gradio connection established successfully.");
        break;
      } catch (error) {
        console.error(`Connection attempt ${i + 1} failed:`, error.message);
        if (i === maxRetries - 1) {
          console.error("All connection attempts failed.");
          gradioApp = null;
          throw error;
        }
        console.log("Waiting 2 seconds before retrying connection...");
        await delay(2000);
      }
    }
  }
  return gradioApp;
};

const handleTryOn = async (req, res) => {
  try {
    // Validate that file buffers exist
    if (
      !req.files ||
      !req.files.personImage ||
      !req.files.personImage[0].buffer ||
      !req.files.clothImage ||
      !req.files.clothImage[0].buffer
    ) {
      const error = new Error(
        "Vui lòng tải lên đủ cả ảnh người và ảnh trang phục."
      );
      error.statusCode = 400;
      throw error;
    }

    // 2. Get the persistent Gradio client connection
    // Switch to OOTDiffusion as IDM-VTON is down
    const app = await getGradioApp();

    const personBuffer = req.files.personImage[0].buffer;
    const clothBuffer = req.files.clothImage[0].buffer;

    const personBlob = new Blob([personBuffer]);
    const clothBlob = new Blob([clothBuffer]);

    // Use /process_dc endpoint of OOTDiffusion
    // Inputs: vton_img, garm_img, category, n_samples, n_steps, image_scale, seed
    const predictArgs = [
      personBlob,          // vton_img
      clothBlob,           // garm_img
      "Upper-body",        // category (defaulting to Upper-body, could be dynamic)
      1,                   // n_samples
      20,                  // n_steps
      2,                   // image_scale
      -1,                  // seed
    ];

    let lastError;
    let result;

    // 3. Retry logic for the prediction call
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Prediction attempt ${attempt}...`);
        // Endpoint changed to /process_dc
        result = await app.predict("/process_dc", predictArgs);
        console.log("Prediction successful.");
        lastError = null;
        break;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error.message);
        lastError = error;
        if (
          error.message.includes("Could not connect") ||
          error.message.includes("fetch failed") || 
          error.message.includes("Could not resolve")
        ) {
          gradioApp = null;
        }
        if (attempt < 3) {
          console.log("Waiting 2 seconds before retrying...");
          await delay(2000);
        }
      }
    }

    if (lastError) {
      throw lastError;
    }

    console.log("Gradio Result Data:", JSON.stringify(result.data, null, 2));

    if (result && result.data && result.data.length > 0) {
      const output = result.data[0];
      let outputUrl = null;

      if (Array.isArray(output) && output.length > 0) {
          // Handle Gallery output (List of images)
          const firstItem = output[0];
          // Architecture: OOTDiffusion returns [{image: {url: "..."}}]
          if (firstItem.image && firstItem.image.url) {
             outputUrl = firstItem.image.url;
          } else if (firstItem.url) {
             outputUrl = firstItem.url;
          } else if (typeof firstItem === 'string') {
             outputUrl = firstItem;
          }
      } else if (typeof output === "string") {
        outputUrl = output;
      } else if (output && output.url) {
        outputUrl = output.url;
      }

      if (outputUrl && typeof outputUrl === 'string') {
        // Fix relative URLs from Gradio
        if (outputUrl.startsWith("/")) {
          outputUrl = "https://levihsu-ootdiffusion.hf.space" + outputUrl;
        }
        
        console.log("Extracted Output URL:", outputUrl);

        // --- NEW LOGIC: Download and Upload to Cloudinary ---
        try {
          console.log("Downloading image from Gradio...");
          const imageResponse = await axios.get(outputUrl, {
            responseType: "arraybuffer",
          });

          console.log("Uploading to Cloudinary...");
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "tryon_results",
                resource_type: "image",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            const bufferStream = new stream.PassThrough();
            bufferStream.end(imageResponse.data);
            bufferStream.pipe(uploadStream);
          });

          console.log("Cloudinary Upload Success:", uploadResult.secure_url);
          return res.json({ resultUrl: uploadResult.secure_url });

        } catch (uploadError) {
          console.error("Error persisting image to Cloudinary:", uploadError);
          // Fallback: Return original URL if upload fails (though it might expire)
          return res.json({ resultUrl: outputUrl });
        }
        // ----------------------------------------------------
      }
    }

    throw new Error("API did not return a valid result URL after retries.");
  } catch (error) {
    console.error("Lỗi khi xử lý thử đồ ảo (sau khi thử lại):", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Đã có lỗi xảy ra từ server khi thử đồ.",
    });
  }
};

module.exports = { handleTryOn };
