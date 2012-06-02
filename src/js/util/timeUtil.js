var timeConvert = function(material) {
	var temp = material.split("T");
	var temp2 = temp[0].split("-");
	var temp3 = temp[1].split("+");

	
	return temp2[1] + "/" + temp2[2] + " " + temp3[0];
};