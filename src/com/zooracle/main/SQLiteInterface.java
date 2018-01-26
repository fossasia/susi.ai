package com.zooracle.main;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;

import com.zooracle.model.sql.SQLContainer;
import com.zooracle.view.swing.MainWindow;

public class SQLiteInterface
{

	private static SQLiteInterface instance = null;
	private static String dbName;
	private static boolean simulate = false;

	public static SQLiteInterface getInstance() {
		if (instance == null)
			instance = new SQLiteInterface();
		return instance;
	}

	public static void setSimulate(boolean simulate) {
		SQLiteInterface.simulate = simulate;
	}

	public boolean testConnection(String dbName) {
		Connection c = null;
		this.dbName = dbName;
		try {
			Class.forName("org.sqlite.JDBC");
			c = DriverManager.getConnection("jdbc:sqlite:" + dbName);
			System.out.println("Opened database successfully");
			return true;
		} catch (Exception e) {
			System.err.println(e.getClass().getName() + ": " + e.getMessage());
			return false;
		}
	}

	public void select(String selectString, SQLContainer container) {
		Connection c = null;
		Statement stmt = null;
		try {
			Class.forName("org.sqlite.JDBC");
			c = DriverManager.getConnection("jdbc:sqlite:" + dbName);
			c.setAutoCommit(false);

			stmt = c.createStatement();
			ResultSet rs = stmt.executeQuery(selectString);
			ResultSetMetaData md = rs.getMetaData();

			container.fill(rs, md);

			rs.close();
			stmt.close();
			c.close();

		} catch (Exception e) {
			e.printStackTrace();
			System.exit(0);
		}
		System.out.println("Operation done successfully");
	}

	public static long getTimestampFromDatetimeString(String datetime) {
		if ((datetime == null) || (datetime.equals("null")))
			return 0l;

		Calendar calendar = Calendar.getInstance();
		DateFormat formatter;
		formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		java.util.Date date;
		try {
			date = formatter.parse(datetime);
			calendar.setTime(date);
			return calendar.getTimeInMillis() / 1000l;

		} catch (ParseException e) {
			e.printStackTrace();
		}
		return 0l;
	}

	public static Object check(Object object, Object defaultValue) {
		if (object == null)
			return defaultValue;
		else
			return object;
	}

	public static boolean execute(String SQLiteCommand) {
		Connection c = null;
		Statement stmt = null;
		try {
			Class.forName("org.sqlite.JDBC");
			c = DriverManager.getConnection("jdbc:sqlite:" + dbName);
			c.setAutoCommit(false);

			stmt = c.createStatement();
			stmt.executeUpdate(SQLiteCommand);

			stmt.close();
			c.commit();
			c.close();

		} catch (Exception e) {
			System.err.println(e.getClass().getName() + ": " + e.getMessage());
			return false;
		}
		return true;
	}

}
