package com.zooracle.model;

import java.sql.Timestamp;
import java.util.HashMap;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.zooracle.model.sql.SQLiteStructure;

@XmlRootElement
public abstract class MetaData {
	
	protected int id;
	protected long validFrom;
	protected long validUntil;
	protected String fileName;
	protected String zooName;
	protected String name;
	protected String comment;
	protected double gpsLat;
	protected double gpsLon;
	protected int view;
	protected ImageSettings imageSettings;
	protected int individualId;
	protected String thumbnail;
	
	public String getThumbnail() {
		return thumbnail;
	}
	
	public void setThumbnail(String thumbnail) {
		this.thumbnail = thumbnail;
	}
	
	public int getId() {
		return id;
	}
	@XmlElement
	public void setId(int id) {
		this.id = id;
	}
	public String getFileName() {
		return fileName;
	}
	
	public void setIndividualId(int individualId) {
		this.individualId = individualId;
	}
	
	public int getIndividualId() {
		return individualId;
	}
	
	
	public long getValidFrom() {
		return validFrom;
	}
	
	@XmlElement
	public void setValidFrom(long validFrom) {
		this.validFrom = validFrom;
	}
	public long getValidUntil() {
		return validUntil;
	}
	@XmlElement
	public void setValidUntil(long validUntil) {
		this.validUntil = validUntil;
	}
	@XmlElement
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getZooName() {
		return zooName;
	}
	@XmlElement
	public void setZooName(String zooName) {
		this.zooName = zooName;
	}
	public String getName() {
		return name;
	}
	@XmlElement
	public void setName(String name) {
		this.name = name;
	}
	public String getComment() {
		return comment;
	}
	@XmlElement
	public void setComment(String comment) {
		this.comment = comment;
	}
	public double getGpsLat() {
		return gpsLat;
	}
	@XmlElement
	public void setGpsLat(double gpsLat) {
		this.gpsLat = gpsLat;
	}
	public double getGpsLon() {
		return gpsLon;
	}
	
	@XmlElement
	public void setGpsLon(double gpsLon) {
		this.gpsLon = gpsLon;
	}

	public int getView() {
		return view;
	}
	
	@XmlElement
	public void setView(int view) {
		this.view = view;
	}
	public ImageSettings getImageSettings()
	{
		return imageSettings;
	}
	@XmlElement
	public void setImageSettings(ImageSettings imageSettings)
	{
		this.imageSettings = imageSettings;
	}
	
	public HashMap<String, String> getColumnValues()
	{
		HashMap<String, String> columnValues = new HashMap<String, String>();
		if (id > -1)
			columnValues.put(SQLiteStructure.columnId,""+id);
		
		columnValues.put(SQLiteStructure.columnValidFrom,""+validFrom);
		columnValues.put(SQLiteStructure.columnValidUntil,""+validUntil);
		
		columnValues.put(SQLiteStructure.columnZooName,zooName);
		columnValues.put(SQLiteStructure.columnAltName,name);
		
		columnValues.put(SQLiteStructure.columnView,""+view);
		columnValues.put(SQLiteStructure.columnIndividualId,""+individualId);
		
		columnValues.put(SQLiteStructure.columnComment,comment);
		columnValues.put(SQLiteStructure.columnGpsLat,""+gpsLat);
		columnValues.put(SQLiteStructure.columnGpsLon,""+gpsLon);
		
		columnValues.put(SQLiteStructure.columnFileName,fileName);
		
		return null;
	}
	
	
	
	
	

}
