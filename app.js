const qrcode = require("qrcode-terminal");
const axios = require("axios").default;

const getDni = async (dni) => {
	const path = "https://api.apis.net.pe/v1/dni?numero=" + dni;
	return axios.get(path);
};

const { Client } = require("whatsapp-web.js");
const client = new Client();

client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
	console.log("Client is ready!");
});

const splitMessage = (message) => {
	return message.split(" ");
};

const destructureMessage = (message) => {
	const [command, dni] = message;
	return {
		command,
		dni,
	};
};

const isCommandDNI = (command) => {
	return command === "/dni";
};

client.on("message", (message) => {
	const MSG = message.body.substring(0, message.body.length - 1);
	const splittedMessage = splitMessage(message.body);
	const { command, dni } = destructureMessage(splittedMessage);
	console.log(MSG);
	console.log(command);
	console.log(dni);
	const isValidCommand = isCommandDNI(command);

	if (isValidCommand) {
		getDni(dni)
			.then((response) => {
				const { data } = response;
				message.reply(
					"DNI: " + data.numeroDocumento + "\nNombre: " + data.nombre
				);
			})
			.catch((error) => {
				message.reply("No se encontró el DNI");
			});
	}
});

client.initialize();
