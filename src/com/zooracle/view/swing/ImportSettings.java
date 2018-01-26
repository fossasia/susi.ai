package com.zooracle.view.swing;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;

import javax.swing.BorderFactory;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

public class ImportSettings extends ZooracleContentPanel
{
	protected JComboBox comboBoxDatabase;
	private JLabel dbNameLabel;
	private JTextField dbNameTextField;
	private JButton importButton;

	private ArrayList<String> existingDatabases;

	public ImportSettings(MainWindow mainWindow)
	{
		super(mainWindow);
		existingDatabases = new ArrayList<String>();
		existingDatabases.add(Locale.labelNew);
		existingDatabases.add("10.02.2015 \"bt\" (50 individuals)");
		existingDatabases.add("10.02.2006 \"bt\" (50 individuals)");

		dbNameLabel = new JLabel(Locale.labelDBName);
		dbNameTextField = new JTextField();
		dbNameTextField.setPreferredSize(new Dimension(200, 30));
		importButton = new JButton(Locale.labelImport);
		importButton.setEnabled(false);

		dbNameTextField.addKeyListener(new KeyListener() {

			public void keyTyped(KeyEvent e) {
				updateImportNameValidity();
			}

			public void keyReleased(KeyEvent e) {
				updateImportNameValidity();
			}

			public void keyPressed(KeyEvent e) {

			}
		});

		comboBoxDatabase = new JComboBox();
		for (String db : existingDatabases)
			comboBoxDatabase.addItem(db);

		comboBoxDatabase.addItemListener(new ItemListener() {

			public void itemStateChanged(ItemEvent e) {
				// System.out.println("sel item: " +
				// comboBoxDatabase.getSelectedItem()+ " trigger " +
				// e.getItem().toString());

				if (!comboBoxDatabase.getSelectedItem().equals(e.getItem()))
					return;

				if (e.getItem().toString().equals(Locale.labelNew)) {
					// dbNameLabel.setEnabled(true);
					dbNameTextField.setText("");
					// System.out.println("new selected");

				} else {
					dbNameTextField.setText(e.getItem().toString());
				}
				updateImportNameValidity();
			}
		});

		// this.setLayout(new BoxLayout(this, BoxLayout.X_AXIS));
		JPanel panel = new JPanel();
		panel.setBorder(BorderFactory.createEmptyBorder(100, 100, 100, 100));
		panel.setLayout(new FlowLayout(FlowLayout.LEFT));
		panel.setPreferredSize(new Dimension(600, 300));
		JLabel label = new JLabel(Locale.labelImportOption);
		panel.add(label);
		panel.add(comboBoxDatabase);
		comboBoxDatabase.setMaximumSize(new Dimension(200, 30));

		JPanel dbNamePanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
		dbNamePanel.setPreferredSize(new Dimension(600, 100));
		dbNamePanel.add(dbNameLabel);
		dbNamePanel.add(dbNameTextField);

		JPanel importPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
		importPanel.setPreferredSize(new Dimension(400, 50));
		importPanel.add(importButton);

		// importPanel.add(new JLabel(Locale.label))
		panel.add(dbNamePanel);
		panel.add(importPanel);
		this.add(panel);

	}

	public void updateImportNameValidity() {
		System.out.println(dbNameTextField.getText().trim());
		if (dbNameTextField.getText().trim().equals("")) {
			importButton.setEnabled(false);
			return;
		}
		for (String db : existingDatabases) {
			if (dbNameTextField.getText().trim().equals(db.trim())) {
				importButton.setEnabled(false);
				return;
			}
		}
		importButton.setEnabled(true);
	}

}
