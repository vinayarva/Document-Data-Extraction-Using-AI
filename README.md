# Document-Data-Extraction-Using-AI

**Live Demo:** [https://frontend-are1.onrender.com](https://frontend-are1.onrender.com)

## Project Description

This full-stack application is designed to process documents (currently supporting PDFs), extract their textual content using Optical Character Recognition (OCR), and then dynamically create AI-driven prompts to identify and extract key-value pairs from the text. A key feature of this application is its ability to learn from an initial document and generate a reusable prompt template. This template can then be applied to other documents of the same type to extract similar data efficiently, outputting a structured JSON.

## Technologies Used

**Frontend:**
* React (with Vite)
* Tailwind CSS

**Backend:**
* Node.js
* Express.js
* Google Cloud Services

**AI & Cloud Services:**
* **Google Gemini API:** For dynamic prompt generation and final structured JSON output.
* **Google Cloud Vision API:** For OCR to extract text from PDF documents.
* **Google Cloud Storage:** For storing uploaded documents and potentially processed data.

**Deployment:**
* **Backend and Frontend:**  Render

## Features

* **Document Upload:** Accepts PDF files for processing.
* **Batch Upload:** Accepts process multiple files in batch for processing.
* **OCR Processing:** Extracts text from uploaded documents using Google Cloud Vision API.
* **Dynamic AI Prompt Generation:** Leverages Gemini API to create context-specific prompts for data extraction.
* **Reusable Prompt Templates:** Learns from a document to create a template for extracting data from similar documents.
* **Structured JSON Output:** Provides extracted key-value pairs in a clean JSON format.
* **Scalable Cloud Infrastructure:** Utilizes Google Cloud services for efficient processing and storage.

## Project Workflow

1.  **File Upload (Frontend):** The user uploads a PDF document through the React-based frontend.
2.  **File Reception (Backend):** The Node.js/Express.js backend receives the uploaded file.
3.  **Document Storage (Google Cloud Storage):** The received PDF is securely stored in a Google Cloud Storage bucket.
4.  **OCR Processing (Google Cloud Vision API):** The text content is extracted from the PDF using Google Cloud Vision API.
5.  **AI Prompt Generation (Gemini API):** The extracted text is sent to the Gemini API. The API analyzes the content and generates an appropriate prompt designed to identify and extract key-value pairs.
6.  **Data Extraction (Gemini API):** Using the generated prompt (or a previously learned reusable prompt), the Gemini API processes the text to extract the desired key-value pairs.
7.  **Structured Output:** The extracted data is formatted into a structured JSON object.
8.  **Response to Frontend:** The JSON output is sent back to the frontend to be displayed to the user.

## Stacks used:

**Frontend:** React, ViteJS, Tailwind.

**Backend:** Node.js with Express.

**OCR:** Used the Google cloud vision Service.

**AI Model:** Used the Gemini Api service.

**Storage:** Used the Gemini Cloud Storage service.

**Batch Support:** Support the  process multiple documents at once.


## Installation and Setup

The repository is structured with `frontend` and `backend` folders.

### Backend Setup (Node.js & Express.js)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory and add the necessary credentials and configurations. This will typically include:
    * `PORT`: The port number for the backend server (e.g., `3001` or `5000`).
    * `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Google Cloud service account key JSON file.
    * `GEMINI_API_KEY`: Your API key for the Gemini API.
    * `GCS_BUCKET_NAME`: The name of your Google Cloud Storage bucket.
    * Other relevant API keys or configurations.

    Example `.env` file:
    ```
    PORT=3001
    GOOGLE_APPLICATION_CREDENTIALS="./path-to-your-service-account-file.json"
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    GCS_BUCKET_NAME="your-gcs-bucket-name"
    ```
4.  **Ensure Google Cloud SDK is configured:**
    If you haven't already, install and initialize the Google Cloud SDK on your local machine or server environment. Authenticate with your Google Cloud account.
    ```bash
    gcloud auth application-default login
    ```
5.  **Start the backend server:**
    ```bash
    npm start
    ```
    Or, if you have a development script (e.g., using `nodemon`):
    ```bash
    npm run dev
    ```

### Frontend Setup (React & Vite)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables (if any):**
    Create a `.env` file in the `frontend` directory if your frontend needs to connect to the backend API.
    Typically, you'll define the backend API URL:
    ```
    VITE_API_BASE_URL=http://localhost:3001/api
    ```
    (Adjust the URL and port to match your backend server's address).
    Your React code would then use `import.meta.env.VITE_API_BASE_URL` to access this.

4.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    This will usually start the application on `http://localhost:5173` (or another port specified by Vite).

5.  **Build for production:**
    When ready to deploy, build the static assets:
    ```bash
    npm run build
    ```
    This will create a `dist` folder with the optimized production build.

## Deployment

* **Frontend and Backend (Render):**
    The Frontend and Backend is deployed on the render platform.

---
