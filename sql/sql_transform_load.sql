CREATE PROCEDURE ImportTransactionSinkData

AS

-- Stored Procedure: ImportTransactionSinkData

-- Transform script for incoming OHI transactions
-- Takes raw sinked transaction data from temp1, transforms it, and inserts new transactions into OHI_transactions

-- Converting string nulls into real nulls

SET NOCOUNT ON

SELECT column1,
	column2,
	column3,
	CASE WHEN column4 = 'NULL' THEN NULL ELSE column4 END AS column4,
	column5,
	column6,
	column7,
	column8,
	column9,
	column10,
	column11,
	column12,
	column13,
	column14,
	column15,
	CASE WHEN column16 = 'NULL' THEN NULL ELSE column16 END AS column16,
	CASE WHEN column17 = 'NULL' THEN NULL ELSE column17 END AS column17,
	column18,
	column19,
	column20,
	column21,
	column22,
	column23,
	column24,
	column25,
	CASE WHEN column14 = 'Coverage has not yet been found' THEN 'Pending' 
		WHEN column14 = 'No coverage was found' THEN 'Not Found'
		when column14 = 'Coverage was found' THEN 'Found'
		END AS gi4invoice 
INTO #nullsout
FROM test_invoice_OHI_temp1

-- type conversion

SELECT CONVERT(int, column1) column1,
	CONVERT(varchar(50), column2) column2,
	CONVERT(int, column3) column3,
	CONVERT(int, column4) siteid,
	TRIM('"' FROM CONVERT(varchar(50),column5)) "location",
	CONVERT(int, column6) column6,
	CONVERT(int, column7) column7,
	CONVERT(int, column8) column8,
	CONVERT(int, column9) column9,
	convert(datetime, column10) column10,
	convert(int, column11) column11,
	convert(int, column12) column12,
	CONVERT(varchar(50), column13) column13,
	CONVERT(varchar(50), column14) "status",
	CONVERT(int, column15) column15,
	CONVERT(int, column16) column16,
	CONVERT(int, column17) column17,
	column18,
	CONVERT(int, column19) column19,
	CONVERT(int, column20) "trn",
	CONVERT(datetime, column21) "dateich",
	convert(datetime, column22) column22,
	convert(varchar(50), column23) column23,
	convert(datetime, column24) column24,
	convert(varchar(50), column25) column25,
	gi4invoice
INTO #typed
FROM #nullsout

-- 2.) Find entries that are *not* in table yet based on matching trn *and* dateICH

SELECT DISTINCT a.* 
INTO #newtransactions
FROM #typed a
LEFT JOIN OHI_transactions b on a.trn = b.trn AND a.dateich = b.dateich
WHERE (b.trn IS NULL OR b.dateich IS NULL)
ORDER BY dateICH

-- 3.) Insert those into transactions table

INSERT INTO OHI_transactions (column1,
	column2,
	column3,
	siteid,
	"location",
	column6,
	column7,
	column8,
	column9,
	column10,
	column11,
	column12,
	column13,
	"status",
	column15,
	column16,
	column17,
	column18,
	column19,
	trn,
	dateich,
	column22,
	column23,
	column24,
	column25,
	gi4invoice
	)

SELECT * FROM #newtransactions 

DROP TABLE #nullsout, #newtransactions, #typed

TRUNCATE TABLE test_invoice_OHI_temp1

GO