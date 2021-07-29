// widget filter sync script

widget.on('refreshed', function(f,e) {
	
	// dashboard filter to sync from, grab instanceid from developer console
	var dash_filterid = "xxxxx-xxxx-xx"
		
		// Level
		if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last === undefined == false) {
	
			if (widget.metadata.panels[4].items[0].jaql.filter.last === undefined) {
				widget.metadata.panels[4].items[0].jaql.level = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level
				widget.metadata.panels[4].items[0].jaql.filter = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter
				widget.refresh();
				}
			if (widget.metadata.panels[4].items[0].jaql.level !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level || 	
				widget.metadata.panels[4].items[0].jaql.filter.last.count !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count ||
				widget.metadata.panels[4].items[0].jaql.filter.last.offset !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset) {
					widget.metadata.panels[4].items[0].jaql.level = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level;
					widget.metadata.panels[4].items[0].jaql.filter = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter;
				widget.refresh();
				};
			}
					
		// Calendar
		if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.from === undefined == false) {
			if (widget.metadata.panels[4].items[0].jaql.filter.from === undefined) {
				widget.metadata.panels[4].items[0].jaql.filter = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter
				widget.refresh();
			}
			if (widget.metadata.panels[4].items[0].jaql.filter.from !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.from
				|| widget.metadata.panels[4].items[0].jaql.filter.to !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.to) {
			widget.metadata.panels[4].items[0].jaql.filter = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter
			widget.refresh()
			};
		}	
});