Ext.define('PVE.qemu.SnapshotTree', {
    extend: 'Ext.tree.Panel',
    alias: ['widget.pveQemuSnapshotTree'],

    reload: function() {
        var me = this;

	PVE.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/qemu/' + me.vmid + '/snapshot',
	    waitMsgTarget: me,
	    method: 'GET',
	    failure: function(response, opts) {
		PVE.Utils.setErrorMask(me, response.htmlStatus);
	    },
	    success: function(response, opts) {

		var idhash = {};
		var root = { name: '__root', expanded: true, children: [] };
		Ext.Array.each(response.result.data, function(item) {
		    item.leaf = true;
		    item.children = [];
		    if (item.name === '__current') {
			item.iconCls = 'x-tree-node-now';
		    } else {
			item.iconCls = 'x-tree-node-snapshot';
		    }
		    idhash[item.name] = item;
		});

		Ext.Array.each(response.result.data, function(item) {
		    if (item.parent && idhash[item.parent]) {
			var parent_item = idhash[item.parent];
			parent_item.children.push(item);
			parent_item.leaf = false;
			parent_item.expanded = true;
		    } else {
			root.children.push(item);
		    }
		});

		me.setRootNode(root);
	    }
	});
    },

    initComponent: function() {
        var me = this;

	me.nodename = me.pveSelNode.data.node;
	if (!me.nodename) { 
	    throw "no node name specified";
	}

	me.vmid = me.pveSelNode.data.vmid;
	if (!me.vmid) {
	    throw "no VM ID specified";
	}

	var sm = Ext.create('Ext.selection.RowModel', {});

	var valid_snapshot = function(record) {
	    return record && record.data && record.data.name &&
		record.data.name !== '__current';
	};

	var run_editor = function() {
	    var rec = sm.getSelection()[0];
	    if (valid_snapshot(rec)) {
		var win = Ext.create('PVE.window.Snapshot', { 
		    snapname: rec.data.name,
		    snaptime: rec.data.snaptime,
		    description: rec.data.description,
		    nodename: me.nodename,
		    vmid: me.vmid
		});
		win.show();
		me.mon(win, 'close', me.reload, me);
	    }
	};

	var editBtn = new PVE.button.Button({
	    text: gettext('Edit'),
	    disabled: true,
	    selModel: sm,
	    enableFn: valid_snapshot,
	    handler: run_editor
	});

	var rollbackBtn = new PVE.button.Button({
	    text: gettext('Rollback'),
	    disabled: true,
	    selModel: sm,
	    enableFn: valid_snapshot,
	    handler: function(btn, event) {
		var rec = sm.getSelection()[0];
		if (!rec) {
		    return;
		}
		var snapname = rec.data.name;

		PVE.Utils.API2Request({
		    url: '/nodes/' + me.nodename + '/qemu/' + me.vmid + '/snapshot/' + snapname + '/rollback',
		    method: 'POST',
		    waitMsgTarget: me,
		    callback: function() {
			me.reload();
		    },
		    failure: function (response, opts) {
			Ext.Msg.alert(gettext('Error'), response.htmlStatus);
		    }
		});
	    }
	});

	var removeBtn = new PVE.button.Button({
	    text: gettext('Remove'),
	    disabled: true,
	    selModel: sm,
	    confirmMsg: gettext('Are you sure you want to remove this entry'),
	    enableFn: valid_snapshot,
	    handler: function(btn, event) {
		var rec = sm.getSelection()[0];
		if (!rec) {
		    return;
		}
		var snapname = rec.data.name;

		PVE.Utils.API2Request({
		    url: '/nodes/' + me.nodename + '/qemu/' + me.vmid + '/snapshot/' + snapname,
		    method: 'DELETE',
		    waitMsgTarget: me,
		    callback: function() {
			me.reload();
		    },
		    failure: function (response, opts) {
			Ext.Msg.alert(gettext('Error'), response.htmlStatus);
		    }
		});
	    }
	});

	var snapshotBtn = Ext.create('Ext.Button', { 
	    text: gettext('Take Snapshot'),
	    handler: function() {
		var win = Ext.create('PVE.window.Snapshot', { 
		    nodename: me.nodename,
		    vmid: me.vmid
		});
		win.show();
	    }
	});

	Ext.apply(me, {
	    layout: 'fit',
	    rootVisible: false,
	    animate: false,
	    selModel: sm,
	    tbar: [ snapshotBtn, rollbackBtn, removeBtn, editBtn ],
	    fields: [ 
		'name', 'description', 
		{ name: 'snaptime', type: 'date', dateFormat: 'timestamp' }
	    ],
	    columns: [
		{
		    xtype: 'treecolumn',
		    text: gettext('Name'),
		    dataIndex: 'name',
		    width: 200,
		    renderer: function(value, metaData, record) {
			if (value === '__current') {
			    return "NOW";
			} else {
			    return value;
			}
		    }
		},
		{
		    xtype: 'datecolumn',
		    text: gettext('Date'),
		    dataIndex: 'snaptime',
		    format: 'Y-m-d H:i:s',
		    width: 120
		},
		{ 
		    text: gettext('Description'),
		    dataIndex: 'description',
		    flex: 1,
		    renderer: function(value, metaData, record) {
			if (record.data.name === '__current') {
			    return gettext("You are here!");
			} else {
			    return value;
			}
		    }
		}
	    ],
	    columnLines: true, // will work in 4.1?
	    listeners: {
		show: me.reload,
		itemdblclick: run_editor
	    }
	});

	me.callParent();
    }
});

