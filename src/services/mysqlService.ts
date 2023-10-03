// mysqlService.ts
import mysql from "mysql2/promise";
import dbConfig from "../config/dbConfig";

export async function fetchPushNotifications() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(
      "SELECT id AS p_id FROM push_notifications"
    );
    await connection.end();
    return rows;
  } catch (error) {
    console.error("Error fetching push_notifications:", error);
    throw error;
  }
}
