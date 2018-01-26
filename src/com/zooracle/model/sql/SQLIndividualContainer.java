package com.zooracle.model.sql;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

import com.zooracle.main.SQLiteInterface;
import com.zooracle.model.Individual;
import com.zooracle.model.MetaData;

public class SQLIndividualContainer implements SQLContainer
{
	ArrayList<Individual> individuals;

	public boolean fill(ResultSet rs, ResultSetMetaData md)
	{
		try
		{
			Calendar calendar = Calendar.getInstance();

			individuals = new ArrayList<Individual>();
			int columnCount = md.getColumnCount();
			
			
			while (rs.next())
			{
				int id = rs.getInt(SQLiteStructure.columnId);
				String name = rs.getString(SQLiteStructure.columnName);
				int gender = rs.getInt(SQLiteStructure.columnGender);
				long validFrom = SQLiteInterface.getTimestampFromDatetimeString(rs.getString(SQLiteStructure.columnValidFrom));
				
				String validUntilString = rs.getString(SQLiteStructure.columnValidUntil);
				if (!validUntilString.equals("null"))
					continue;
				long validUntil = SQLiteInterface.getTimestampFromDatetimeString(validUntilString);
				String comment = rs.getString(SQLiteStructure.columnComment);
				
				Individual individual = new Individual(id, name, gender, validFrom, validUntil, comment);
				individuals.add(individual);
			}
			return true;

		} catch (SQLException e)
		{
			e.printStackTrace();
		}
		return false;
	}
	
	public ArrayList<Individual> getIndividuals()
	{
		return individuals;
	}
	
}
