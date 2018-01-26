package com.zooracle.model;

public class Range {
	
	private int from;
	private int to;
	
	public Range(int firstValue, int secondValue) {
		
		this.from = Math.min(firstValue,secondValue);
		this.to = Math.max(firstValue,secondValue);
	}
	
	public int getFrom() {
		return from;
	}
	public void setFrom(int from) {
		this.from = from;
	}
	public int getTo() {
		return to;
	}
	public void setTo(int to) {
		this.to = to;
	}
	
	public int getRange()
	{
		return to - from;
	}
	
	

}
