/**
 * Game Starter route '/'
 */


exports.ampIndex = function(req, res) {
	res.render('layout', {
		env: process.env.NODE_ENV || 'development',
		layout: false
	});
}
