package com.zooracle.view.swing;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.BorderFactory;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JSlider;
import javax.swing.JToggleButton;
import javax.swing.SwingConstants;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;

import com.zooracle.model.ColorRange;

public class ColorRangePanel extends JPanel
{

	private JPanel rangeH;
	private JPanel rangeS;
	private JPanel rangeV;
	private JPanel colorPanel;

	private JSlider sliderRangeHV;
	private JSlider sliderRangeHT;

	private JSlider sliderRangeSV;
	private JSlider sliderRangeST;

	private JSlider sliderRangeVV;
	private JSlider sliderRangeVT;

	private JLabel labelHueV;
	private JLabel labelValueV;
	private JLabel labelSaturationV;
	private JLabel labelHueT;
	private JLabel labelValueT;
	private JLabel labelSaturationT;

	private PhotoEditorPanel editor;
	private JPanel window;
	private ColorRange colorRange;

	private JToggleButton buttonAdd;
	private JToggleButton buttonSubtract;
	private JToggleButton buttonDisable;
	private JPanel topPanel;
	private JPanel topSubPanel;
	private JPanel topTopPanel;

	public ColorRangePanel(final ColorRange colorRange, PhotoEditorPanel editor, JPanel window)
	{

		this.editor = editor;
		this.window = window;
		this.colorRange = colorRange;

		this.setLayout(new GridLayout(4, 1));

		this.setPreferredSize(new Dimension(400, 200));

		this.rangeH = new JPanel(new GridLayout(2, 2));
		this.rangeS = new JPanel(new GridLayout(2, 2));
		this.rangeV = new JPanel(new GridLayout(2, 2));
		this.colorPanel = new JPanel();

		this.rangeH.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEtchedBorder(), "hue"));
		this.rangeS.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEtchedBorder(), "saturation"));
		this.rangeV.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEtchedBorder(), "value"));

		this.labelHueV = new JLabel(+colorRange.getHl() * 2 + " ", SwingConstants.RIGHT);
		this.labelHueT = new JLabel(+colorRange.getHh() * 2 + " ", SwingConstants.RIGHT);

		this.labelSaturationV = new JLabel(colorRange.getSl() + " ", SwingConstants.RIGHT);
		this.labelSaturationT = new JLabel(colorRange.getSh() + " ", SwingConstants.RIGHT);

		this.labelValueV = new JLabel(colorRange.getVl() + " ", SwingConstants.RIGHT);
		this.labelValueT = new JLabel(colorRange.getVh() + " ", SwingConstants.RIGHT);

		this.sliderRangeHV = new JSlider(0, 180, (int) colorRange.getHl());
		this.sliderRangeHT = new JSlider(0, 180, (int) colorRange.getHh());

		this.sliderRangeSV = new JSlider(0, 255, (int) colorRange.getSl());
		this.sliderRangeST = new JSlider(0, 255, (int) colorRange.getSh());

		this.sliderRangeVV = new JSlider(0, 255, (int) colorRange.getVl());
		this.sliderRangeVT = new JSlider(0, 255, (int) colorRange.getVh());

		this.sliderRangeHV.addChangeListener(new ChangeListener()
		{

			public void stateChanged(ChangeEvent e)
			{

				int val = ((JSlider) e.getSource()).getValue();
				if (val < colorRange.getHh())
				{
					if (colorRange.getHl() != val)
					{
						colorRange.setHl(val);
						updateColorRange();
					}
				} else
					((JSlider) e.getSource()).setValue((int) colorRange.getHh() + 1);

				labelHueV.setText(colorRange.getHl() * 2 + " ");

			}

		});
		this.sliderRangeSV.addChangeListener(new ChangeListener()
		{
			public void stateChanged(ChangeEvent e)
			{
				int val = ((JSlider) e.getSource()).getValue();
				if (val < colorRange.getSh())
				{
					if (colorRange.getSl() != val)
					{
						colorRange.setSl(val);
						updateColorRange();
					}
				} else
					((JSlider) e.getSource()).setValue((int) colorRange.getSh() + 1);

				labelSaturationV.setText(colorRange.getSl() + " ");

			}
		});
		this.sliderRangeVV.addChangeListener(new ChangeListener()
		{
			public void stateChanged(ChangeEvent e)
			{
				int val = ((JSlider) e.getSource()).getValue();
				if (val < colorRange.getVh())
				{
					if (colorRange.getVl() != val)
					{
						colorRange.setVl(val);
						updateColorRange();
						labelHueV.setText(colorRange.getHl() * 2 + " ");

					}
				} else
					((JSlider) e.getSource()).setValue((int) colorRange.getVh() + 1);

				labelValueV.setText(colorRange.getVl() + " ");
			}
		});

		this.sliderRangeHT.addChangeListener(new ChangeListener()
		{
			public void stateChanged(ChangeEvent e)
			{
				int val = ((JSlider) e.getSource()).getValue();
				if (val > colorRange.getHl())
				{
					if (colorRange.getHh() != val)
					{
						colorRange.setHh(val);
						updateColorRange();
					}
				} else
					((JSlider) e.getSource()).setValue((int) colorRange.getHl() - 1);
				labelHueT.setText(colorRange.getHh() * 2 + " ");

			}
		});
		this.sliderRangeST.addChangeListener(new ChangeListener()
		{
			public void stateChanged(ChangeEvent e)
			{
				int val = ((JSlider) e.getSource()).getValue();
				if (val > colorRange.getSl())
				{
					if (colorRange.getSh() != val)
					{
						colorRange.setSh(val);
						updateColorRange();
					}
				} else
					((JSlider) e.getSource()).setValue((int) colorRange.getSl() - 1);
				labelSaturationT.setText(colorRange.getSh() + " ");
			}
		});
		this.sliderRangeVT.addChangeListener(new ChangeListener()
		{
			public void stateChanged(ChangeEvent e)
			{
				int val = ((JSlider) e.getSource()).getValue();
				if (val > colorRange.getVl())
				{
					if (colorRange.getVh() != val)
					{
						colorRange.setVh(val);
						updateColorRange();
					}
				} else
					((JSlider) e.getSource()).setValue((int) colorRange.getVl() - 1);
				labelValueT.setText(colorRange.getVh() + " ");
			}
		});

		this.buttonAdd = new JToggleButton(Locale.buttonAdd);
		this.buttonSubtract = new JToggleButton(Locale.buttonSubtract);
		this.buttonDisable = new JToggleButton(Locale.buttonDisable);

		this.buttonAdd.setSelected(true);

		this.buttonAdd.addActionListener(new ActionListener()
		{

			public void actionPerformed(ActionEvent e)
			{
				colorRange.setMode(1);
				updateSelection();
				updateColorRange();

			}
		});
		this.buttonSubtract.addActionListener(new ActionListener()
		{
			public void actionPerformed(ActionEvent e)
			{
				colorRange.setMode(2);
				updateSelection();
				updateColorRange();

			}
		});
		this.buttonDisable.addActionListener(new ActionListener()
		{
			public void actionPerformed(ActionEvent e)
			{
				colorRange.setMode(0);
				updateSelection();
				updateColorRange();

			}
		});

		this.rangeH.add(labelHueV);
		this.rangeH.add(sliderRangeHV);
		this.rangeH.add(labelHueT);
		this.rangeH.add(sliderRangeHT);

		this.rangeS.add(labelSaturationV);
		this.rangeS.add(sliderRangeSV);
		this.rangeS.add(labelSaturationT);
		this.rangeS.add(sliderRangeST);

		this.rangeV.add(labelValueV);
		this.rangeV.add(sliderRangeVV);
		this.rangeV.add(labelValueT);
		this.rangeV.add(sliderRangeVT);

		this.topPanel = new JPanel(new GridLayout(1, 4));
		// this.topPanel.add(colorPanel);
		this.topPanel.add(buttonAdd);
		this.topPanel.add(buttonSubtract);
		this.topPanel.add(buttonDisable);

		this.topSubPanel = new JPanel(new BorderLayout());
		JLabel titleLabel = new JLabel("");
		this.topTopPanel = new JPanel(new GridLayout(1, 1));
		// this.topTopPanel.setBackground(new Color(130,150,150));
		this.topTopPanel.add(titleLabel);
		this.topSubPanel.add(topTopPanel, BorderLayout.NORTH);
		this.topSubPanel.add(topPanel, BorderLayout.CENTER);

		this.add(topSubPanel);
		this.add(rangeH);
		this.add(rangeS);
		this.add(rangeV);

		this.setBorder(BorderFactory.createTitledBorder(BorderFactory.createEtchedBorder(), ""));
		this.setBackground(new Color(185, 190, 190));

		updateSelection();

		this.setVisible(true);

		this.addKeyListener(editor.getKeyListener());

	}

	private void updateSelection()
	{

		this.buttonAdd.setSelected(colorRange.getMode() == 1 ? true : false);
		this.buttonSubtract.setSelected(colorRange.getMode() == 2 ? true : false);
		this.buttonDisable.setSelected(colorRange.getMode() == 0 ? true : false);

		rangeH.setEnabled(colorRange.getMode() > 0 ? true : false);
		rangeS.setEnabled(colorRange.getMode() > 0 ? true : false);
		rangeV.setEnabled(colorRange.getMode() > 0 ? true : false);
		sliderRangeHV.setEnabled(colorRange.getMode() > 0 ? true : false);
		sliderRangeSV.setEnabled(colorRange.getMode() > 0 ? true : false);
		sliderRangeVV.setEnabled(colorRange.getMode() > 0 ? true : false);
		sliderRangeHT.setEnabled(colorRange.getMode() > 0 ? true : false);
		sliderRangeST.setEnabled(colorRange.getMode() > 0 ? true : false);
		sliderRangeVT.setEnabled(colorRange.getMode() > 0 ? true : false);
		labelHueV.setEnabled(colorRange.getMode() > 0 ? true : false);
		labelValueV.setEnabled(colorRange.getMode() > 0 ? true : false);
		labelHueT.setEnabled(colorRange.getMode() > 0 ? true : false);
		labelSaturationV.setEnabled(colorRange.getMode() > 0 ? true : false);
		labelSaturationT.setEnabled(colorRange.getMode() > 0 ? true : false);
		labelValueT.setEnabled(colorRange.getMode() > 0 ? true : false);

	}

	private void updateColorRange()
	{

		editor.updateColorRange();
		editor.requestFocus();

	}

	public void updateSliders()
	{

		this.sliderRangeHV.setValue((int) this.colorRange.getHl());
		this.sliderRangeSV.setValue((int) this.colorRange.getSl());
		this.sliderRangeVV.setValue((int) this.colorRange.getVl());
		this.sliderRangeHT.setValue((int) this.colorRange.getHh());
		this.sliderRangeST.setValue((int) this.colorRange.getSh());
		this.sliderRangeVT.setValue((int) this.colorRange.getVh());

	}

}
