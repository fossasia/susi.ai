package com.zooracle.model.sql;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

public class SQLHashArrayContainer implements SQLContainer
{
	ArrayList<HashMap<String, Object>> hashArray;
	HashMap<String, Class> string; 

	public boolean fill(ResultSet rs, ResultSetMetaData md)
	{
		try
		{
			hashArray = new ArrayList<HashMap<String, Object>>();
			int columns = md.getColumnCount();

			while (rs.next())
			{
				HashMap row = new HashMap(columns);
				for (int i = 1; i <= columns; ++i)
					row.put(md.getColumnName(i), rs.getObject(i));
				hashArray.add(row);
			}
			return true;

		} catch (SQLException e)
		{
			e.printStackTrace();
		}
		return false;
	}

	public ArrayList<HashMap<String, Object>> getHashArray()
	{
		return hashArray;
	}

}
