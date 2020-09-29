import pyodbc
import os

# see if new data file - "try"
# if no data then end script
if os.path.isfile(fname):

    # bcp tool - run command for script

    os.system("bcp test.dbo.test_invoice_OHI_temp1 in " + "\"C:/Users/Shaun/Desktop/Projects/Clients/xxxxx/Data Sources/For Azure/FeedbackDump - bcp import/demoimport.txt\"" + " -S xxxxxxxxxx -U xxxxxxxx -P xxxxxxx -k -c -t \\t")

    # connect to database
    server = 'xxxxxxxx'
    database = 'test'
    username = 'shaun.kahler'
    password = 'xxxxxxx'
    driver= '{ODBC Driver 17 for SQL Server}'
    cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)

    # Transform, Load Data, Update Dashboard Model
    cursor = cnxn.cursor()
    cursor.execute("TRUNCATE TABLE test.dbo.test_invoice_OHI_temp1")
    cnxn.commit()
    cursor.execute("EXEC ImportTransactionSinkData")
    cnxn.commit()
    cursor.execute("EXEC UpdatePowerBIModel")
    cnxn.commit()

    # Move loaded data file into Archive Folder
    os.rename()
