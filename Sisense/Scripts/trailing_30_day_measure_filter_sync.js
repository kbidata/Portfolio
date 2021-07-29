widget.on('refreshed', function(f,e) {

    //////////
        
    // Trailing 30 day timeframe - **Measure** filter
        
        // slice measure to get measure key - make sure the slice locations match properly first, include brackets
        var measureKey = widget.metadata.panels[0].items[0].jaql.formula.slice(21,32)

        // dash filter to sync from, grab this id from console
        var dash_filterid = "xxxxx-xxxx-xx"
        
        date = new Date();
        
    // if "Timeframe" selected
        if(widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last !== undefined) {
            if (widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last == undefined) {
            widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last = {"count": 1, "offset": 1}
            };
            if ((widget.metadata.panels[0].items[0].jaql.context[measureKey].level !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level 
                || (widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count == widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 1
                || widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count == widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 30
                || widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count == widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 4
                || widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count == date.getMonth() + 1 + 1 + (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count - 1) * 12) == false
                || widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.offset !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset)
                && (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "years" 
                    && widget.metadata.panels[0].items[0].jaql.context[measureKey].level == "months" 
                    && widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count == (date.getMonth() + 1 + 1 + (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count - 1) * 12)) == false 
                && (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "months" 
                    && widget.metadata.panels[0].items[0].jaql.context[measureKey].level == "months" 
                    && widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count == date.getMonth() + 1 + 1 + (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count - 1) * 12) == false) {
                
                // level
                widget.metadata.panels[0].items[0].jaql.context[measureKey].level = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level;
                
                // set days, weeks, months, years		
                if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "days") {
                    widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 30
                    widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.offset = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset 
                }
                if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "weeks") {
                    widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 4
                    widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.offset = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset 
                    widget.metadata.panels[0].items[0].jaql.context[measureKey].firstday = "mon";
                }	
                if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "months") {
                    widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count + 1
                    widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.offset = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset 
                }
                if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.level == "years") {
                    widget.metadata.panels[0].items[0].jaql.context[measureKey].level = "months"
                    widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.count = date.getMonth() + 1 + 1 + (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.count - 1) * 12
                    widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last.offset = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.last.offset * 12
                }
                // remove "to"/"from"
                try {delete widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.from;
                    delete widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.to;}
                catch {}
                widget.refresh();
            };
        }
        // if "Calendar" selected
        if (widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.from !== undefined) {
            var fromdate = new Date(widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.from);
            if (widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.from !== new Date(fromdate - 2592000000).toISOString().slice(0, 10)
            || widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.to !== widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.to) {
                widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.from = new Date(fromdate - 2592000000).toISOString().slice(0, 10);
                widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.to = widget.dashboard.filters.$$items.filter(item=>item.instanceid == dash_filterid)[0].jaql.filter.to
                //remove "last"
                try {delete widget.metadata.panels[0].items[0].jaql.context[measureKey].filter.last}
                catch {}
                widget.refresh()
            };
        }


    });