// Measure filter sync script

widget.on('refreshed', function(f,e) {
    
    // slice measure to get measure key - make sure the slice locations match properly first, include brackets
    var measureKey = widget.metadata.panels[0].items[0].jaql.formula.slice(56,67)

    // dashboard filter to sync from, grab this id from developer console
    var dash_filterid = "xxxxx-xxxx-xx"
		
		// Level
		if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last !== undefined) {
			if (widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last == undefined) {
				widget.metadata.panels[0].items[0].jaql.context[measureKey].level = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level
				widget.metadata.panels[0].items[0].jaql.context[measureKey].filter = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter
				if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "weeks") {
					widget.metadata.panels[0].items[0].jaql.context[measureKey].firstday = "mon";	
				}
				else {
					try{delete widget.metadata.panels[0].items[0].jaql.context[measureKey].firstday}
					catch{}
				};	
				widget.refresh();
			}
			if (widget.metadata.panels[0].items[0].jaql.context[measureKey].level !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level || 	
				widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count ||
				widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.offset !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset) {
					widget.metadata.panels[0].items[0].jaql.context[measureKey].level = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level;
					widget.metadata.panels[0].items[0].jaql.context[measureKey].filter = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter;
				if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "weeks") {
					widget.metadata.panels[0].items[0].jaql.context[measureKey].firstday = "mon";	
				}
				else {
					try{delete widget.metadata.panels[0].items[0].jaql.context[measureKey].firstday}
					catch{}
				};
				widget.refresh();
			};
		};		
		// Calendar
		if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.from !== undefined) {
			if (widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.from == undefined) {
                widget.metadata.panels[0].items[0].jaql.context[measureKey].filter = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter
                try {delete widget.metadata.panels[0].items[0].jaql.context[measureKey].level}
				catch {};
				widget.refresh()
            }
			if (widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.from !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.from
				|| widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.to !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.to) {
			    widget.metadata.panels[0].items[0].jaql.context[measureKey].filter = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter
				try {delete widget.metadata.panels[0].items[0].jaql.context[measureKey].level}
				catch {};
			    widget.refresh()
			};
		}	
});