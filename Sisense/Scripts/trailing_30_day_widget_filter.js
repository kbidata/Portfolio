// Trailing 30 day timeframe - widget filter

widget.on('refreshed', function(f,e) {

// dashboard filter to sync from, grab instanceid from developer console
dash_filterid = "xxxxx-xxxx-xx"
//

date = new Date();
	// if "Timeframe" selected
	if(widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last !== undefined) {
		if (widget.metadata.panels[4].items[0].jaql.filter.last == undefined) {
		widget.metadata.panels[4].items[0].jaql.filter.last = {"count": 1, "offset": 1}
		};
		if ((widget.metadata.panels[4].items[0].jaql.level !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level 
			|| (widget.metadata.panels[4].items[0].jaql.filter.last.count == widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 1
			|| widget.metadata.panels[4].items[0].jaql.filter.last.count == widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 30
			|| widget.metadata.panels[4].items[0].jaql.filter.last.count == widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 4
			|| widget.metadata.panels[4].items[0].jaql.filter.last.count == date.getMonth() + 1 + 1 + (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count - 1) * 12) == false
			|| widget.metadata.panels[4].items[0].jaql.filter.last.offset !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset)
			&& (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "years" 
				&& widget.metadata.panels[4].items[0].jaql.level == "months" 
				&& widget.metadata.panels[4].items[0].jaql.filter.last.count == (date.getMonth() + 1 + 1 + (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count - 1) * 12)) == false 
			&& (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "months" 
				&& widget.metadata.panels[4].items[0].jaql.level == "months" 
				&& widget.metadata.panels[4].items[0].jaql.filter.last.count == date.getMonth() + 1 + 1 + (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count - 1) * 12) == false) {
			
			// level
			widget.metadata.panels[4].items[0].jaql.level = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level;
			
			// set days, weeks, months, years		
			if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "days") {
				widget.metadata.panels[4].items[0].jaql.filter.last.count = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 30
				widget.metadata.panels[4].items[0].jaql.filter.last.offset = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset 
			}
			if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "weeks") {
				widget.metadata.panels[4].items[0].jaql.filter.last.count = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 4
				widget.metadata.panels[4].items[0].jaql.filter.last.offset = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset 
			}	
			if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "months") {
				widget.metadata.panels[4].items[0].jaql.filter.last.count = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 1
				widget.metadata.panels[4].items[0].jaql.filter.last.offset = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset 
			}
			if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "years") {
				widget.metadata.panels[4].items[0].jaql.level = "months"
				widget.metadata.panels[4].items[0].jaql.filter.last.count = date.getMonth() + 1 + 1 + (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count - 1) * 12
				widget.metadata.panels[4].items[0].jaql.filter.last.offset = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset * 12
			}
			// remove "to"/"from"
			try {delete widget.metadata.panels[4].items[0].jaql.filter.from;
				delete widget.metadata.panels[4].items[0].jaql.filter.to;}
			catch {}
			widget.refresh();
		};
	}
	// if "Calendar" selected
	if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.from !== undefined) {
		var fromdate = new Date(widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.from);
		if (widget.metadata.panels[4].items[0].jaql.filter.from !== new Date(fromdate - 2592000000).toISOString().slice(0, 10)
		|| widget.metadata.panels[4].items[0].jaql.filter.to !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.to) {
			widget.metadata.panels[4].items[0].jaql.filter.from = new Date(fromdate - 2592000000).toISOString().slice(0, 10);
			widget.metadata.panels[4].items[0].jaql.filter.to = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.to
			//remove "last"
			try {delete widget.metadata.panels[4].items[0].jaql.filter.last}
			catch {}
			widget.refresh()
		};
	}
});

