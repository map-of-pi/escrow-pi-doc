import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import YAML from "yaml";

import { swaggerOptions } from "./config/swagger";
// import escrowComponentsRoutes from "./routes/escrow-components.routes";
import homeRoutes from "./routes/home.routes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

const openapiPath = path.resolve(process.cwd(), "openapi/escrowpi.yaml");
const swaggerSpec = fs.existsSync(openapiPath)
  ? YAML.parse(fs.readFileSync(openapiPath, "utf8"))
  : swaggerJsdoc(swaggerOptions);

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs_", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>EscrowPi API Docs</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Redoc CDN -->
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
        <style>
          .menu-content .search-input {
            color: #f8bb41 !important;
          }
          .menu-content .search-input::placeholder {
            color: #f8bb41 !important;
          }
          .menu-content .scrollbar-container li[role="menuitem"] > label > span {
            color: #ffffff !important;
          }
          .menu-content .scrollbar-container li[role="menuitem"]:hover > label > span {
            color: #f8bb41 !important;
          }
          .redoc-wrap {
            background-color: #e0f3e7 !important;
          }
        </style>
      </head>
      <body>
        <redoc spec-url="/swagger.json"></redoc>
        <script>
          Redoc.init("/swagger.json", {
            theme: {
              colors: {
                primary: {
                  main: "#ff6f61"
                },
                text: {
                  primary: "#222222",
                  secondary: "#555555"
                },
                responses: {
                  success: "#4caf50",
                  error: "#f44336"
                }
              },
              typography: {
                fontFamily: "Arial, sans-serif",
                headings: {
                  fontFamily: "Arial, sans-serif"
                }
              },
              sidebar: {
                width: "300px",
                backgroundColor: "#2a302a"
              }
            },
            expandResponses: "200,201" // auto expand successful responses
          }, document.querySelector('redoc'));
        </script>
      </body>
    </html>
  `);
});

// API routes
// app.use("/api/escrow-components", escrowComponentsRoutes);
app.use("/", homeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 EscrowPi API running on http://localhost:${PORT}`);
  console.log(`📘 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
