package com.zooracle.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ToadData extends MetaData {
	
	private int toadDataId;
	private String population;
	private double size1;
	private double size2;
	private double weight;
	private int ageClass;
	
	private int metaDataId;
	
	private String altName;
	
	public static int currentId = 0;
	public static List<Integer> usedIds = new ArrayList<Integer>();
	
	private static int getNextFreeId()
	{
		while (usedIds.contains(currentId))
			currentId++;
		usedIds.add(new Integer(currentId));
		return new Integer(currentId);
	}
	
	public ToadData()
	{
		this.id = getNextFreeId();
		this.individualId = -1;
	}

	public ToadData(int toadDataId)
	{
		this.toadDataId = toadDataId;
		this.individualId = -1;
	}
	
	@Override
	public int getId() {
		return toadDataId;
	}
	
	
	public String getPopulation()
	{
		return population;
	}
	
	@XmlElement
	public void setPopulation(String population)
	{
		this.population = population;
	}
	public double getSize1()
	{
		return size1;
	}
	@XmlElement
	public void setSize1(double size1)
	{
		this.size1 = size1;
	}
	public double getSize2()
	{
		return size2;
	}
	@XmlElement
	public void setSize2(double size2)
	{
		this.size2 = size2;
	}
	public double getWeight()
	{
		return weight;
	}
	@XmlElement
	public void setWeight(double weight)
	{
		this.weight = weight;
	}
	public int getAgeClass()
	{
		return ageClass;
	}
	@XmlElement
	public void setAgeClass(int ageClass)
	{
		this.ageClass = ageClass;
	}

	public int getMetaDataId()
	{
		return metaDataId;
	}

	public void setMetaDataId(int metaDataId)
	{
		this.metaDataId = metaDataId;
	}

	@Override
	public String toString() {
		return "ToadData [toadDataId=" + toadDataId + ", population=" + population + ", size1=" + size1 + ", size2=" + size2 + ", weight=" + weight + ", ageClass=" + ageClass + ", metaDataId=" + metaDataId + ", altName=" + altName + ", id="
				+ id + ", validFrom=" + validFrom + ", validUntil=" + validUntil + ", fileName=" + fileName + ", zooName=" + zooName + ", name=" + name + ", comment=" + comment + ", gpsLat=" + gpsLat + ", gpsLon=" + gpsLon + ", view="
				+ view + ", imageSettings=" + imageSettings + ", individualId=" + individualId + ", thumbnail=" + thumbnail + "]";
	}

	
	
	
	
	
	

}
