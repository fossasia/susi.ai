package com.zooracle.model;

import java.util.HashMap;

import com.zooracle.view.swing.Locale;

public abstract class AnimalDatabase
{
	protected String title;
	protected static String type;
	protected String dbLocation;
	protected String comment;
	protected String imagePath;
	
	protected HashMap<String,Individual> individuals;
	protected HashMap<Integer,MetaData> metaDataEntries;
	
	
	
	public AnimalDatabase(String dbLocation, String title, String imagePath, String comment)
	{
		this.dbLocation = dbLocation;
		this.title = title;
		this.imagePath = imagePath;
		this.comment = comment;
		
	}
	
	public HashMap<Integer, MetaData> getMetaDataEntries() {
		return metaDataEntries;
	}
	
	public void setMetaDataEntries(HashMap<Integer, MetaData> metaDataEntries) {
		this.metaDataEntries = metaDataEntries;
	}
	
	public String getTitle()
	{
		return title;
	}

	public void setTitle(String title)
	{
		this.title = title;
	}

	public String getType()
	{
		return type;
	}

	public void setType(String type)
	{
		this.type = type;
	}

	public String getDBLocation()
	{
		return dbLocation;
	}

	public void setDBLocation(String location)
	{
		this.dbLocation = location;
	}

	public HashMap<String, Individual> getIndividuals()
	{
		return individuals;
	}

	public void setIndividuals(HashMap<String, Individual> individuals)
	{
		this.individuals = individuals;
	}

	public String getDbLocation()
	{
		return dbLocation;
	}

	public void setDbLocation(String dbLocation)
	{
		this.dbLocation = dbLocation;
	}

	public String getComment()
	{
		return comment;
	}

	public void setComment(String comment)
	{
		this.comment = comment;
	}

	public String getImagePath()
	{
		return imagePath;
	}

	public void setImagePath(String imagePath)
	{
		this.imagePath = imagePath;
	}
	
	
	

}
