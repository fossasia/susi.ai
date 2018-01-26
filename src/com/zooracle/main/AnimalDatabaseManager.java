package com.zooracle.main;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;
import java.util.Map.Entry;

import com.zooracle.model.AnimalDatabase;
import com.zooracle.model.ColorRange;
import com.zooracle.model.ImageSettings;
import com.zooracle.model.Individual;
import com.zooracle.model.MetaData;
import com.zooracle.model.ToadData;
import com.zooracle.model.ToadDatabase;
import com.zooracle.model.sql.SQLArrayListContainer;
import com.zooracle.model.sql.SQLContainer;
import com.zooracle.model.sql.SQLCountContainer;
import com.zooracle.model.sql.SQLHashArrayContainer;
import com.zooracle.model.sql.SQLHashMapContainer;
import com.zooracle.model.sql.SQLIndividualContainer;
import com.zooracle.model.sql.SQLiteAnimalDBQueries;
import com.zooracle.model.sql.SQLiteStructure;
import com.zooracle.view.swing.Locale;

public class AnimalDatabaseManager
{
	public static String w = "WHERE ";
	public static String rw = "{WHERE}";
	public static String rt = "{TABLE}";
	public static String rc = "{COLUMNS}";
	public static String rv = "{VALUES}";
	private static SQLiteInterface sqliteInterface = SQLiteInterface.getInstance();

