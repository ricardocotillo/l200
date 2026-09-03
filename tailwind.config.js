/** @type {import("tailwindcss").Config} */
module.exports = {
  "content": [
    "./*.html",
    "./src/**/*.js"
  ],
  "darkMode": "class",
  "theme": {
    "extend": {
      "colors": {
        "surface-container-high": "#242b31",
        "on-tertiary-container": "#af7800",
        "tertiary-fixed": "#ffddaf",
        "on-primary": "#303031",
        "on-secondary-container": "#aeb5c3",
        "on-surface": "#dde3eb",
        "inverse-surface": "#dde3eb",
        "tertiary": "#ffba43",
        "on-primary-container": "#848283",
        "background": "#0e141a",
        "secondary-fixed-dim": "#c0c7d5",
        "primary": "#c8c6c7",
        "surface-container-highest": "#2f353c",
        "inverse-on-surface": "#2b3137",
        "surface-dim": "#0e141a",
        "on-tertiary-fixed": "#281800",
        "on-secondary-fixed": "#151c26",
        "on-primary-fixed": "#1b1b1c",
        "surface-variant": "#2f353c",
        "secondary-fixed": "#dce3f1",
        "on-secondary": "#2a313c",
        "primary-fixed": "#e5e2e3",
        "secondary-container": "#404753",
        "error-container": "#93000a",
        "inverse-primary": "#5f5e5f",
        "outline": "#909094",
        "on-secondary-fixed-variant": "#404753",
        "surface-container": "#1a2026",
        "on-background": "#dde3eb",
        "surface": "#0e141a",
        "primary-container": "#1a1a1b",
        "primary-fixed-dim": "#c8c6c7",
        "surface-container-lowest": "#080f14",
        "secondary": "#c0c7d5",
        "on-surface-variant": "#c7c6ca",
        "tertiary-fixed-dim": "#ffba43",
        "on-primary-fixed-variant": "#474647",
        "outline-variant": "#46474a",
        "tertiary-container": "#261700",
        "on-tertiary": "#432c00",
        "error": "#ffb4ab",
        "on-error": "#690005",
        "on-tertiary-fixed-variant": "#614000",
        "surface-tint": "#c8c6c7",
        "surface-container-low": "#161c22",
        "surface-bright": "#333a40"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "gutter": "24px",
        "base": "8px",
        "section-padding-desktop": "120px",
        "section-padding-mobile": "60px",
        "container-max": "1280px"
      },
      "fontFamily": {
        "headline-sm": [
          "Montserrat"
        ],
        "display-lg": [
          "Montserrat"
        ],
        "body-lg": [
          "Inter"
        ],
        "label-caps": [
          "JetBrains Mono"
        ],
        "display-lg-mobile": [
          "Montserrat"
        ],
        "body-md": [
          "Inter"
        ],
        "headline-md": [
          "Montserrat"
        ]
      },
      "fontSize": {
        "headline-sm": [
          "24px",
          {
            "lineHeight": "32px",
            "fontWeight": "700"
          }
        ],
        "display-lg": [
          "64px",
          {
            "lineHeight": "72px",
            "letterSpacing": "-0.02em",
            "fontWeight": "800"
          }
        ],
        "body-lg": [
          "18px",
          {
            "lineHeight": "28px",
            "fontWeight": "400"
          }
        ],
        "label-caps": [
          "12px",
          {
            "lineHeight": "16px",
            "letterSpacing": "0.1em",
            "fontWeight": "600"
          }
        ],
        "display-lg-mobile": [
          "40px",
          {
            "lineHeight": "48px",
            "letterSpacing": "-0.01em",
            "fontWeight": "800"
          }
        ],
        "body-md": [
          "16px",
          {
            "lineHeight": "24px",
            "fontWeight": "400"
          }
        ],
        "headline-md": [
          "32px",
          {
            "lineHeight": "40px",
            "fontWeight": "700"
          }
        ]
      }
    }
  }
};
