-- Stored Procedure: UpdatePowerBIModel

-- Day Totals table for PowerBI

CREATE PROCEDURE UpdatePowerBIModel

AS

SET NOCOUNT ON
-- select transaction data into #a, edit transaction data to produce values for nulls
SELECT CASE WHEN siteid IS NULL then '0' ELSE siteid END as 'siteid',
	convert(date, dateich) AS 'date_received_at_ICH',
	CASE WHEN GI4Invoice IS NULL then 'Pending' ELSE GI4Invoice END as 'GI4Invoice'
	INTO #a
	from OHI_transactions
	ORDER BY date_received_at_ICH 

-- Calculate # of Inquiries | per day, site, invoice category | select into #b
SELECT siteid, date_received_at_ICH, gi4invoice, COUNT(gi4invoice) as total
INTO #b
from #a
group by siteid, Date_received_at_ICH, GI4Invoice
ORDER BY siteid, Date_received_at_ICH

-- Insert 'Total Inquiries' | Summarizing total inquiries | per day, site

INSERT INTO #b (
	siteid,
	date_received_at_ICH,
	GI4invoice,
	total)

SELECT siteid, date_received_at_ICH, 'Total Inquiries' as gi4invoice, SUM(total) as total
from #b
group by siteid, Date_received_at_ICH


-- Join each distinct site and each category to the date table
-- Left join to this table to create nulls
-- replace nulls with 0

SELECT DISTINCT gi4invoice
into #invoicetypes
FROM #b

SELECT DISTINCT siteid, a.GI4Invoice 
into #b1
FROM #b
CROSS JOIN #invoicetypes a

SELECT DISTINCT siteid, gi4invoice, d.datevalue as date_received_at_ICH
INTO #b2
FROM #b1 
CROSS JOIN DateTable d
ORDER BY d.datevalue, siteid, GI4Invoice 

SELECT b2.*, 
	CASE WHEN b.total IS NULL THEN 0 ELSE b.total END as "total"
INTO #b3
FROM #b2 b2
LEFT JOIN #b b on b.Date_received_at_ICH = b2.date_received_at_ICH AND b.GI4Invoice = b2.GI4Invoice AND b.siteid = b2.siteid
ORDER BY b2.date_received_at_ICH, siteid, GI4Invoice 

-- Create cumulative totals over gi4invoice categories, calculating 'total inquiries' separate from 'found/notfound/pending'

--1 add cumulative total column
ALTER TABLE #b3
ADD cumulativetotal int

--2 cumulative found/notfound/pending by site, date
SELECT siteid, date_received_at_ICH, gi4invoice, sum(total)
OVER (PARTITION BY siteid, gi4invoice ORDER BY date_received_at_ICH rows unbounded preceding) AS cumulativetotal
INTO #c
from #b3
ORDER BY siteid, date_received_at_ICH

--3 Update into "cumulativetotals" column using multi-column join
UPDATE #b3
SET #b3.cumulativetotal = c.cumulativetotal
FROM #b3 b
JOIN #c c on c.siteid=b.siteid and c.date_received_at_ICH = b.date_received_at_ICH and c.gi4invoice = b.gi4invoice

--Create DB table

-- TRUNCATE date totals table
TRUNCATE TABLE test_invoice_OHI_date_totals

--Insert into table
INSERT INTO test_invoice_OHI_date_totals (
	siteid,
	gi4invoice,
	date_received_at_ICH,
	total,
	cumulativetotal
	)
SELECT * FROM #b3

--Update master site list

TRUNCATE TABLE OHI_transactions_mstr_site_list
INSERT INTO OHI_transactions_mstr_site_list (CPAC, VISN, Station_Name, Station_Number)

SELECT DISTINCT column2 as 'CPAC', column3 as VISN, location, siteid
from OHI_TRANSACTIONS
WHERE siteid IS NOT NULL
ORDER BY location

-- Note: North Chicago, IL has a null site ID and cannot be included in date totals unless assigned a siteid

drop table #a, #b, #b2, #b3, #c, #invoicetypes, #b1

GO

--------------