const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

(async () => {
    try {
        // Path to HTML file (renamed to index.html)
        const htmlPath = path.join(__dirname, "..", "index.html");

        if (!fs.existsSync(htmlPath)) {
            console.error("❌ HTML file not found:", htmlPath);
            process.exit(1);
        }

        const htmlUrl = "file://" + htmlPath.replace(/\\/g, "/");

        // Output folder
        const outputDir = path.join(__dirname, "..", "storage", "pdf");
        const pdfFile = path.join(outputDir, "resume-oleksandr-stanov.pdf");

        // Create folder if missing
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.goto(htmlUrl, { waitUntil: "networkidle0" });

        await page.pdf({
            path: pdfFile,
            format: "A4",
            printBackground: true,
            margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" }
        });

        await browser.close();
        console.log("✅ PDF successfully generated:");
        console.log("→ " + pdfFile);

    } catch (err) {
        console.error("❌ Error generating PDF:", err);
        process.exit(1);
    }
})();
