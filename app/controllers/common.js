'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	async = require('async'),
	uid = require('uid'),
	fs = require('fs'),
	users = require('../models/user'),
	User = mongoose.model('User'),
	nodemailer = require('nodemailer'),
	smtpTransport = require('nodemailer-smtp-transport'),
	hbs = require('hbs'),
	wit = require('node-wit'),
	request = require('request'),
	userCtr = require('./users'),
	webshot = require('webshot'),
	csv = require('csvtojson'),
	handlebars = require('handlebars');


// --
// Get Common Single Data

exports.getSingle = function(req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);

	commonModel.findById(req.body._id, function(err, result) {
		
		if(err || !result) {
			res.json({
				status: false,
				data: []
			});
			return;
		}


		res.json({
			status: true,
			data: result
		});
	});
};

// --
// Get Common All Data

exports.getData = function(req, res) {

	if (!req.body.model) {
		res.json([]);
		return;
	}

	if (!(req.user && req.user._id)) {
		res.json([]);
		return;
	}

	//
	var commonModel = mongoose.model(req.body.model);




	//
	commonModel.find().exec(function(err, responseData) {

		if (err) {
			res.json({
				status: false,
				data: []
			});
			return;
		}

		res.json({
			status: true,
			data: responseData
		});
		
	});
};


exports.getCondition = function(req, res) {
	if (!req.body.model) {
		res.json([]);
		return;
	}

	if (!(req.user && req.user._id)) {
		res.json([]);
		return;
	}


	var commonModel = mongoose.model(req.body.model);


	
	commonModel.find(req.body.condition).exec(function(err, responseData) {

		if (err) {
			res.json({
				status: false,
				data: []
			});
			return;
		}

		res.json({
			status: true,
			data: responseData
		});
	});

}

// --
// Common file upload method

exports.commonUploadFile = function(req, res) {

	var fileObject = req.files.file,
		destinationpath = filePath[req.params.key];

	// --

	var extArray = fileObject.originalFilename.split('.');
	var ext = extArray[extArray.length - 1];
	var fileName = uid(10) + '.' + ext;

	// setTimeout(function(){
	fs.readFile(fileObject.path, function(err, data) {

		if (err) {
			res.send(err);
			return;
		}

		var newPath = destinationpath + fileName;

		fs.writeFile(newPath, data, function(err) {

			if (err) {
				res.send(err);
				return;
			}


			res.send({
				original: req.files.file.name,
				image: fileName,
				status: true
			});


		});
	});
	// },5000);

};

// --
// Add Common All Data

exports.postAddData = function(req, res) {

	
	if (!req.body.model) {
		res.json([]);
		return;
	}

	
	var commonModel = mongoose.model(req.body.model);

	var tmpModal = req.body.model;
	req.body.model = '';










	// #Filter stuff
	// #Permission logic
	// #remove extra fields

	// Save data in main collection
	if (!req.body.isChildInsert) {


		var insertP = function() {

			var commonFormData = new commonModel(req.body);

			commonFormData.save(function(err, result) {

				if (err) {
					res.json({
						status: false
					});
					return;
				}

				res.json({
					status: true,
					result: result
				});
			});
		}

		insertP();

	}

	// --
	// @param isChildInsert = true
	// @param entityId
	// @param entityKey

	if (req.body.isChildInsert) {
		// define temp vars so we could empty value of
		// body.* extra action vars
		var entityId = req.body.entityId,
			entityKey = req.body.entityKey,
			pushData = {};

		// assign default _id mongoObj
		req.body._id = mongoose.Types.ObjectId(uid(12));

		// clear data which passed for action purpose
		delete req.body.entityId;
		delete req.body.entityKey;

		var finalProcess = function() {


			// --
			// Insert new child

			commonModel.findOne({
				_id: entityId
			}, function(err, data) {
				if (data) {

					data[entityKey].push(req.body);

					data.save(function(err, data) {

						if (err) {
							res.json({
								status: false,
								err: err
							});
						}
						// --

						res.json({
							status: true,
							data: pushData
						});
					});
				} else {
					res.json({
						status: false,
						err: err
					});
				}
			});
		};

		finalProcess();
	}
}

// --
// Delete Common All Data

exports.getDeleteData = function(req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}

	var commonModel = mongoose.model(req.body.model);


	// Delete common Data
	commonModel.findOne({
		_id: req.body._id
	}).remove(function(err, result) {

		if (err) {
			res.json({
				status: false,
				data: []
			});
			return;
		}

		res.json({
			status: true,
			data: req.body._id
		});
		return;
	});
};


// --
// Post Update Data
//
exports.getEditData = function(req, res) {

	if (!req.body.model || !req.body._id) {
		res.json([]);
		return;
	}


	var commonModel = mongoose.model(req.body.model);

	// --
	// Update common Data
	var _id = req.body._id;
	delete req.body._id;







	var updateP = function() {

		commonModel.update({
			'_id': _id
		}, req.body, {
			multi: true
		}, function(err, result) {

			if (err) {
				res.json({
					status: false,
					data: err
				});
				return;
			}



			// --

			res.json({
				status: true,
				data: req.body
			});

			delete req.body._id;

		});
	};

	updateP();
	
};


exports.orderChange = function(req, res) {

	var orderChangeCommanModel = mongoose.model(req.body.model);

	var updateOrderChanging = function(id, order) {
		orderChangeCommanModel.update({
			_id: id
		}, {
			order: order
		}).exec(function() {});
	}

	if (req.body.order && req.body.order.length) {
		for (var tyuRow in req.body.order) {
			updateOrderChanging(req.body.order[tyuRow]._id, req.body.order[tyuRow].order);
		}
	}

	res.json({
		status: true
	});
}








