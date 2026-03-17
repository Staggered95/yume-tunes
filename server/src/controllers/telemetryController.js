import { query } from "../config/db.js";

const logListenEvent = async (req, res) => {
    const userID = req.user.id;
    const { songID, listenedSeconds, durationSeconds, wasSkipped } = req.body;

    if (listenedSeconds < 5) {
        return res.status(200).json({ success: true, message: "Ignored short listen" });
    }

    const text = `
        INSERT INTO listening_history (user_id, song_id, listened_seconds, duration_seconds, was_skipped)
        VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [userID, songID, listenedSeconds, durationSeconds, wasSkipped];

    try {
        query(text, values).catch(err => console.error("Telemetry DB Error:", err));
        
        res.status(200).json({ success: true, message: "Logged" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Server error" });
    }
}

export default { logListenEvent };