	public static AnimalDatabase loadDatabase(String fileName)
	{
		File file = new File(fileName);

		if (!file.exists())
			return null;
		
//		System.out.println("found file, connecting");

		if (SQLiteInterface.getInstance().testConnection(fileName))
		{

			AnimalDatabase database = null;

			// SQLArrayListContainer container = new SQLArrayListContainer();
			SQLHashArrayContainer container = new SQLHashArrayContainer();
			sqliteInterface.select(SQLiteAnimalDBQueries.getDBSettings, container);

			ArrayList<HashMap<String, Object>> hashArray = container.getHashArray();

			HashMap<String, Object> firstRow = hashArray.get(0);
			System.out.println(firstRow.get(SQLiteStructure.columnTitle) + " ; " + firstRow.get(SQLiteStructure.columnType) + " ; " + firstRow.get(SQLiteStructure.columnComment) + " " + firstRow.get(SQLiteStructure.columnImagePath));

			String title = "" + firstRow.get(SQLiteStructure.columnTitle);
			String type = "" + firstRow.get(SQLiteStructure.columnType);
			String comment = "" + firstRow.get(SQLiteStructure.columnComment);
			String imagePath = "" + firstRow.get(SQLiteStructure.columnImagePath);

			System.out.println("type:" + type);
			System.out.println("ToadDatabase type:" + ToadDatabase.type);

			if (type.equals(ToadDatabase.type))
			{
				database = new ToadDatabase(fileName, title, imagePath, comment);

				SQLHashArrayContainer individualContainer = new SQLHashArrayContainer();
				sqliteInterface.select(SQLiteAnimalDBQueries.getIndividuals, individualContainer);

				HashMap<String, Individual> individuals = new HashMap<String, Individual>();
				HashMap<Integer,MetaData> metaDataEntries = new HashMap<Integer, MetaData>();
				
				for (HashMap<String, Object> row : individualContainer.getHashArray())
				{
					int id = (Integer) check(row.get(SQLiteStructure.columnId), -1);

					String name = ((String) check(row.get(SQLiteStructure.columnName), null));
					int gender = (Integer) check(row.get(SQLiteStructure.columnGender), -1);
					String individualComment = ((String) check(row.get(SQLiteStructure.columnComment), ""));
					long individualValidFrom = SQLiteInterface.getTimestampFromDatetimeString((String) row.get(SQLiteStructure.columnValidFrom));
					long individualValidUntil = SQLiteInterface.getTimestampFromDatetimeString((String) row.get(SQLiteStructure.columnValidUntil));
					Individual individual = new Individual(id, name, gender, individualValidFrom, individualValidUntil, individualComment);
					individuals.put("" + id, individual);
				}

				SQLHashArrayContainer toadDataContainer = new SQLHashArrayContainer();
				sqliteInterface.select(SQLiteAnimalDBQueries.getToadData, toadDataContainer);

				SQLHashMapContainer imageSettingsContainer = new SQLHashMapContainer(SQLiteStructure.columnMetadataId);
				sqliteInterface.select(SQLiteAnimalDBQueries.getImageSettings, imageSettingsContainer);
				
				SQLHashArrayContainer colorSelectionContainer = new SQLHashArrayContainer();
				sqliteInterface.select(SQLiteAnimalDBQueries.getColorSelection, colorSelectionContainer);

				for (String key : imageSettingsContainer.getHashArray().keySet())
					System.out.println("imageSettingsContainer key:" + key);
				System.out.println(" ");
				for (HashMap<String, Object> map : colorSelectionContainer.getHashArray())
					System.out.println("colorSelectionContainer key:" + map.get("imagesettingsId"));
					// for (String key : map.keySet())

				// SQLHashMapContainer imageSettingsContainer = new
				// SQLHashMapContainer(SQLiteStructure.columnMetadataId);
				// sqliteInterface.select(SQLiteAnimalDBQueries.getImageSettings,
				// imageSettingsContainer);
				// SQLHashMapContainer colorSelectionContainer = new
				// SQLHashMapContainer(SQLiteStructure.columnImagesettingsId);
				// sqliteInterface.select(SQLiteAnimalDBQueries.getColorSelection,
				// colorSelectionContainer);

				System.err.println("- - - - - - - - -");
				System.err.println("- - - - - - - - -");
				System.err.println("- - - - - - - - -");
				for (HashMap<String, Object> row : toadDataContainer.getHashArray())
				{
					System.err.println("col id: " + row.get(SQLiteStructure.columnId));
					
					ToadData toadData = new ToadData((Integer) check(row.get(SQLiteStructure.columnId), ""));
					toadData.setIndividualId((Integer) check(row.get(SQLiteStructure.columnIndividualId), -1));
					toadData.setMetaDataId((Integer) check(row.get(SQLiteStructure.columnMetadataId), -1));
					
					toadData.setFileName((String) check(row.get(SQLiteStructure.columnFileName), null));
					toadData.setZooName((String) check(row.get(SQLiteStructure.columnZooName), null));
					toadData.setName((String) check(row.get(SQLiteStructure.columnAltName), ""));
					toadData.setComment((String) check(row.get(SQLiteStructure.columnComment), ""));
					toadData.setView((Integer) check(row.get(SQLiteStructure.columnView), -1));
					toadData.setValidFrom(SQLiteInterface.getTimestampFromDatetimeString((String) row.get(SQLiteStructure.columnValidFrom)));
					toadData.setValidUntil(SQLiteInterface.getTimestampFromDatetimeString((String) row.get(SQLiteStructure.columnValidUntil)));

					toadData.setGpsLat((Double) check(row.get(SQLiteStructure.columnGpsLat), 0));
					toadData.setGpsLon((Double) check(row.get(SQLiteStructure.columnGpsLon), 0));
					toadData.setSize1((Double) check(row.get(SQLiteStructure.columnSize1), -1));
					toadData.setSize2((Double) check(row.get(SQLiteStructure.columnSize2), -1));
					toadData.setWeight((Double) check(row.get(SQLiteStructure.columnWeight), -1));
					toadData.setAgeClass((Integer) check(row.get(SQLiteStructure.columnAgeClass), -1));
					
					toadData.setPopulation(""+(Integer) check(row.get(SQLiteStructure.columnPopulationId), null));
					
//					System.out.println(toadData.getName());
					
					if (toadData.getFileName()!=null)
						toadData.setFileName(imagePath + toadData.getFileName());
					if (toadData.getZooName()!=null)
						toadData.setZooName(imagePath + toadData.getZooName());
					
					System.out.println(toadData);

					// System.out.println("w:" +
					// row.get(SQLiteStructure.columnId));
					for (String key : imageSettingsContainer.getHashArray().keySet())
						System.out.println("key:" + key);
					
					System.out.println(String.valueOf(row.get(SQLiteStructure.columnMetadataId)));

					HashMap<String, Object> imageSettingsRow = imageSettingsContainer.getHashArray().get(String.valueOf(row.get(SQLiteStructure.columnMetadataId)));
					System.out.println("" + imageSettingsRow);
					ImageSettings imageSettings = new ImageSettings((Integer) imageSettingsRow.get(SQLiteStructure.columnId));

					System.out.println(imageSettings.getId() + "!!!!!!!!!!!");
					imageSettings.setBlurSize((Integer) check(imageSettingsRow.get(SQLiteStructure.columnView), -1));
					imageSettings.setZoom((Integer) check(imageSettingsRow.get(SQLiteStructure.columnZoom), -1));
					imageSettings.setAngle((Integer) check(imageSettingsRow.get(SQLiteStructure.columnAngle), -1));
					imageSettings.setPosX((Integer) check(imageSettingsRow.get(SQLiteStructure.columnPosX), -1));
					imageSettings.setPosY((Integer) check(imageSettingsRow.get(SQLiteStructure.columnPosY), -1));
					imageSettings.setImgOffsetX((Integer) check(imageSettingsRow.get(SQLiteStructure.columnImgOffsetX), -1));
					imageSettings.setImgOffsetY((Integer) check(imageSettingsRow.get(SQLiteStructure.columnImgOffsetY), -1));
					imageSettings.setContrast((Integer) check(imageSettingsRow.get(SQLiteStructure.columnContrast), -1));
					imageSettings.setBrightness((Integer) check(imageSettingsRow.get(SQLiteStructure.columnBrightness), -1));
					imageSettings.setCustomParam1((Integer) check(imageSettingsRow.get(SQLiteStructure.columnCustomParam1), -1));
					imageSettings.setCustomParam2((Integer) check(imageSettingsRow.get(SQLiteStructure.columnCustomParam2), -1));
					imageSettings.setCustomParam3((Integer) check(imageSettingsRow.get(SQLiteStructure.columnCustomParam3), -1));

					LinkedList<Integer> elementsToRemove = new LinkedList<Integer>();
					int i = 0;
					System.out.println("size of hasharray: " + colorSelectionContainer.getHashArray().size());
					for (HashMap<String, Object> colorSelectionHashMap : colorSelectionContainer.getHashArray())
					{
						String imageSettingsIdString = String.valueOf(imageSettingsRow.get(SQLiteStructure.columnId));
						String currentColorSelectionImageSettingsIdString = String.valueOf(colorSelectionHashMap.get(SQLiteStructure.columnImagesettingsId));
						System.out.println(i + ": \tc:" + currentColorSelectionImageSettingsIdString + "\ti:" + imageSettingsIdString);

						if (imageSettingsIdString.equals(currentColorSelectionImageSettingsIdString))
						{
							ColorRange colorRange = new ColorRange();

							colorRange.setHl((Double) check(colorSelectionHashMap.get(SQLiteStructure.columnHueLow), -1d));
							colorRange.setHh((Double) check(colorSelectionHashMap.get(SQLiteStructure.columnHueHigh), -1d));
							colorRange.setSl((Double) check(colorSelectionHashMap.get(SQLiteStructure.columnSatLow), -1d));
							colorRange.setSh((Double) check(colorSelectionHashMap.get(SQLiteStructure.columnSatHigh), -1d));
							colorRange.setVl((Double) check(colorSelectionHashMap.get(SQLiteStructure.columnValLow), -1d));
							colorRange.setVh((Double) check(colorSelectionHashMap.get(SQLiteStructure.columnValHigh), -1d));
							colorRange.setMode((Integer) check(colorSelectionHashMap.get(SQLiteStructure.columnMode), -1));
							colorRange.setFeather((Double) check(colorSelectionHashMap.get(SQLiteStructure.columnFeather), -1d));

							imageSettings.getColorRanges().add(colorRange);
							System.out.println("" + colorRange);
							// colorSelectionContainer.getHashArray().remove(colorSelectionHashMap);
							elementsToRemove.addFirst(new Integer(i));
						}
						i++;
					}

					for (int index : elementsToRemove)
						colorSelectionContainer.getHashArray().remove(index);

					toadData.setImageSettings(imageSettings);

					individuals.get("" + toadData.getIndividualId()).getMetaDataEntries().add(toadData);

					System.out.println("metaData count: " + individuals.get("" + toadData.getIndividualId()).getMetaDataEntries().size());

					// image settings
					// colorselections

					// select *
					// update *
					// insert *
					// remove *

					// imageeditor io -> insert on xml load

					// ToadData toadData = new ToadData((Integer)
					// row.get(SQLiteStructure.columnId));

//					System.out.println(toadData + "");

					// if (!new File(imagePath + column).exists())
					// {
					// System.err.println(Locale.messageImageFileNotFound + "("
					// + imagePath + column + ")");
					// return null;
					// }
					System.out.println("td id:" + toadData.getId()); 
					
					metaDataEntries.put(toadData.getId(), toadData);
				}
				database.setMetaDataEntries(metaDataEntries);
				database.setIndividuals(individuals);
				return database;
			}

			return null;
		}
		return null;
	}

