const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("./users");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://rainfall-ai-wcsw-llcptuj1i-techtides.vercel.app",
      "https://rainfall-ai-wcsw.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.json());

// ===============================
// PORT
// ===============================
const PORT = process.env.PORT || 5000;

const JWT_SECRET =
  process.env.JWT_SECRET || "rainfall-ai-dev-secret";

// ===============================
// Piper executable
// Windows  -> piper.exe
// Linux    -> piper
// ===============================
const piperExecutable =
  process.platform === "win32"
    ? "piper.exe"
    : "piper";

const piperPath = path.join(
  __dirname,
  "piper",
  piperExecutable
);

// ===============================
// Voices folder
// ===============================
const voicesPath = path.join(
  __dirname,
  "voices"
);

// ===============================
// Piper voice models
// ===============================
const voiceModels = {
  ta: {
    model: "ta_IN-rasa_female-medium.onnx",
    config: "ta_IN-rasa_female-medium.onnx.json",
  },

  hi: {
    model: "hi_IN-pratham-medium.onnx",
    config: "hi_IN-pratham-medium.onnx.json",
  },

  te: {
    model: "te_IN-model.onnx",
    config: "te_IN-model.onnx.json",
  },

  kn: {
    model: "kn_IN-model.onnx",
    config: "kn_IN-model.onnx.json",
  },

  ml: {
    model: "ml_IN-model.onnx",
    config: "ml_IN-model.onnx.json",
  },

  bn: {
    model: "bn_IN-model.onnx",
    config: "bn_IN-model.onnx.json",
  },

  en: {
    model: "en_US-lessac-medium.onnx",
    config: "en_US-lessac-medium.onnx.json",
  },
};

// ===============================
// Test route
// ===============================
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ===============================
// LOGIN API
// ===============================
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email
  );

  if (!user) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );

  res.json({
    message: "Login successful",
    token,
    role: user.role,
  });
});

// ===============================
// AUTHENTICATION MIDDLEWARE
// ===============================
function authenticateToken(req, res, next) {
  const authHeader =
    req.headers["authorization"];

  const token =
    authHeader &&
    authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err, user) => {
      if (err) {
        return res.status(403).json({
          error: "Invalid or expired token",
        });
      }

      req.user = user;
      next();
    }
  );
}

// ===============================
// PROTECTED ADMIN/AUTHORITY API
// ===============================
app.get(
  "/api/admin/dashboard",
  authenticateToken,
  (req, res) => {
    if (
      req.user.role !== "ADMIN" &&
      req.user.role !== "AUTHORITY"
    ) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    res.json({
      message:
        "Protected dashboard access granted",
      user: req.user,
    });
  }
);

// ===============================
// VOICE API
// ===============================
app.post("/api/voice", (req, res) => {
  const text = req.body.text;
  const language =
    req.body.language || "ta";

  // Check text
  if (!text) {
    return res.status(400).json({
      error: "Text is required",
    });
  }

  // Find selected language
  const voice = voiceModels[language];

  if (!voice) {
    return res.status(400).json({
      error:
        "Unsupported language: " +
        language,
    });
  }

  // Model path
  const modelPath = path.join(
    voicesPath,
    voice.model
  );

  // Config path
  const configPath = path.join(
    voicesPath,
    voice.config
  );

  // Check model
  if (!fs.existsSync(modelPath)) {
    return res.status(400).json({
      error:
        "Voice model not found: " +
        voice.model,
    });
  }

  // Check config
  if (!fs.existsSync(configPath)) {
    return res.status(400).json({
      error:
        "Voice config not found: " +
        voice.config,
    });
  }

  // Check Piper
  if (!fs.existsSync(piperPath)) {
    return res.status(500).json({
      error:
        "Piper executable not found: " +
        piperExecutable,
    });
  }

  // Output WAV file
  const outputFile = path.join(
    __dirname,
    "voice-" +
      Date.now() +
      ".wav"
  );

  // Start Piper
  const piper = spawn(
    piperPath,
    [
      "-m",
      modelPath,
      "-c",
      configPath,
      "-f",
      outputFile,
    ]
  );

  let errorOutput = "";

  // Capture Piper errors
  piper.stderr.on(
    "data",
    (data) => {
      errorOutput +=
        data.toString();
    }
  );

  // Send text to Piper
  piper.stdin.write(
    text + "\n"
  );

  piper.stdin.end();

  // Piper finished
  piper.on(
    "close",
    (code) => {
      if (
        code !== 0 ||
        !fs.existsSync(outputFile)
      ) {
        console.error(
          "Piper error:",
          errorOutput
        );

        return res.status(500).json({
          error:
            "Piper voice generation failed",
          details: errorOutput,
        });
      }

      // Send generated audio
      res.sendFile(
        outputFile,
        (error) => {
          // Delete temporary WAV file
          fs.unlink(
            outputFile,
            () => {}
          );

          if (error) {
            console.error(
              "Send file error:",
              error
            );
          }
        }
      );
    }
  );

  // Piper process error
  piper.on(
    "error",
    (error) => {
      console.error(
        "Piper process error:",
        error
      );

      if (!res.headersSent) {
        return res.status(500).json({
          error:
            "Unable to start Piper",
          details:
            error.message,
        });
      }
    }
  );
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    "Backend running on port " +
      PORT
  );
});