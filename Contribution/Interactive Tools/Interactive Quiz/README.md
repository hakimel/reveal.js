# Interactive Live Quiz with QR Code and Leaderboard

This project allows you to run a **live interactive quiz** where participants join by scanning a **QR code** on their phone. Answers are submitted in real-time, and the presenter can view a live leaderboard with ranking and progress bars.

---

## 🛠️ Prerequisites

- **Laptop and phones** must be on the **same network**.
- Modern browser (Chrome, Edge, Firefox, Safari).
- **Node.js** installed on your laptop.


⚡ Setup Instructions

 1. Install Node.js

      Download Node.js from [https://nodejs.org](https://nodejs.org).  
      Verify installation:
         node -v
         npm -v

2. Project Setup
   1.Create a project folder:
      mkdir live-quiz
      cd live-quiz
   2.Initialize project:
      npm init -y 
   3.Install required packages:
      npm install express socket.io cors

3. Start the Server
            npm start  **#or**
         node backend/server.js


4. Workflow Summary
      Presenter opens index.html → QR code appears.
      Participants scan QR → open quiz.html → submit answers.
      Server checks answers → updates score → sends personal score to participant.
      Leaderboard updates live → ranks calculated → progress bar updated.
      Presenter sees live stats + participant count.

5. Future Improvements
      Timer visible on presenter screen.
      Store results in database.
      Support more than 4 options per question.
      Export leaderboard data as CSV/PDF.

6. Important Backend Functions
   
   1. Get local IP for QR code
   2. Player data structure
   3. Compute leaderboard with tie ranks
   4. Submit answers and update scores
   

7. Implementation Restrictions
   
   1. All devices must be on the same network.
   2. Port 3000 must be free on your laptop.
   3. Recommended modern browsers for best performance.
   4. Works best with small to medium-size groups (~50 participants).