	private static Object check(Object object, Object defaultValue)
	{
		return SQLiteInterface.check(object, defaultValue);
	}

	

	// -------  fertige allgemeine abfragen  --------
	
	

	public static boolean remove(String table, String idString, int id)
	{
		String deleteString = SQLiteAnimalDBQueries.defaultDeleteStatement;
		deleteString = deleteString.replace(rt, table);
		deleteString = deleteString.replace(rw, w + idString + " = " + id);
		
		System.out.println("string:\n" + deleteString);
		return sqliteInterface.execute(deleteString);
	}

	public static boolean insert(String table, HashMap<String, String> columnValues)
	{
		
		Iterator<Entry<String, String>> it = columnValues.entrySet().iterator();
		String columns = "";
		String values = "";
		
		while (it.hasNext())
		{
			Map.Entry<String,String> pair = (Map.Entry<String,String>) it.next();
			columns += pair.getKey() + ",";
			values += pair.getValue() + ",";
		}
		columns = columns.substring(0, columns.length()-1);
		values = values.substring(0, values.length()-1);
		
		String insertString = SQLiteAnimalDBQueries.defaultInsertStatement;
		insertString = insertString.replace(rt, table);
		insertString = insertString.replace(rc, "(" + columns + ")");
		insertString = insertString.replace(rv, "(" + values + ")");
		System.out.println(insertString);
		return sqliteInterface.execute(insertString);
	}
	
