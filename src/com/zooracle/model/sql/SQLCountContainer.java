package com.zooracle.model.sql;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

public class SQLCountContainer implements SQLContainer
{
	int count = -1;

	public boolean fill(ResultSet rs, ResultSetMetaData md)
	{
		try
		{
			count = rs.getInt(0);
		} catch (SQLException e)
		{
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public int getCount()
	{
		return count;
	}

}
