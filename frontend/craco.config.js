// craco.config.js
const path = require("path");
const fs = require("fs");

const envFiles = [".env.local", ".env"];
envFiles.forEach((file) => {
  const envPath = path.resolve(__dirname, file);
  if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
  }
});

// Environment variable overrides
const config = {
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

function makeDevServerV5Compatible(devServerConfig) {
  const {
    https,
    onAfterSetupMiddleware,
    onBeforeSetupMiddleware,
    onListening,
    setupMiddlewares,
    ...compatibleConfig
  } = devServerConfig;

  compatibleConfig.server =
    typeof https === "object"
      ? { type: "https", options: https }
      : https
        ? "https"
        : "http";
  compatibleConfig.headers = {
    ...compatibleConfig.headers,
    "Cross-Origin-Resource-Policy": "same-origin",
  };

  if (onBeforeSetupMiddleware || setupMiddlewares) {
    compatibleConfig.setupMiddlewares = (middlewares, devServer) => {
      if (onBeforeSetupMiddleware) {
        onBeforeSetupMiddleware(devServer);
      }

      return setupMiddlewares
        ? setupMiddlewares(middlewares, devServer)
        : middlewares;
    };
  }

  compatibleConfig.onListening = (devServer) => {
    devServer.close ??= (callback) => devServer.stopCallback(callback);

    if (onListening) {
      onListening(devServer);
    }
    if (onAfterSetupMiddleware) {
      onAfterSetupMiddleware(devServer);
    }
  };

  return compatibleConfig;
}

// Conditionally load health check modules only if enabled
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function validateContactForm(form) {
  if (!form.name || !form.email || !form.type || !form.message) {
    return "Name, email, enquiry type and message are required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    return "A valid email address is required.";
  }

  return "";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildContactEmailHtml(form) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <h2>New NZ Sings Bollywood website enquiry</h2>
      <p><strong>Enquiry type:</strong> ${escapeHtml(form.type)}</p>
      <p><strong>Name:</strong> ${escapeHtml(form.name)}</p>
      <p><strong>Organisation:</strong> ${escapeHtml(form.organisation || "-")}</p>
      <p><strong>Email:</strong> ${escapeHtml(form.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(form.phone || "-")}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0" />
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(form.message)}</p>
    </div>
  `;
}

async function handleLocalContactApi(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json", Allow: "POST" });
    res.end(JSON.stringify({ ok: false, error: "Method not allowed." }));
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "PASTE_YOUR_RESEND_API_KEY_HERE") {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "RESEND_API_KEY is missing." }));
    return;
  }

  try {
    const form = await parseJsonBody(req);
    const validationError = validateContactForm(form);

    if (validationError) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: validationError }));
      return;
    }

    const toEmails = (process.env.CONTACT_TO_EMAILS || "nzsingsbollywood@gmail.com,nzsingsbollywood27@gmail.com")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "NZ Sings Bollywood <onboarding@resend.dev>",
        to: toEmails,
        reply_to: form.email || process.env.CONTACT_REPLY_TO || "nzsingsbollywood@gmail.com",
        subject: `[${form.type}] Website enquiry — ${form.name}`,
        html: buildContactEmailHtml(form),
        text: [
          "New NZ Sings Bollywood website enquiry",
          "",
          `Enquiry type: ${form.type}`,
          `Name: ${form.name}`,
          `Organisation: ${form.organisation || "-"}`,
          `Email: ${form.email}`,
          `Phone: ${form.phone || "-"}`,
          "",
          "Message:",
          form.message,
        ].join("\n"),
      }),
    });

    const result = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      res.writeHead(resendResponse.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: result.message || "Resend failed to send the enquiry." }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, id: result.id }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: false, error: "Email service error." }));
  }
}

let webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    configure: (webpackConfig) => {
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/build/**",
          "**/dist/**",
          "**/coverage/**",
          "**/public/**",
        ],
      };

      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }

      return webpackConfig;
    },
  },
};

webpackConfig.devServer = (devServerConfig) => {
  const originalSetupMiddlewares = devServerConfig.setupMiddlewares;

  devServerConfig.setupMiddlewares = (middlewares, devServer) => {
    if (originalSetupMiddlewares) {
      middlewares = originalSetupMiddlewares(middlewares, devServer);
    }

    devServer.app.post("/api/contact", handleLocalContactApi);

    if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
      setupHealthEndpoints(devServer, healthPluginInstance);
    }

    return middlewares;
  };

  return devServerConfig;
};

const configureDevServer = webpackConfig.devServer;
webpackConfig.devServer = (devServerConfig) =>
  makeDevServerV5Compatible(configureDevServer(devServerConfig));

module.exports = webpackConfig;
