package com.zooracle.model.sql;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SQLArrayListContainer implements SQLContainer
{
	ArrayList<ArrayList<Object>> arrayList2D;
	ArrayList<Object> arrayList;
	private List<String> columns;
	private String column = null;
	
	public SQLArrayListContainer(List<String> columns)
	{
		this.columns = columns;
	}
	
	public SQLArrayListContainer(String column)
	{
		this.column = column;
	}
	public boolean fill(ResultSet rs, ResultSetMetaData md)
	{
		try
		{
			
			if (this.column==null)
			{
				arrayList2D = new ArrayList<ArrayList<Object>>();
				int columnCount = md.getColumnCount();
				while (rs.next())
				{
					ArrayList<Object> row = new ArrayList<Object>();
					if (this.columns==null)
					{
						for (int i = 1; i <= columnCount; ++i)
							row.add(rs.getObject(i));
					}
					else
					{
						for (String column : this.columns)
							row.add(rs.getObject(column));
					}
					arrayList2D.add(row);
				}
			}
			else
			{
				arrayList = new ArrayList<Object>();
				while (rs.next())
					arrayList.add(rs.getObject(column));
			}
			return true;
			
		} catch (SQLException e)
		{
			e.printStackTrace();
		}
		return false;
	}
	
	public ArrayList<ArrayList<Object>> get2DArrayList()
	{
		return arrayList2D;
	}
	
	public ArrayList<Object> getArrayList()
	{
		return arrayList;
	}
}
