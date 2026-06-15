import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "geolens.db")


def init_db():
    """Initializes the SQLite database and creates the analysis history table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS analysis_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            language TEXT NOT NULL,
            status TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """
    )
    conn.commit()
    conn.close()


def save_analysis(url: str, language: str, status: str):
    """Saves an analysis record into the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO analysis_history (url, language, status)
        VALUES (?, ?, ?)
    """,
        (url, language, status),
    )
    conn.commit()
    conn.close()


def get_total_analyses_count() -> int:
    """Returns the total number of analyses conducted."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM analysis_history")
    count = cursor.fetchone()[0]
    conn.close()
    return count



