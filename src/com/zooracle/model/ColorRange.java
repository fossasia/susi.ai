package com.zooracle.model;

import java.util.ArrayList;
import java.util.List;

public class ColorRange
{

	// private int id = 0;

	private int mode;
	private double hl;
	private double sl;
	private double vl;
	private double hh;
	private double sh;
	private double vh;
	private double feather;
	public static List<Integer> usedIds = new ArrayList<Integer>();
	public static int currentId = 0;

	private int id;

	public ColorRange(int i, int j, int k, int l, int m, int n, int o)
	{
		this.mode = o;
		this.hl = i;
		this.sl = j;
		this.vl = k;
		this.hh = l;
		this.sh = m;
		this.vh = n;

		this.id = getNextFreeId();
	}

	public ColorRange(int id)
	{
		this.id = id;
		if (!usedIds.contains(id))
			usedIds.add(new Integer(id));
	}

	public ColorRange()
	{
		this.id = getNextFreeId();
	}

	public int getMode()
	{
		return mode;
	}

	public void setMode(int mode)
	{
		this.mode = mode;
	}

	public double getHl()
	{
		return hl;
	}

	public void setHl(double hl)
	{
		this.hl = hl;
	}

	public double getSl()
	{
		return sl;
	}

	public void setSl(double sl)
	{
		this.sl = sl;
	}

	public double getVl()
	{
		return vl;
	}

	public void setVl(double vl)
	{
		this.vl = vl;
	}

	public double getHh()
	{
		return hh;
	}

	public void setHh(double hh)
	{
		this.hh = hh;
	}

	public double getSh()
	{
		return sh;
	}

	public void setSh(double sh)
	{
		this.sh = sh;
	}

	public double getVh()
	{
		return vh;
	}

	public void setVh(double vh)
	{
		this.vh = vh;
	}

	public void setRange(double i, double j, double k, double l, double m, double n)
	{
		this.hl = i;
		this.sl = j;
		this.vl = k;
		this.hh = l;
		this.sh = m;
		this.vh = n;

	}

	public double getFeather()
	{
		return feather;
	}

	public void setFeather(double feather)
	{
		this.feather = feather;
	}

	@Override
	public String toString()
	{
		return "ColorRange [mode=" + mode + ", hl=" + hl + ", sl=" + sl + ", vl=" + vl + ", hh=" + hh + ", sh=" + sh + ", vh=" + vh + ", feather=" + feather + "]";
	}

	private static int getNextFreeId()
	{
		while (usedIds.contains(currentId))
			currentId++;
		usedIds.add(new Integer(currentId));
		return new Integer(currentId);
	}

}
