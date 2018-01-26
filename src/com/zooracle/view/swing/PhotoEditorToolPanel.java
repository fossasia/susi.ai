package com.zooracle.view.swing;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.util.ArrayList;

import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JSlider;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import com.zooracle.model.ColorRange;

public class PhotoEditorToolPanel extends JPanel
{

	private PhotoEditorPanel editor;
	private int iWidth = 320;
	private int iHeight = 720;

	private ArrayList<ColorRange> colorRanges;
	private ArrayList<ColorRangePanel> colorRangePanels;
	private JLabel labelContrast;
	private JSlider sliderContrast;
	private JPanel contrastPanel;
	private JPanel container;

	public PhotoEditorToolPanel(final PhotoEditorPanel editor)
	{
		this.editor = editor;

//		this.setResizable(false);

		this.setPreferredSize(new Dimension(300,600));
		this.setVisible(true);

		this.addKeyListener(editor.getKeyListener());

		this.colorRangePanels = new ArrayList<ColorRangePanel>();
		this.labelContrast = new JLabel("contrast");
		this.sliderContrast = new JSlider(-100, 100, 0);

		this.setLayout(new BorderLayout());

		this.container = new JPanel();

		this.contrastPanel = new JPanel(new FlowLayout());
		this.contrastPanel.add(labelContrast);
		this.contrastPanel.add(sliderContrast);

		this.add(contrastPanel, BorderLayout.NORTH);
		this.add(container, BorderLayout.CENTER);

		this.sliderContrast.addChangeListener(new ChangeListener()
		{
			public void stateChanged(ChangeEvent e)
			{
				editor.setContrast(sliderContrast.getValue());
			}
		});
		this.sliderContrast.addKeyListener(editor.getKeyListener());
	}

	public void setColorSettings(ArrayList<ColorRange> colorRanges, int contrast)
	{
		for (ColorRangePanel colorRangePanel : colorRangePanels)
			this.container.remove(colorRangePanel);
		colorRangePanels.clear();

		this.container.setLayout(new GridLayout(colorRanges.size(), 1));
		for (ColorRange colorRange : colorRanges)
		{
			ColorRangePanel colorRangePanel = new ColorRangePanel(colorRange, editor, this);
			this.colorRangePanels.add(colorRangePanel);
			this.container.add(colorRangePanel);

		}

		this.revalidate();
		this.repaint();
		this.sliderContrast.setValue(contrast);

	}

	public int getiWidth()
	{
		return iWidth;
	}

	public int getiHeight()
	{
		return iHeight;
	}

}
