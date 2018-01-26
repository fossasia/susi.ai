package com.zooracle.view.swing;

import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.GridLayout;
import java.awt.event.ComponentEvent;
import java.awt.event.ComponentListener;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;

import com.zooracle.model.AnimalDatabase;

public class StartScreen extends ZooracleContentPanel
{

	private AnimalDatabase db;
	
	private JLabel currentDBLabel;
	private JTextField dbTextField;
	private JButton selectDatabaseButton;
	private JButton newDatabaseButton;
	private JButton editDatabaseButton;
	private JLabel currentDBTitleLabel;
	private JLabel currentDBTypeLabel;
	private JTextField dbTypeTextField;
	private JTextField dbTitleTextField;
	private MetaDataPanel metaDataPanel;

	private IndividualDataPanel individualDataPanel;

	public StartScreen(MainWindow mainWindow)
	{
		super(mainWindow);
		this.setLayout(new GridLayout(2,1));
		this.setBackground(GUISettings.windowColor);
		this.setBorder(BorderFactory.createEmptyBorder(30, 30, 30, 30));
		
		JPanel databasePanel = new JPanel();
		databasePanel.setBorder(BorderFactory.createTitledBorder(Locale.database));
//		databasePanel.setLayout(new FlowLayout(FlowLayout.LEADING));
		databasePanel.setLayout(new BoxLayout(databasePanel, BoxLayout.Y_AXIS));
		databasePanel.setBackground(this.getBackground().brighter());
		
		
		JPanel dbInfoPanel = new JPanel();
		JPanel dbControlPanel = new JPanel();
		
		dbInfoPanel.setLayout(new FlowLayout(FlowLayout.LEADING));
		dbControlPanel.setLayout(new FlowLayout(FlowLayout.TRAILING));
		
		currentDBLabel = new JLabel(Locale.labelCurrentDB + ": ");
		dbTextField = new JTextField("/");
		dbTextField.setEditable(false);
		
		currentDBTitleLabel = new JLabel(Locale.labelDBTitle + ": ");
		dbTitleTextField = new JTextField("");
		dbTitleTextField.setEditable(false);

		currentDBTypeLabel = new JLabel(Locale.labelDBType + ": ");
		dbTypeTextField = new JTextField("");
		dbTypeTextField.setEditable(false);
		
		
 		selectDatabaseButton = new JButton(Locale.buttonSelect); 
		newDatabaseButton = new JButton(Locale.buttonNew);
		editDatabaseButton = new JButton(Locale.buttonEdit);
		
		editDatabaseButton.setEnabled(false);
		
		dbInfoPanel.add(currentDBLabel);
		dbInfoPanel.add(dbTextField);
		dbInfoPanel.add(currentDBTitleLabel);
		dbInfoPanel.add(dbTitleTextField);
		dbInfoPanel.add(currentDBTypeLabel);
		dbInfoPanel.add(dbTypeTextField);
		
		dbControlPanel.add(newDatabaseButton);
		dbControlPanel.add(selectDatabaseButton);
		dbControlPanel.add(editDatabaseButton);
		
		databasePanel.add(dbInfoPanel);
		databasePanel.add(dbControlPanel);
		
		this.add(databasePanel);
		for (Component c : databasePanel.getComponents())
		{
			if (c instanceof JButton)
				c.setBackground(databasePanel.getBackground().brighter());
			if (c instanceof JPanel)
				c.setBackground(databasePanel.getBackground());			
		}
		
//		this.setMinimumSize(new Dimension(this.mainWindow.getWidth()-80, this.mainWindow.getHeight()-80));
//		this.setPreferredSize(new Dimension(this.mainWindow.getWidth()-80, this.mainWindow.getHeight()-80));
		
		
		resizeComponents();
		
		this.addComponentListener(new ComponentListener()
		{
			public void componentShown(ComponentEvent e) {}
			public void componentResized(ComponentEvent e)
			{
				resizeComponents();
			}
			public void componentMoved(ComponentEvent e) {}
			public void componentHidden(ComponentEvent e) {}
		});
	}
	
	protected void resizeComponents()
	{
		dbTextField.setPreferredSize(new Dimension(StartScreen.this.mainWindow.getWidth()/4 - 30, 25));
		dbTitleTextField.setPreferredSize(new Dimension(StartScreen.this.mainWindow.getWidth()/4 - 30, 25));
		dbTypeTextField.setPreferredSize(new Dimension(StartScreen.this.mainWindow.getWidth()/4 - 30, 25));
		
	}

	public void setDatabase(AnimalDatabase db)
	{
		
		if (db == null)
		{
			this.db = null;
			dbTextField.setText("");
			dbTitleTextField.setText("");
			dbTypeTextField.setText("");
			
			editDatabaseButton.setEnabled(false);
			
		}
		else
		{
			this.db = db;
			dbTextField.setText(db.getDBLocation());
			dbTitleTextField.setText(db.getTitle());
			dbTypeTextField.setText(db.getType());
			
			editDatabaseButton.setEnabled(true);
		}
		
		this.repaint();
		
	}
	

}
