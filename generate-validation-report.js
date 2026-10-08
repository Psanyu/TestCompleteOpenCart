const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const ExcelJS = require("exceljs");

const results = [];
const base = "Frameworks/ProjectSuiteTestFramework";
const buildNumber = process.env.BUILD_NUMBER || "LOCAL";
const executionDate = new Date().toISOString();

const requiredFiles = [
    `${base}/ProjectSuiteTestFramework.pjs`,
    `${base}/TF1/TF1.mds`,
    `${base}/TF1/Script/T01_UserRegistration.js`,
    `${base}/TF1/Script/T02_Login.js`,
    `${base}/TF1/Script/T03_Logout.js`,
    `${base}/TF1/NameMapping/NameMapping.tcNM`
];

function addResult(category, name, passed, details = "") {
    results.push({
        category,
        name,
        status: passed ? "PASS" : "FAIL",
        details
    });

    console.log(`${passed ? "PASS" : "FAIL"}: ${name}`);
}

// Validate framework structure
for (const file of requiredFiles) {
    const exists = fs.existsSync(file);

    addResult(
        "Framework Structure",
        file,
        exists,
        exists ? "File exists" : "Missing required file"
    );
}

// Find JavaScript files recursively
function findJavaScriptFiles(directory) {
    if (!fs.existsSync(directory)) return [];

    let files = [];

    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            if (entry.name.toLowerCase() !== "visualizer") {
                files.push(...findJavaScriptFiles(fullPath));
            }
        } else if (
            entry.isFile() &&
            entry.name.toLowerCase().endsWith(".js")
        ) {
            files.push(fullPath);
        }
    }

    return files;
}

// Validate JavaScript syntax
const jsFiles = findJavaScriptFiles(base);

if (jsFiles.length === 0) {
    addResult(
        "JavaScript Syntax",
        "JavaScript file discovery",
        false,
        "No JavaScript files found"
    );
}

for (const file of jsFiles) {
    const check = spawnSync(
        process.execPath,
        ["--check", file],
        { encoding: "utf8" }
    );

    addResult(
        "JavaScript Syntax",
        file,
        check.status === 0 && !check.error,
        check.error?.message ||
            check.stderr?.trim() ||
            "Syntax valid"
    );
}

// Create reports directory
fs.mkdirSync("reports", { recursive: true });

const total = results.length;
const passed = results.filter(r => r.status === "PASS").length;
const failed = total - passed;

// Escape special XML characters
function escapeXml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

// Generate JUnit XML
const testCases = results.map(r => {
    const name = escapeXml(r.name);
    const category = escapeXml(r.category);

    if (r.status === "PASS") {
        return `<testcase classname="${category}" name="${name}"/>`;
    }

    return `<testcase classname="${category}" name="${name}">
        <failure message="${escapeXml(r.details)}"/>
    </testcase>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
    <testsuite name="TestComplete Framework Validation"
        tests="${total}"
        failures="${failed}"
        errors="0"
        skipped="0">
        ${testCases}
    </testsuite>
</testsuites>`;

fs.writeFileSync(
    "reports/validation-results.xml",
    xml,
    "utf8"
);

// Generate Excel report
async function generateExcel() {
    const workbook = new ExcelJS.Workbook();

    // Summary worksheet
    const summary = workbook.addWorksheet("Summary");

    summary.columns = [
        { header: "Build Number", key: "build", width: 18 },
        { header: "Execution Date", key: "date", width: 30 },
        { header: "Total Checks", key: "total", width: 18 },
        { header: "Passed", key: "passed", width: 15 },
        { header: "Failed", key: "failed", width: 15 },
        { header: "Overall Result", key: "result", width: 20 }
    ];

    summary.addRow({
        build: buildNumber,
        date: executionDate,
        total,
        passed,
        failed,
        result: failed === 0 ? "PASS" : "FAIL"
    });

    // Validation details worksheet
    const details = workbook.addWorksheet("Validation Details");

    details.columns = [
        { header: "Category", key: "category", width: 25 },
        { header: "File / Validation", key: "name", width: 85 },
        { header: "Result", key: "status", width: 15 },
        { header: "Details", key: "details", width: 55 }
    ];

    results.forEach(r => details.addRow(r));

    // Format worksheets
    for (const sheet of workbook.worksheets) {
        sheet.getRow(1).font = { bold: true };

        sheet.views = [
            { state: "frozen", ySplit: 1 }
        ];

        sheet.autoFilter = {
            from: {
                row: 1,
                column: 1
            },
            to: {
                row: 1,
                column: sheet.columnCount
            }
        };
    }

    // Save Excel report
    await workbook.xlsx.writeFile(
        "reports/TestComplete-Validation-Report.xlsx"
    );

    console.log("\nREPORT SUMMARY");
    console.log(`Build Number: ${buildNumber}`);
    console.log(`Total Checks: ${total}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    console.log(
        "JUnit XML and Excel reports generated successfully."
    );

    if (failed > 0) {
        process.exitCode = 1;
    }
}

generateExcel().catch(error => {
    console.error("Report generation failed:", error);
    process.exitCode = 1;
});