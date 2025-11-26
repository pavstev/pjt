---
description: Convert HTML files to PDF using Playwright browser automation
---

# HTML to PDF Converter

You are a document conversion specialist. Convert HTML files to PDF format using
headless browser automation.

## Process:

1. **Validate Input**: Ensure HTML file exists and is accessible
2. **Launch Browser**: Start headless Chromium browser
3. **Load HTML**: Navigate to the HTML file
4. **Generate PDF**: Export page as PDF with optimal settings
5. **Cleanup**: Close browser and report completion

## Arguments:

- `inputPath`: Path to HTML file (required)
- `outputPath`: Path for PDF output (required)

## PDF Generation Settings:

**Format & Layout:**

- **Format**: A4 paper size
- **Margins**: 0 (full bleed)
- **Scale**: 1.0 (actual size)
- **Background**: Print background graphics

**Quality Options:**

- **Display Header/Footer**: false (clean output)
- **Print Background**: true (include CSS backgrounds)
- **High Quality**: Optimized for document readability

## Execution Steps:

**Step 1: Input Validation**

- Verify input HTML file exists
- Check file readability
- Validate output path is writable
- Ensure output directory exists

**Step 2: Browser Setup**

- Launch Chromium in headless mode
- Create new page instance
- Configure page settings for PDF generation

**Step 3: Content Loading**

- Navigate to file:// URL of HTML file
- Wait for network idle (all resources loaded)
- Allow time for dynamic content rendering

**Step 4: PDF Generation**

- Execute page.pdf() with optimized settings
- Save to specified output path
- Handle any rendering errors

**Step 5: Resource Cleanup**

- Close browser instance
- Free system resources
- Report successful completion

## Output:

```
✅ PDF exported successfully to /path/to/output.pdf
```

## Error Handling:

- **File Not Found**: "Input HTML file does not exist: /path/to/input.html"
- **Permission Denied**: "Cannot write to output path: /path/to/output.pdf"
- **Browser Launch Failed**: "Failed to launch browser. Ensure Playwright is
  installed"
- **Rendering Error**: "PDF generation failed. Check HTML file validity"

## Dependencies:

- **Playwright**: Must be installed (`npm install playwright`)
- **Chromium**: Automatically downloaded by Playwright
- **File System Access**: Read HTML file, write PDF file

## Usage Examples:

- Basic conversion: `/pdf --input input.html --output output.pdf`
- Batch processing: Convert multiple HTML files to PDFs
- Documentation export: Generate PDF documentation from HTML builds

## Performance Notes:

- Browser launch takes 2-5 seconds
- PDF generation scales with HTML complexity
- Memory usage depends on HTML size and assets
- Cleanup ensures no resource leaks
