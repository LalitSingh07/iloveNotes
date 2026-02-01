// import { kv } from "@vercel/kv";

// export default async function handler(req, res) {
//   const { key } = req.query;

//   const text = (await kv.get(key)) || "";

//   res.setHeader("Content-Type", "text/html");
//   res.status(200).send(`
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>/${key}</title>
//   <style>
//     body {
//       margin: 0;
//       background: #0f0f0f;
//       color: #fff;
//       font-family: monospace;
//     }
//     header {
//       padding: 10px;
//       background: #111;
//       color: #aaa;
//     }
//     textarea {
//       width: 100%;
//       height: 92vh;
//       background: #0f0f0f;
//       color: #fff;
//       border: none;
//       outline: none;
//       padding: 16px;
//       font-size: 15px;
//     }
//   </style>
// </head>
// <body>

// <header>Editing: /${key}</header>
// <textarea>${escapeHtml(text)}</textarea>

// </body>
// </html>
//   `);
// }

// // prevent HTML break
// function escapeHtml(text) {
//   return text
//     .replaceAll("&", "&amp;")
//     .replaceAll("<", "&lt;")
//     .replaceAll(">", "&gt;");
// } 
// -------------------------------------------------------
// export default function handler(req, res) {
//   const { key } = req.query;

//   res.status(200).send(`
//     <h1>WORKING</h1>
//     <p>Key: ${key}</p>
//   `);
// }
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { key } = req.query;

  // ---------- HANDLE SAVE ----------
  if (req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const params = new URLSearchParams(body);
      const text = params.get("text") || "";

      await kv.set(key, text);

      // Redirect back to GET
      res.writeHead(302, { Location: `/api/text/${key}` });
      res.end();
    });

    return;
  }

  // ---------- HANDLE LOAD ----------
  const text = (await kv.get(key)) || "";

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>/${key}</title>
  <style>
    body {
      margin: 0;
      background: #0f0f0f;
      color: #fff;
      font-family: monospace;
    }
    header {
      padding: 10px 16px;
      background: #111;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #aaa;
    }
    textarea {
      width: 100%;
      height: 90vh;
      background: #0f0f0f;
      color: #fff;
      border: none;
      outline: none;
      padding: 16px;
      font-size: 15px;
    }
    button {
      background: #222;
      color: #fff;
      border: 1px solid #333;
      padding: 6px 14px;
      cursor: pointer;
    }
  </style>
</head>
<body>

<header>
  <div>Editing: /${key}</div>
  <form method="POST">
    <button type="submit">Save</button>
  </form>
</header>

<form method="POST">
  <textarea name="text">${escapeHtml(text)}</textarea>
</form>

</body>
</html>
  `);
}

// Prevent HTML injection
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
