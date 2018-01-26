package com.zooracle.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Individual
{

	public static String idPrefix = "BT_";
	public static String idSuffix = "";
	public static int currentId = 0;
	public static List<Integer> usedIds = new ArrayList<Integer>();

	private int id;
	private String name;
	private int gender;

	private long validFrom;
	private long validUntil;

	private List<MetaData> metaDataEntries;
	private String comment;

	public long getValidFrom()
	{
		return validFrom;
	}

	@XmlElement
	public void setValidFrom(long validFrom)
	{
		this.validFrom = validFrom;
	}

	public long getValidUntil()
	{
		return validUntil;
	}

	@XmlElement
	public void setValidUntil(long validUntil)
	{
		this.validUntil = validUntil;
	}

	public Individual(String name, int gender)
	{
		this.id = getNextFreeId();
		this.name = name;
		this.gender = gender;
		this.metaDataEntries = new ArrayList<MetaData>();
	}

	private static int getNextFreeId()
	{
		while (usedIds.contains(currentId))
			currentId++;
		usedIds.add(new Integer(currentId));
		return new Integer(currentId);
	}

	public Individual(int id, String name, int gender, long validFrom, long validUntil, String comment)
	{
		this.id = id;
		this.name = name;
		this.gender = gender;
		this.validFrom = validFrom;
		this.validUntil = validUntil;
		this.comment = comment;
		this.metaDataEntries = new ArrayList<MetaData>();

		if (!usedIds.contains(id))
			usedIds.add(new Integer(id));
	}

	public int getId()
	{
		return id;
	}

	@XmlAttribute
	public void setId(int id)
	{
		this.id = id;
	}

	public String getName()
	{
		return name;
	}

	@XmlElement
	public void setName(String name)
	{
		this.name = name;
	}

	public int getGender()
	{
		return gender;
	}

	@XmlElement
	public void setGender(int gender)
	{
		this.gender = gender;
	}

	public List<MetaData> getMetaDataEntries()
	{
		return metaDataEntries;
	}

	@XmlElement(name = "toaddata")
	public void setMetaDataEntries(List<MetaData> metaDataEntries)
	{
		this.metaDataEntries = metaDataEntries;
	}

	public String getComment()
	{
		return comment;
	}

	public void setComment(String comment)
	{
		this.comment = comment;
	}

}