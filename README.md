# Contact Details Scraper

## Overview

The Contact Details Scraper is a Node.js script that allows you to extract contact details, including email addresses and mobile phone numbers, from a list of websites and save this information to an Excel file. This tool can be useful for gathering contact information from various websites quickly.

## Prerequisites

Before you can use the Contact Details Scraper, you need to have the following prerequisites installed on your system:

- **Node.js**: Make sure you have Node.js installed on your computer. If you don't have it installed, you can download it from the [official Node.js website](https://nodejs.org/).

## Installation

Follow these steps to set up and use the Contact Details Scraper:

1. **Download or Clone the Repository**: Start by downloading or cloning this repository to your local machine.

2. **Navigate to the Project Directory**: Open a terminal or command prompt and navigate to the directory where you've placed the downloaded or cloned repository.

3. **Install Dependencies**: Run the following command to install the required dependencies for the script:

   ```bash
   npm install
   ```

## Usage

Now that you've installed the necessary dependencies, you can start using the Contact Details Scraper. Here's how to do it:

1. **Prepare Your List of Websites**: Create a text file (e.g., `list.txt`) where you'll list the websites from which you want to scrape contact details. Each website URL should be on a separate line within this text file.

2. **Edit the List**: Open `list.txt` and add the URLs of the websites you wish to scrape. Ensure that each URL is on a new line.

3. **Run the Scraper Script**: To initiate the scraping process, run the following command in your terminal or command prompt:

   ```bash
   node script.js
   ```

   - The script will start working through your list of websites one by one.
   - It will visit each website, search for keywords like "contact," "about," and so on, to identify potential contact pages.
   - After finding a contact page, it will extract contact details such as the website URL, email address, and mobile phone number.
   - The collected contact details will be saved to an Excel file named `contacts.xlsx` in the project directory.

4. **Review the Output**: Once the script completes its work, you can locate the extracted contact details in the `contacts.xlsx` file in the project directory. This file will contain the website URL, email address, and mobile phone number for each website that had this information available.

## Additional Notes

- **Customize Keywords**: You can customize the list of keywords used to identify potential contact pages by modifying the `keywords` array in the script. This allows you to adapt the scraper to websites with different structures and naming conventions for contact pages.

- **Headless Mode**: By default, the script runs in non-headless mode, meaning you can see the browser interface while it operates. If you prefer to run it in headless mode (without a visible browser interface), you can change `headless: false` to `headless: true` in the script.

- **Stable Internet Connection**: Ensure that you have a stable internet connection while running the script, as it relies on web scraping to gather contact information.
