// Create an empty dialog window near the upper left of the screen
var dlg = new Window( "dialog", "Alert Box Builder" );
dlg.frameLocation = [ 100, 100 ];
dlg.bounds = { x: 100, y: 100, width: 380, height: 390 };
dlg.btnPnl = dlg.add('panel', undefined, 'Build it');
dlg.btnPnl.testBtn = dlg.btnPnl.add('button', undefined, 'Test');


dlg.show();