package com.zooracle.model.sql;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

public interface SQLContainer
{
	public boolean fill(ResultSet rs, ResultSetMetaData md);
}
