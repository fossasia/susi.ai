package com.zooracle.model;

import java.io.File;
import java.util.ArrayList;

import javax.xml.bind.annotation.XmlElement;

public class ImageSettings
{
	private static int currentID = -1;
	
	private int id;
	private int zoom;
	private int angle;
	private int posX;
	private int posY;
	private int imgOffsetX;
	private int imgOffsetY;
	private int contrast;
	private int brightness;
	private int customParam1;
	private int customParam2;
	private int customParam3;
	private ArrayList<ColorRange> colorRanges;

	private boolean blur;
	private int blurSize;
	
//	public ImageSettings(File fileName, ColorRangePreset colorRangePreset)
	public ImageSettings(ColorRangePreset colorRangePreset)
	{
//		this.imageFile = fileName;
		this.id = ++currentID;
		this.colorRanges = new ArrayList<ColorRange>();
		this.colorRanges.addAll(colorRangePreset.getColorRanges());
		
		setDefaultValues();
	}
	
	public ImageSettings(int id)
	{
		this.id = id;
		setDefaultValues();
	}
	
	public ArrayList<ColorRange> getColorRanges() {
		return colorRanges;
	}
	
	@XmlElement
	public void setColorRanges(ArrayList<ColorRange> colorRanges) {
		this.colorRanges = colorRanges;
	}

	public ImageSettings(ImageSettings currentImageMeta) {
		
		this.id = new Integer(currentImageMeta.getId());
		
		this.imgOffsetX = new Integer(currentImageMeta.getImgOffsetX());
		this.imgOffsetY = new Integer(currentImageMeta.getImgOffsetY());
		this.zoom = new Integer(currentImageMeta.getZoom());
		this.angle = new Integer(currentImageMeta.getAngle());
		this.posX = new Integer(currentImageMeta.getPosX());
		this.posY = new Integer(currentImageMeta.getPosY());
		this.contrast = new Integer(currentImageMeta.getContrast());
		
		this.blur = new Boolean(currentImageMeta.getBlur());
		
		this.colorRanges = new ArrayList<ColorRange>(currentImageMeta.getColorRanges());
		
	}

	@XmlElement
	private void setDefaultValues()
	{
		this.imgOffsetX = 0;
		this.imgOffsetY = 0;
		this.zoom = 20;
		this.angle = 0;
		this.posX = 250;
		this.posY = 250;
		this.blur = true;
		this.contrast = 0;
		this.brightness = 0;
		this.customParam1 = 0;
		this.customParam2 = 0;
		this.customParam3 = 0;	
		this.colorRanges = new ArrayList<ColorRange>();
		
	}
	
	public int getId()
	{
		return id;
	}
	
	@XmlElement
	public void setId(int id)
	{
		this.id = id;
	}
	
	public static void setCurrentID(int currentID)
	{
		ImageSettings.currentID = currentID;
	}

	public int getZoom()
	{
		return zoom;
	}
	@XmlElement
	public void setZoom(int zoom)
	{
		this.zoom = zoom;
	}
	public int getAngle()
	{
		return angle;
	}
	@XmlElement
	public void setAngle(int angle)
	{
		this.angle = angle;
	}
	public int getPosX()
	{
		return posX;
	}
	@XmlElement
	public void setPosX(int posX)
	{
		this.posX = posX;
	}
	public int getPosY()
	{
		return posY;
	}
	@XmlElement
	public void setPosY(int posY)
	{
		this.posY = posY;
	}
	
	public int getImgOffsetX() {
		return imgOffsetX;
	}
	
	public int getImgOffsetY() {
		return imgOffsetY;
	}
	
	@XmlElement
	public void setImgOffsetX(int imgOffsetX) {
		this.imgOffsetX = imgOffsetX;
	}
	
	@XmlElement
	public void setImgOffsetY(int imgOffsetY) {
		this.imgOffsetY = imgOffsetY;
	}
	
	public int getContrast() {
		return contrast;
	}
	
	@XmlElement
	public void setContrast(int contrast) {
		this.contrast = contrast;
	}

	@XmlElement
	public void setBlur(boolean blur) {
		this.blur = blur;
	}

	public boolean getBlur() {
		return blur;
	}

	public int getBrightness()
	{
		return brightness;
	}

	@XmlElement
	public void setBrightness(int brightness)
	{
		this.brightness = brightness;
	}

	public int getCustomParam1()
	{
		return customParam1;
	}

	@XmlElement
	public void setCustomParam1(int customParam1)
	{
		this.customParam1 = customParam1;
	}

	public int getCustomParam2()
	{
		return customParam2;
	}

	@XmlElement
	public void setCustomParam2(int customParam2)
	{
		this.customParam2 = customParam2;
	}

	public int getCustomParam3()
	{
		return customParam3;
	}

	@XmlElement
	public void setCustomParam3(int customParam3)
	{
		this.customParam3 = customParam3;
	}

	public int getBlurSize()
	{
		return blurSize;
	}

	public void setBlurSize(int blurSize)
	{
		this.blurSize = blurSize;
	}
	
	
	
	
	
	

}

