const fs = require("fs");
const edge = require("puppeteer-edge");
const ExcelJS = require("exceljs");

async function extractContactDetails(url) {
  const browser = await edge.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });

    const keywords = ["contact", "contacts", "contactus", "contact-us", "about", "aboutus", "about-us"];
    let contactPageFound = false;
    let contactPageUrl = "";

    for (const keyword of keywords) {
      const contactPageLink = await page.$(`a[href*='${keyword}']`);
      if (contactPageLink) {
        contactPageUrl = await page.evaluate((element) => element.href, contactPageLink);
        contactPageFound = true;
        break;
      }
    }

    if (!contactPageFound) {
      console.log("No contact page found for this website.");
      await browser.close(); // Fix: Changed Close to close
      return null;
    }

    console.log(`Navigating to contact page: ${contactPageUrl}`);
    await page.goto(contactPageUrl, { waitUntil: "domcontentloaded", timeout: 120000 });

    // Wait for any AJAX or dynamic content to load here if needed.

    const contactDetails = {
      mobileNo: await page.evaluate(() => {
        const mobileSelectors = [
          "input[type='tel']",
          ".tel",
          ".contact",
          ".mobile-number",
          ".contact-info",
          ".contact-details",
          "a[href^='tel:']",
          "a[href*='tel:']", // Fix: Escaped double quotes
          "[data-tel]",
          "[data-mobile-number]",
          "[data-mobile]",
          "[data-contact-info]",
          "[data-contact-details]",
          ".phone",
          ".mobile",
          ".cell",
          ".smartphone",
          ".dial",
          ".call",
          ".text",
          ".message",
          ".whatsapp",
          ".telegram",
          ".signal",
          ".viber",
          ".skype",
        ];
        for (const selector of mobileSelectors) {
          const textContent = (document.querySelector(selector) || {}).textContent || "";
          const isEmail = textContent.includes('@');
          const phoneNumber = textContent.match(/(\+?\d{10,}|\d{11,}|\d{12,}|\d{13,}|\b0\d{9,}|\b0\d{10,}|\b\+\d{10,}|\b\+\d{11,}|\b\+\d{12,}|\b\+\d{13,}|\b\d{2}\d{8}|\b\d{3}\d{7}|\b\d{4}\d{6}|\b\d{5}\d{5}|\b\d{6}\d{4}|\b\d{7}\d{3}|\b\d{8}\d{2}|\b\d{9}\d{1}|\b\d{10})/);
          if (phoneNumber) {
            return phoneNumber[0];
          }
        }
        return null;
      }),
      email: await page.evaluate(() => {
        const emailSelectors = [
          "input[type='email']",
          "Email Address",
          "p.details",
          ".email",
          ".contact-info",
          ".contact-details",
          "a[href*='@']",
          "a[href^='mailto:']",
        ];
        for (const selector of emailSelectors) {
          const textContent = (document.querySelector(selector) || {}).textContent || "";
          const emailMatch = textContent.match(/\S+@\S+/);
          if (emailMatch) {
            return emailMatch[0];
          }
        }
        return null;
      }),
      websiteUrl: await page.url(),
    };

    console.log("Contact details extracted:");
    console.log(contactDetails);

    await browser.close();
    return contactDetails;
  } catch (error) {
    console.error(`Error while scraping ${url}: ${error}`);
    await browser.close();
    return null;
  }
}

async function main() {
  const websites = fs.readFileSync("list.txt", "utf-8").split("\n");

  const contactDetailsList = [];

  for (const website of websites) {
    try {
      const contactDetails = await extractContactDetails(website);
      if (contactDetails) {
        contactDetailsList.push(contactDetails);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Contacts");

  worksheet.columns = [ // Fix: Changed Columns to columns
    { header: "Website", key: "websiteUrl" },
    { header: "Email", key: "email" },
    { header: "Mobile No", key: "mobileNo" },
  ];

  contactDetailsList.forEach((contact) => {
    worksheet.addRow(contact);
  });

  await workbook.xlsx.writeFile("contacts.xlsx");
  console.log("Contact information saved to contacts.xlsx");
}

main();
