package com.zooracle.model;

import java.util.ArrayList;

/*
 * 
 *  Y=1
 *	h=48
 *	s=99 = 252
 *	v=91 = 232
 *
 *	Y=1
 *	h=57
 *	s=37 = 94
 *	v=99 = 252
 *
 *	Y=1
 *	h=47
 *	s=20 = 51
 *	v=83 = 211
 *
 *	D=2
 *	h=46
 *	s=29 = 73
 *	b=52 = 132
 *
 *	D=2
 *	h=36
 *	s=23 = 58
 *	b=45 = 114
 * 
 * 40-112
29-255
116-255

50-360
0-255
252-255
 */

public class ColorRangeYBT implements ColorRangePreset {
	
	private ArrayList<ColorRange> colorRanges;
	public ColorRangeYBT() {
	}

	public ArrayList<ColorRange> getColorRanges() {
		colorRanges = new ArrayList<ColorRange>();
		colorRanges.add(new ColorRange(20,29, 116, 112,255,255,1));
		colorRanges.add(new ColorRange(18, 58, 114, 23, 73,132,0));
		colorRanges.add(new ColorRange(25, 0, 252, 180, 255,255,1));
		return colorRanges;
	}
	

}
