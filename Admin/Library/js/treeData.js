var treeData = [{
	id: 1, 
	text: '节点一',
	children: [
		{id: 2, text: '子节点1-1',icon: 'none'},
		{id: 3, text: '子节点1-2',icon: 'none', state: {selected: true}}
	]
},{
	id: 4, 
	text: '节点二',
	children: [
		{id: 5, text: '子节点2-1',icon: 'none'},
		{id: 6, text: '子节点2-2',icon: 'none'}
	]
},{
	id: 7,
	text: '节点三',
	children: [{
		id: 8,
		text: '新闻',
		children: [
			{id: 9, text: '子节点3-1',icon: 'none'},
			{id: 10, text: '子节点3-2',icon: 'none'}
		]
	}]
}]