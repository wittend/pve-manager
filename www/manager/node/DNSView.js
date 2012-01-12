Ext.define('PVE.node.DNSView', {
    extend: 'PVE.grid.ObjectGrid',
    alias: ['widget.pveNodeDNSView'],

    initComponent : function() {
	var me = this;

	var nodename = me.pveSelNode.data.node;
	if (!nodename) {
	    throw "no node name specified";
	}

	var run_editor = function() {
	    var win = Ext.create('PVE.node.DNSEdit', { 
		pveSelNode: me.pveSelNode
	    });
	    win.show();
	};

	Ext.applyIf(me, {
	    url: "/api2/json/nodes/" + nodename + "/dns",
	    cwidth1: 130,
	    interval: 1000,
	    rows: {
		search: { header: 'Search domain', required: true },
		dns1: { header: 'First DNS server', required: true },
		dns2: { header: 'Second DNS server' },
		dns3: { header: 'Third DNS server' }
	    },
	    tbar: [ 
		{
		    text: gettext("Edit"),
		    handler: run_editor
		}
	    ],
	    listeners: {
		itemdblclick: run_editor
	    }
	});

	me.callParent();

	me.on('show', me.rstore.startUpdate);
	me.on('hide', me.rstore.stopUpdate);
	me.on('destroy', me.rstore.stopUpdate);	
    }
});
