const electron = require('electron');
const url = require('url');
const path = require('path');

var Web3 = require('web3');
var web3 = new Web3();
//npm install web3




// pull something out of electron
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let sellerWindow;

// listen for the app to be ready
app.on('ready', function(){
	//Create New window
	mainWindow = new BrowserWindow({});
	//Load the html file into the window
	//passing file://dirname/mainWindow.html into the url
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol:'file:',
		slashes: true
	}));

	//close the whole app if the mainWindow is closed
	mainWindow.on('closed', function(){
		app.quit();
	});

	//Build menu
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	//insert menu
	Menu.setApplicationMenu(mainMenu);
});

//Handle Seller Window
function createSellerWindow(){
	sellerWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Seller Info'
	});

	sellerWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'sellerInfo.html'),
		protocol: 'file',
		slashes: true
	}));

	//Garbage Collection
	sellerWindow.on('close', function(){
		sellerWindow = null;
	});
}

//catch msg
ipcMain.on('sellerAddress', function(e, item){
	//console.log(item);
	mainWindow.webContents.send('sellerAddress', item);
});

ipcMain.on('secretMsg', function(e, item){
	//console.log(item);
	mainWindow.webContents.send('secretMsg', item);
	sellerWindow.close();
});

//create menu template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu:[
			{
				label: 'Seller',
				accelerator: process.platform == 'darwin' ? 'Command+S' :
					'Ctrl+S',
				click(){
					createSellerWindow();
				}
			},
			{
				label: 'Buyer'
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' :
					'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	},
	{
        label: "Edit",
        submenu: [
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
];


// If mac, add empty object to menu
if(process.platform == 'darwin'){
	mainMenuTemplate.unshift({});
}


// dev tools
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Dev Tools',
		submenu: [
			{
				label: 'Toggle Dev Tools',
				accelerator: process.platform == 'darwin' ? 'Command+I' :
					'Ctrl+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}


//buyer address:
//0x4eC66e6433724dc8648F66A84780DFC42af4c349

//seller address:
//0xb9a5f090af53004d9c8183e6cbc8acaca5f297f0
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://45.75.72.112:8545"));
}

const buyer_keystore = "{\"address\":\"4ec66e6433724dc8648f66a84780dfc42af4c349\",\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"a0c695d3e9716b673609fe78de608766a2a9a9ef045c5706d2b35c472dcf923a\",\"cipherparams\":{\"iv\":\"97c199222bec391935335bd62d352d9a\"},\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"n\":262144,\"p\":1,\"r\":8,\"salt\":\"ad0eefab5c3eba0b43d5ade013fe9ec7c366a210ead7f972f91ad8a4e07fe71b\"},\"mac\":\"34d02ca7f20df290706f01e76d5e88af9cdc1947b15d02e19165c919b8cb71cf\"},\"id\":\"2494e694-93e4-4e95-8896-3904b50bdb22\",\"version\":3}";

const buyer_account = web3.eth.accounts.decrypt(buyer_keystore, 'SyFs86521216');

const seller_keystore = "{\"address\":\"b9a5f090af53004d9c8183e6cbc8acaca5f297f0\",\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"13e56bda9d1d9b931f441060a95b066567fbfb143d55bb4537e9650ec1f37a27\",\"cipherparams\":{\"iv\":\"d60e9ec023b306f0993c3eda3899b9a6\"},\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"n\":262144,\"p\":1,\"r\":8,\"salt\":\"ce6fefd2dc485e0b6d0f5243f5d80eb9213906cf303b7e14b01e07d140a5e974\"},\"mac\":\"fd4e9331182949adfc0fc6f5d01d58eef42db1c3ced1ca67a03aca1aba0aa796\"},\"id\":\"fc948389-14d3-42cb-a923-c9b8d7884384\",\"version\":3}";

const seller_account = web3.eth.accounts.decrypt(seller_keystore, 'SyFs86521216');



