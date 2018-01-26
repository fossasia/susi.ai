package com.zooracle.model.sql;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

public class SQLHashMapContainer implements SQLContainer
{
	HashMap<String,HashMap<String, Object>> hashMap;
	private String id = "id";
	public SQLHashMapContainer(String id)
	{
		this.id = id;
	}
	
	public SQLHashMapContainer()
	{
	}

	public boolean fill(ResultSet rs, ResultSetMetaData md)
	{
		try
		{
			hashMap = new HashMap<String,HashMap<String, Object>>();
			int columns = md.getColumnCount();

			while (rs.next())
			{
				HashMap row = new HashMap(columns);
				for (int i = 1; i <= columns; ++i)
				{	
					row.put(md.getColumnName(i), rs.getObject(i));
					System.out.println(md.getColumnName(i) + " " + rs.getObject(i));
				}
				hashMap.put(String.valueOf(row.get(id)), row);
			}
			return true;

		} catch (SQLException e)
		{
			e.printStackTrace();
		}
		return false;
	}

	public HashMap<String,HashMap<String, Object>> getHashArray()
	{
		return hashMap;
	}

}
