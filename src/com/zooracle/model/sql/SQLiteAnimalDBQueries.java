package com.zooracle.model.sql;

public class SQLiteAnimalDBQueries
{
	public static String getDBSettings = "SELECT * FROM dbinformation WHERE validUntil is null ORDER BY validFrom DESC";
	
	public static String insertIndividual = "";
	
	public static String getMetaData = "SELECT m.*, i.validUntil AS individualValidUntil, i.id " + 
									   "FROM metadata m " +
									   "JOIN individual i  " +
									   "ON m.IndividualId = i.id " +
									   "WHERE individualValidUntil is null";
	
	public static String getToadData = "SELECT t.*, m.validFrom, m.validUntil AS MVU, m.gpsLat, m.gpsLon, m.fileName, m.zooName, m.altName, m.view, m.individualId, m.comment, i.validUntil AS IVU, i.id AS individualId " +
			  						   "FROM metadata m, individual i " +
									   "JOIN toaddata t " +
									   "ON t.metadataId = m.id " + 
									   "AND m.individualId = i.id " + 
									   "WHERE IVU is null " + 
									   "AND MVU is null";
	
	
	public static String getImageSettings = "SELECT * FROM imagesettings " +
											"WHERE validUntil is null";
	
	public static String getColorSelection = "SELECT * FROM colorselection " +
											 "WHERE validUntil is null";
	
	public static String defaultDeleteStatement = "DELETE FROM {TABLE} " +
			 				     				  "{WHERE}";

	public static String defaultInsertStatement = "INSERT INTO {TABLE} {COLUMNS} " +
			  									  "VALUES {VALUES}";

	public static String defaultUpdateStatement = "UPDATE {TABLE} " +
			  									  "SET {VALUES} " +
			  									  "{WHERE}";
	
	public static String getIndividuals = "SELECT * FROM individual " +
										  "WHERE validUntil is null";
	
	public static String count = "SELECT COUNT(*) FROM {TABLE} " +
			                     "{WHERE}";

	
	
}
