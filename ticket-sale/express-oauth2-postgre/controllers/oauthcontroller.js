const bcrypt = require('bcrypt-nodejs');
const OAuthTokenModel = require('../models').OAuthTokens;
const OAuthClientsModel = require('../models').OAuthClients;
const OAuthUsersModel = require('../models').OAuthUsers;

const ticketOrderModel = require('../models').ticketOrder;

module.exports.getAccessToken = function (bearerToken) {
	return OAuthTokenModel.findOne(
			{ 
				where: {
				accessToken: bearerToken
			},
			include: [
			{
				model: OAuthClientsModel,
				as: 'client'
			},
			{
				model: OAuthUsersModel,
				as: 'user'
			}	
			]
			}
		).then((token) => {
			const data = new Object();
			for (const prop in token.get()) data[prop] = token[prop];
			data.client = data.client.get();
			data.user = data.user.get();
			return data;	
		}).catch((error) => console.error(error));
}

module.exports.getClient = function(clientId, clientSecret) {
	return OAuthClientsModel.findOne(
	{ 
		where: {
			clientId: clientId,
			clientSecret: clientSecret
		},
		raw: true
	}
	);
};

module.exports.getRefreshToken = function (refreshToken) {
	return OAuthTokenModel.findOne(
	{
		where: {
			refreshToken: refreshToken
		},
		include: [
			{
				model: OAuthClientModel,
				as: 'client'
			},
			{
				model: OAuthUsersModel,
				as: 'user'
			}	
		]
	}
	).then((token) => {
			const data = new Object();
			for (const prop in token.get()) data[prop] = token[prop];
			data.client = data.client.get();
			data.user = data.user.get();
			return data;	
	}).catch((error) => console.error(error));
};

module.exports.getUser = function (username, password) {
	return OAuthUsersModel.findOne(
	{
		where: {
			username: username
		}
	}
	).then((user) => {
		// console.log(password);
		// console.log(user.get().password);

		// const isMatch = bcrypt.compareSync(password, user.get().password);
/*		if (user.get().verified==false) {
			console.log('The user not verified');
		} else {
		}*/	
			const isMatch = password == user.get().password;
			if (isMatch) {
				return user.get();			
			} else {
				console.log('Password not match');
			}

	})
}

module.exports.saveToken = function (token, client, user) {
	return OAuthTokenModel.create(
	{
		accessToken:token.accessToken,
		accessTokenExpiresAt: token.accessTokenExpiresAt,
		clientId: client.id,
		refreshToken: token.refreshToken,
		refreshTokenExpiresAt: token.refreshTokenExpiresAt,
		userId: user.id
	}
	).then((token) => {
		const data = new Object();
		for (const prop in token.get()) data[prop] = token[prop];
		data.client = data.clientId;
		data.user = data.userId;

		return data;
	}).catch((error) => console.error(error));
}

module.exports.revokeToken = function(token) {
	return OAuthTokensModel.findOne(
	{
		where: {
			refreshToken : token.refreshToken
		}
	}
	).then((refreshToken) => {
		return refreshToken
		.destroy()
		.then(() => {
			return !!refreshToken;
		})
		.catch((error) => console.error(error))
	}).catch((error) => console.error(error))
}

module.exports.setClient = function (client) {
	return OAuthClientsModel.create({
			clientId: client.clientId,
			clientSecret: client.clientSecret,
			redirectUris: client.redirectUris,
			grants:client.grants,
		})
		.then((client) => {
			client = client && typeof client == 'object' ? client.toJSON(): client;
			const data = new Object();
			for (const prop in client) data[prop]=client[prop];
			data.client = data.clientId;
			data.grants = data.grants;
			return data;
		})
		.catch((error) => console.error(error));
};

module.exports.setUser = function (user) {
	var otp = Math.random();
	otp = otp * 10000;
	otp = parseInt(otp);
	// console.log(otp);
	return OAuthUsersModel
		.create({
			username: user.username,
			password: user.password,
			name: user.name,
			otp: otp,
			verified: false
		})
		.then((userResult) => {
			userResult = userResult && typeof userResult == 'object' ? userResult.toJSON(): userResult;
			const data = new Object();
			for (const prop in userResult) data[prop] = userResult[prop];
			data.username = data.username;
			data.name = data.name;
			
			return data; 
		})
		.catch((error) => console.error(error));
};

module.exports.setTicketOrder = function (order) {
  return ticketOrderModel
    .create({
      username: order.username,
      event: order.event,
      quantity:order.quantity,
      unitpice: order.unitprice,
      completed: true,
      checkedin: false
    })
    .then((order) => {
      order = order && typeof order == 'object' ? order.toJSON(): order;
      const data = new Object();
      for (const prop in order) data[prop] = order[prop];
      data.username = data.username;
      data.name = data.name;
      
      return data; 
    })
    .catch((error) => console.error(error));
};


module.exports.getTicketOrder = function (barcode) {
	return ticketOrderModel.findOne(
	{
		where: {
			barcode: barcode
		}
	}
	).then((order) => {
			if (order == null) {
				return null;
			} else {
				return order.get();			
			}
	})
}