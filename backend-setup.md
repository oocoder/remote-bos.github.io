# Backend Setup Guide for Waitlist Form

This guide provides instructions for integrating the waitlist form with a backend service to store submissions.

## Option 1: Google Sheets (Recommended for Quick Start)

### Setup Steps:

1. **Create a Google Sheet**:
   - Go to Google Sheets and create a new spreadsheet
   - Name it "Remote BOS Waitlist"
   - Add column headers: `Timestamp`, `First Name`, `Last Name`, `Email`

2. **Set up Google Apps Script**:
   - In your Google Sheet, go to Extensions > Apps Script
   - Replace the default code with the following:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Add row with timestamp
    sheet.appendRow([
      new Date(),
      data.firstName,
      data.lastName,
      data.email
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Deploy as Web App**:
   - Click "Deploy" > "New deployment"
   - Select "Web app" as type
   - Set "Execute as" to your Google account
   - Set "Who has access" to "Anyone"
   - Click "Deploy" and copy the web app URL

4. **Update script.js**:
   - Replace the `submitToBackend` function with:

```javascript
async function submitToBackend(data) {
    const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // Replace with your URL

    const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    // Note: no-cors mode doesn't allow reading response
    // Assume success if no error is thrown
    return { success: true };
}
```

## Option 2: Firebase (Recommended for Production)

### Setup Steps:

1. **Create Firebase Project**:
   - Go to https://console.firebase.google.com/
   - Create a new project named "Remote BOS"
   - Enable Firestore Database

2. **Get Firebase Config**:
   - Go to Project Settings > General
   - Under "Your apps", click the web icon (</>)
   - Copy the Firebase configuration

3. **Add Firebase to HTML**:
   - Add before closing `</body>` tag in `index.html`:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script>
  // Your Firebase configuration
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
</script>
```

4. **Update script.js**:
   - Replace the `submitToBackend` function with:

```javascript
async function submitToBackend(data) {
    const db = firebase.firestore();

    await db.collection('waitlist').add({
        ...data,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        source: window.location.href
    });

    return { success: true };
}
```

5. **Set Firestore Rules**:
   - In Firebase Console, go to Firestore Database > Rules
   - Update rules to allow writes:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /waitlist/{document=**} {
      allow create: if request.resource.data.email is string &&
                      request.resource.data.firstName is string &&
                      request.resource.data.lastName is string;
      allow read, update, delete: if false;
    }
  }
}
```

## Option 3: Simple Backend API

If you have your own backend API:

```javascript
async function submitToBackend(data) {
    const response = await fetch('https://your-api.com/waitlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Submission failed');
    }

    return await response.json();
}
```

## Testing Your Integration

1. Open the landing page in a browser
2. Fill out the waitlist form with test data
3. Submit the form
4. Verify the data appears in your chosen backend (Google Sheets, Firestore, etc.)
5. Verify the redirect to the Thank You page works

## Email Notifications (Optional)

### Google Sheets:
- Use Google Apps Script to send email notifications when new submissions arrive
- Add to your Apps Script:

```javascript
function onFormSubmit(e) {
  const email = "your-email@example.com";
  const subject = "New Waitlist Signup";
  const message = `New signup:\\nName: ${e.firstName} ${e.lastName}\\nEmail: ${e.email}`;

  MailApp.sendEmail(email, subject, message);
}
```

### Firebase:
- Use Firebase Cloud Functions to trigger emails
- Integrate with SendGrid, Mailgun, or similar service

## Current Implementation Status

The form currently has a **simulated backend** in `script.js` that logs submissions to the console. Replace the `submitToBackend` function with one of the options above to enable real data collection.
