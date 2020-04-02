export const renderJson = (response, instance) => {

	response.setHeader('content-type', 'application/json');

	return response.send(JSON.stringify(instance));

};
