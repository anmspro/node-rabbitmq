// mysqlService.ts
import mysql from "mysql2/promise";
import dbConfig from "../config/dbConfig";

export async function fetchPushNotifications() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query("SELECT * FROM push_notifications");
    await connection.end();
    return rows;
  } catch (error) {
    console.error("Error fetching push_notifications:", error);
    throw error;
  }
}

export async function fetchPushById(p_id: any) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(
      `SELECT * FROM push_notifications WHERE id=${p_id}`
    );
    await connection.end();
    return rows;
  } catch (error) {
    console.error("Error fetching push_notifications:", error);
    throw error;
  }
}
