package com.zooracle.model;

import java.util.Date;

public class FilterSettings
{
	public boolean groupByIndividuals;
	public boolean unassigned;
	public boolean dateRange;
	public Date rangeFrom;
	public Date rangeUntil;
	public String nameFilter;
//	TODO: sortby
	
	public static FilterSettings importSettings = new FilterSettings();
	
	public FilterSettings()
	{
		this.unassigned = true;
		this.dateRange = false;
		this.rangeFrom = null;
		this.rangeUntil = null;
		this.groupByIndividuals = false;
		this.nameFilter = "";
	}

}
