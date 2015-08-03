var PythonShell = require('python-shell')
// var dir = require('node-dir')

module.exports = {
	buildAliases: function() {
		PythonShell.defaultOptions = { scriptPath: this.configDir + '/py' };
		var pyshell = new PythonShell('getAppFilesPaths.py', {
			mode: 'text',
			args: [this.configDir]
		});
		pyshell.send();
		var that = this;
		pyshell.on('message', function (message) {
			obj = JSON.parse(message);
			obj['GlobalData'] = './www/data/data'
			that.aliases = obj
			console.log(that.aliases)
			pyshell.end()
		});

		// TODO Remove python and make it in plein Node

		// var jsPath = 'src/js'
		// var dataPath = 'data'

		// var jsFiles = fs.readdirSync(this.configDir + '/' + jsPath)
		// // console.log(this.configDir, 'src/js')
		// console.log(jsFiles)

		// dir.files(this.configDir + '/' + jsPath, function(err, files) {
		//     if (err) throw err;
		//     console.log(files);
		// });

	},
	aliases: "",
    configDir: "",
    verbose: false
}