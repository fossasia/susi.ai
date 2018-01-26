package com.zooracle.model.sql;

public class SQLColumn
{
	public String name;
	public Class type;
	public Object defaultValue;
	
	public SQLColumn(String name, Class type, Object defaultValue)
	{
		this.name = name;
		this.type = type;
		this.defaultValue = defaultValue;
	}

}