	public static boolean update(String table, HashMap<String, String> columnValues, String idString, int id)
	{
		if (countElementsById(table, idString, id)<1)
			return insert(table, columnValues);
		
		Iterator<Entry<String, String>> it = columnValues.entrySet().iterator();
		String columnValueString = "";
		while (it.hasNext())
		{
			Map.Entry<String,String> pair = (Map.Entry<String,String>) it.next();
			columnValueString += pair.getKey() + "=" + pair.getValue() + ",";
		}
		columnValueString = columnValueString.substring(0, columnValueString.length()-1);
		String updateString = SQLiteAnimalDBQueries.defaultUpdateStatement;
		updateString = updateString.replace(rt, table);
		updateString = updateString.replace(rv, columnValueString);
		updateString = updateString.replace(rw, w + idString + " = " + id);
		return sqliteInterface.execute(updateString);
	}

	private static int countElementsById(String table, String idString, int id)
	{
		String countString = SQLiteAnimalDBQueries.count;
		countString = countString.replace(rt, table);
		countString = countString.replace(rw, w + idString + "=" + id);
		SQLCountContainer countContainer = new SQLCountContainer();
		sqliteInterface.select(countString, countContainer);
		return countContainer.getCount();		
	}
	
	// ------------  end von fertigen allgemeinen abfragen  -----------
	
	
	//
	public static boolean removeColorSelection(int id)
	{
		return remove(SQLiteStructure.tableColorSelection, SQLiteStructure.columnId, id);
	}

	public static boolean removeImageSettings(int id)
	{
		return remove(SQLiteStructure.tableImageSettings, SQLiteStructure.columnId, id);
	}

	public static boolean removeIndividual(int id)
	{
		return remove(SQLiteStructure.tableIndividual, SQLiteStructure.columnId, id);
	}

