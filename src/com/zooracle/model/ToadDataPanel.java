package com.zooracle.model;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

import com.zooracle.view.swing.GUISettings;
import com.zooracle.view.swing.Locale;
import com.zooracle.view.swing.MetaDataPanel;
import com.zooracle.view.swing.ZooracleContentPanel;
import com.zooracle.view.swing.MetaDataPanel.DisplayMode;

public class ToadDataPanel extends MetaDataPanel
{
	
	protected JLabel labelPopulation;
	protected JLabel labelSize1;
	protected JLabel labelSize2;
	protected JLabel labelSizeTotal;
	protected JLabel labelWeight;
	
	protected JComboBox comboBoxPopulation;
	protected JTextField textFieldSize1;
	protected JTextField textFieldSize2;
	protected JTextField textFieldTotal;
	protected JTextField textFieldWeight;
	

	public ToadDataPanel(DisplayMode displayMode)
	{
		super(displayMode);
		

		comboBoxPopulation = new JComboBox(); 
		for (Object item : Locale.dropDownPopulations)
			comboBoxPopulation.addItem(item);	
		comboBoxPopulation.setPreferredSize(new Dimension(iw, lh));
		
		textFieldSize1 = new JTextField("");   textFieldSize1.setPreferredSize(new Dimension(iw, 30)); textFieldSize1.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		textFieldSize2 = new JTextField("");   textFieldSize2.setPreferredSize(new Dimension(iw, 30)); textFieldSize2.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		textFieldWeight = new JTextField("");   textFieldWeight.setPreferredSize(new Dimension(iw, 30)); textFieldWeight.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		textFieldTotal = new JTextField("");   textFieldTotal.setPreferredSize(new Dimension(iw, 30)); textFieldTotal.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		textFieldTotal.setEditable(false);
		
		labelPopulation =     GUISettings.getDefaultLabel(Locale.labelPopulation, lw, lh, a, va);  
		labelSize1 =          GUISettings.getDefaultLabel(Locale.labelSize1, lw, lh, a, va);  		
		labelSize2 =          GUISettings.getDefaultLabel(Locale.labelSize2, lw, lh, a, va);  		
		labelSizeTotal =      GUISettings.getDefaultLabel(Locale.labelSizeTotal, lw, lh, a, va);  		
		labelWeight =         GUISettings.getDefaultLabel(Locale.labelWeight, lw, lh, a, va);  		

		JPanel panelSize1                   = new JPanel(new FlowLayout(orientation)); 
		JPanel panelSize2                   = new JPanel(new FlowLayout(orientation)); 
		JPanel panelSizeTotal               = new JPanel(new FlowLayout(orientation)); 
		JPanel panelWeight                  = new JPanel(new FlowLayout(orientation)); 
		JPanel panelPopulation              = new JPanel(new FlowLayout(orientation)); 
		
		if (currentDisplayMode.equals(DisplayMode.vertical_align_left))
		{
			panelSize1.add(textFieldSize1);		
			panelSize1.add(labelSize1);
			panelSize2.add(textFieldSize2);		
			panelSize2.add(labelSize2);
			panelSizeTotal.add(textFieldTotal);		
			panelSizeTotal.add(labelSizeTotal);
			panelWeight.add(textFieldWeight);		
			panelWeight.add(labelWeight);
			panelPopulation.add(comboBoxPopulation);
			panelPopulation.add(labelPopulation);
		}
		else
		{
			panelSize1.add(labelSize1);
			panelSize1.add(textFieldSize1);		
			panelSize2.add(labelSize2);
			panelSize2.add(textFieldSize2);		
			panelSizeTotal.add(labelSizeTotal);
			panelSizeTotal.add(textFieldTotal);		
			panelWeight.add(labelWeight);
			panelWeight.add(textFieldWeight);		
			panelPopulation.add(labelPopulation);
			panelPopulation.add(comboBoxPopulation);
		}
		
		inputLabels.add(labelSize1);
		inputLabels.add(labelSize2);
		inputLabels.add(labelSizeTotal);
		inputLabels.add(labelWeight);
		inputLabels.add(labelPopulation);

		JPanel toadDataPanel = new JPanel();
		toadDataPanel.setLayout(new BoxLayout(toadDataPanel, BoxLayout.Y_AXIS));
		toadDataPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createLineBorder(Color.black, 1), Locale.labelToadData));
		
		toadDataPanel.add(panelPopulation);
		toadDataPanel.add(panelSize1);
		toadDataPanel.add(panelSize2);
		toadDataPanel.add(panelSizeTotal);
		toadDataPanel.add(panelWeight);
		JPanel placeholder = new JPanel();
		toadDataPanel.add(placeholder);
		
		
		dataPanel.add(toadDataPanel);
		
	}
	
	
	
	@Override
	public void setData(MetaData data) {
		super.setData(data);
	}
	
	

}
