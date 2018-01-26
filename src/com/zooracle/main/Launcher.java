package com.zooracle.main;

import java.util.HashMap;
import java.util.Map.Entry;

import com.zooracle.model.AnimalDatabase;
import com.zooracle.model.FilterSettings;
import com.zooracle.model.Individual;
import com.zooracle.model.MetaData;
import com.zooracle.model.ToadData;
import com.zooracle.view.swing.DatabaseManagerView;
import com.zooracle.view.swing.ImportSettings;
import com.zooracle.view.swing.ImportView;
import com.zooracle.view.swing.MainWindow;

import tools.legacy.ImageEditorIO;

public class Launcher {
	
	public static String dbName = "E:/temp/workspace2015/zooraclegit/test.sqlite";
	
	public static void main(String[] args)
	{
		AnimalDatabase animalDB = AnimalDatabaseManager.loadDatabase(dbName);
		System.out.println(animalDB.getImagePath());
		System.out.println("db found: " + animalDB);
		for (Entry<String, Individual> individualEntry : animalDB.getIndividuals().entrySet())
		{
			System.out.println(individualEntry.getKey() + " "  + individualEntry.getValue().getName() + ":");
			for (MetaData metaData : individualEntry.getValue().getMetaDataEntries())
			{
				System.out.println(metaData);
			}
		}
		
		String basePath = Settings.imgPath;
//		String basePath = "/media/horus/gammaray/zimg/";
		
		HashMap<Integer, ToadData> toads = ImageEditorIO.loadToadDataFile(Settings.imgPath+"pumilio_rio_gloria_small_list.xml");
		for (ToadData toadData : toads.values())
		{
			toadData.setFileName(basePath + toadData.getFileName());
//			toadData.setZooName(basePath + toadData.getZooName());
			toadData.setZooName(null);
		}
////		TODO INSERT BEFORE IMPORT OR WHEN SAVING
//		for (ToadData toadData : toads.values())
//		{
//			toadData.setId(-1);
//			toadData.setIndividualId(-1);
//			toadData.setImageSettings(null);
//			System.out.println(toadData);
////			toadData.setZooName(null);
//			int newId = AnimalDatabaseManager.insertToadData(toadData);
//			System.out.println("new id: " + newId);
////			if (1==1)
////				System.exit(1);
//		}
		
		Controller.currentDB = animalDB;
		MainWindow mainWindow = new MainWindow();
		
//		//compare
//		DatabaseManagerView dbManagerView = new DatabaseManagerView(mainWindow);
//		mainWindow.setContent(dbManagerView);
//		dbManagerView.setFilter(FilterSettings.importSettings);
		
//		import
		ImportView importView = new ImportView(mainWindow);
		importView.setPhotoMap(toads);
		mainWindow.setContent(importView);
		
//		ImportSettings importSettings = new ImportSettings(mainWindow);
//		mainWindow.setContent(importSettings);
//		StartScreen startScreen = new StartScreen(mainWindow);
//		mainWindow.setContent(startScreen);
//		startScreen.setDatabase(null);
		
		Launcher l = new Launcher();
	}
	
	
	public Launcher() {
		
	}

}