	public static boolean removeToadData(int id)
	{
		return remove(SQLiteStructure.tableToadData, SQLiteStructure.columnId, id);
	}

	public static boolean removeMetaData(int id)
	{
		return remove(SQLiteStructure.tableMetaData, SQLiteStructure.columnId, id);
	}
	
	public static boolean removeModel(int id)
	{
		return remove(SQLiteStructure.tableModel, SQLiteStructure.columnId, id);
	}
	public static boolean removeRelKMeta(int id)
	{
		return remove(SQLiteStructure.tableRelKMeta, SQLiteStructure.columnId, id);
	}
	
	//
	
	public static int insertIndividual(Individual individual)
	{
		String id = individual.getId() + "";
		
		
		return -1;
	}
	
	public static int insertMetaData(MetaData metaData)
	{
		HashMap<String,String> cv = new HashMap<String, String>();
		if (metaData.getId() > -1)
			cv.put(SQLiteStructure.columnId, metaData.getId()+"");
//		cv.put(SQLiteStructure.columnMetadataId, metaData.getMetaDataId()+"");
		
		boolean sqlInsert = insert(SQLiteStructure.tableToadData, cv);
//		return getLastInsertedId();
		return -1;
	}

	public static int insertToadData(ToadData toadData)
	{
		
		HashMap<String,String> cv = new HashMap<String, String>();
		if (toadData.getId() > -1)
			cv.put(SQLiteStructure.columnId, toadData.getId()+"");
		cv.put(SQLiteStructure.columnMetadataId, toadData.getMetaDataId()+"");
		cv.put(SQLiteStructure.columnPopulationId, toadData.getSize1()+"");
		cv.put(SQLiteStructure.columnSize1, toadData.getSize1()+"");
		cv.put(SQLiteStructure.columnSize2, toadData.getSize2()+"");
		cv.put(SQLiteStructure.columnWeight, toadData.getWeight()+"");
		cv.put(SQLiteStructure.columnAgeClass, toadData.getAgeClass()+"");
		
		boolean sqlInsert = insert(SQLiteStructure.tableToadData, cv);
		if ((sqlInsert) && (toadData.getId() == -1))
			toadData.setId(getLastInsertedId(SQLiteStructure.columnId, SQLiteStructure.tableToadData));
			
		return toadData.getId();
		
	}

	public static int insertImageSettings(ImageSettings imageSettings)
	{
		return -1;
	}

	public static int insertColorRange(ColorRange colorRange)
	{
		return -1;
	}
	
	public static int getLastInsertedId(String id, String table)
	{
		SQLHashArrayContainer container = new SQLHashArrayContainer();
		sqliteInterface.select("SELECT MAX("+id+") AS LAST FROM " + table, container);
		ArrayList<HashMap<String, Object>> hashArray = container.getHashArray();
		System.out.println();
		if (hashArray.size()>0)
		{
			HashMap<String, Object> a = hashArray.get(0);
			if (a.size()>0)
			{
				for (Object b : a.values())
				{
					return Integer.valueOf(""+b);
				}
			}
		}
		
		return -1;
	}
	
	
	
	
	
	/*public static boolean insertModel(Model model)
	{
		return false;
	}
	
	public static boolean insertRelKMeta(RelKMeta relKMeta)
	{
		return false;
	}
	
	public static boolean insertColorSelection(ColorSelection colorSelection)
	{
		return false;
	}
	*/
	
	
	
	
	public static boolean updateIndividual(Individual individual)
	{
		return false;
	}	

	public static boolean updateMetaData(MetaData metaData)
	{
		return false;
	}

	public static boolean updateToadData(ToadData toadData)
	{
		return false;
	}

	public static boolean updateImageSettings(ImageSettings imageSettings)
	{
		return false;
	}

	public static boolean updateColorRange(ColorRange colorRange)
	{
		return false;
	}
	
	/*public static boolean updateColorSelection(ColorSelection colorSelection)
	{
		return false;
	}
	
	public static boolean updateModel(Model model)
	{
		return false;
	}
	
	public static boolean updateRelKMeta(RelKMeta relKMeta)
	{
		return false;
	}*/
	
	
	

	

}
